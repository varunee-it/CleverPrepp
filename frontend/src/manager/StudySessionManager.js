import { devLog, devWarn } from '../utils/logger';
import {
  STATUS_IDLE,
  STATUS_CREATED,
  STATUS_RUNNING,
  STATUS_PAUSED,
  STATUS_FINALIZING,
  STATUS_COMPLETED,
  STATUS_CANCELLED,
  SYNC_LOCAL_ONLY,
  SYNC_SYNCING,
  SYNC_SYNCED,
  SYNC_PENDING,
  ACTIVITY_QUICK,
  SOURCE_DASHBOARD
} from "../constants/StudySessionConstants";
import StudySessionStorage from "../services/StudySessionStorage";
import focusStatsEngine from "../services/FocusStatsEngine";
import progressService from "../services/progressService";
import retryQueue from "../utils/retryQueue";

/**
 * Manager responsible for governing Study Session lifecycles, states transitions,
 * timestamp calculations, and localStorage persistence.
 */
class StudySessionManager {
  constructor() {
    this.session = null;
    this.listeners = [];
    this.onExpireCallback = null;
  }

  registerExpireCallback(callback) {
    this.onExpireCallback = callback;
  }

  // State checks for FSM transition enforcements
  canStart() {
    return this.session !== null && this.session.status === STATUS_CREATED;
  }

  canPause() {
    return this.session !== null && this.session.status === STATUS_RUNNING;
  }

  canResume() {
    return this.session !== null && this.session.status === STATUS_PAUSED;
  }

  canComplete() {
    return this.session !== null && this.session.status === STATUS_RUNNING;
  }

  canCancel() {
    return this.session !== null && [STATUS_RUNNING, STATUS_PAUSED, STATUS_CREATED].includes(this.session.status);
  }

  canReset() {
    return this.session !== null && [STATUS_COMPLETED, STATUS_CANCELLED, STATUS_CREATED].includes(this.session.status);
  }

  /**
   * Enforces internal session invariants.
   * Only completed sessions are allowed to have a completion reason.
   */
  _normalizeSessionState(session) {
    if (session && session.status !== STATUS_COMPLETED) {
      session.completionReason = null;
    }
    return session;
  }

  /**
   * Registers a subscriber callback to observe session modifications.
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Send immediate initial state
    listener(this.session ? { ...this.session } : null);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Dispatches updates to all active context listeners.
   */
  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.session ? { ...this.session } : null);
      } catch (err) {
        console.error("[StudySessionManager] Subscriber callback failed:", err);
      }
    });
  }

  /**
   * Restores a previously saved study session from storage and updates remainingTime.
   */
  restoreSession() {
    try {
      const saved = StudySessionStorage.load();
      if (!saved) {
        // Automatically fetch active session from backend if locally empty
        progressService.getActiveFocusSession().then((res) => {
          if (res?.data) {
            this.session = res.data;
            this.session.remainingTime = this.session.plannedDuration || 1800; // Will be recalced below
            StudySessionStorage.save(this.session);
            this.notify();
            this.restoreSession(); // Re-run with loaded data
          }
        }).catch(err => devLog("No active backend session:", err));

        this.session = null;
        this.notify();
        return;
      }

      // Valid session status list
      const validStatuses = [
        STATUS_IDLE,
        STATUS_CREATED,
        STATUS_RUNNING,
        STATUS_PAUSED,
        STATUS_COMPLETED,
        STATUS_CANCELLED
      ];

      // Validate session structure and status. If invalid, reset to STATUS_IDLE
      if (!saved.status || !validStatuses.includes(saved.status)) {
        this.resetToIdle();
        return;
      }

      // Automatically migrate older sessions to current model format
      if (!saved.id && !saved._id) {
        throw new Error("Missing session ID. Purging stale state.");
      }
      
      const defaultSessionModel = {
        id: saved.id || saved._id,
        mode: saved.mode || "quick",
        documentId: saved.documentId || null,
        documentTitle: saved.documentTitle || null,
        activityType: saved.activityType || ACTIVITY_QUICK,
        goal: saved.goal || null,
        duration: typeof saved.duration === "number" ? saved.duration : 1800,
        remainingTime: typeof saved.remainingTime === "number" ? saved.remainingTime : 1800,
        status: saved.status,
        startedAt: saved.startedAt || null,
        pausedAt: saved.pausedAt || null,
        accumulatedPauseTime: saved.accumulatedPauseTime || 0,
        selectedSound: saved.selectedSound || null,
        source: saved.source || SOURCE_DASHBOARD,
        notes: saved.notes || "",
        createdAt: saved.createdAt || Date.now(),
        updatedAt: saved.updatedAt || Date.now(),
        completedAt: saved.completedAt || null,
        device: saved.device || navigator.userAgent,
        timezone: saved.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        version: saved.version || 1,
        completionReason: saved.completionReason || null
      };

      this._normalizeSessionState(defaultSessionModel);

      const now = Date.now();
      let remaining = defaultSessionModel.remainingTime;
      let status = defaultSessionModel.status;
      let endedAt = saved.endedAt || null;

      if (defaultSessionModel.status === STATUS_RUNNING) {
        const elapsedMs = now - (defaultSessionModel.startedAt || now) - defaultSessionModel.accumulatedPauseTime;
        remaining = Math.max(0, defaultSessionModel.duration - Math.floor(elapsedMs / 1000));
      } else if (defaultSessionModel.status === STATUS_PAUSED) {
        const elapsedMs = (defaultSessionModel.pausedAt || now) - (defaultSessionModel.startedAt || now) - defaultSessionModel.accumulatedPauseTime;
        remaining = Math.max(0, defaultSessionModel.duration - Math.floor(elapsedMs / 1000));
      }

      this.session = {
        ...defaultSessionModel,
        remainingTime: remaining,
        status,
        endedAt
      };

      StudySessionStorage.save(this.session);
      this.notify();
    } catch (err) {
      devWarn("[StudySessionManager] Error restoring study session. Resetting session to IDLE state:", err.message);
      this.resetToIdle();
    }
  }

  // Gracefully clear/reset session to idle
  resetToIdle() {
    this.session = null;
    StudySessionStorage.clear();
    retryQueue.clear();
    this.notify();
  }

  /**
   * Initializes a new study session in the STATUS_CREATED state.
   */
  createSession({
    mode = "quick",
    duration = 1800,
    documentId = null,
    documentTitle = null,
    activityType = ACTIVITY_QUICK,
    goal = null,
    source = SOURCE_DASHBOARD
  } = {}) {
    if (this.session && ![STATUS_IDLE, STATUS_COMPLETED, STATUS_CANCELLED].includes(this.session.status)) {
      devWarn("[StudySessionManager] Cannot create session: Active session already exists.");
      return false;
    }

    const now = Date.now();
    this.session = {
      id: `session_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      documentId,
      documentTitle,
      activityType,
      goal,
      duration,
      remainingTime: duration,
      status: STATUS_CREATED,
      startedAt: null,
      pausedAt: null,
      accumulatedPauseTime: 0,
      selectedSound: null,
      source,
      notes: "",
      checklist: [],
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      device: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      version: 1,
      completionReason: null,
      syncState: null
    };

    this._normalizeSessionState(this.session);

    StudySessionStorage.save(this.session);
    this.notify();
    return true;
  }

  /**
   * Transitions session status from created to running.
   */
  startSession() {
    if (!this.canStart()) {
      devWarn("[StudySessionManager] Invalid transition: startSession called outside CREATED status.");
      return false;
    }

    const now = Date.now();
    this.session.status = STATUS_RUNNING;
    this.session.startedAt = now;
    this.session.updatedAt = now;
    
    const payload = { 
      sessionId: this.session.id, 
      plannedDuration: this.session.duration, 
      device: navigator.userAgent,
      checklist: this.session.checklist || []
    };
    
    progressService.startFocusSession(payload).catch(() => {
      retryQueue.enqueue('start', payload);
    });
    
    // Set a periodic heartbeat every 3 minutes
    this.heartbeatInterval = setInterval(() => {
       if (this.session && (this.session.status === STATUS_RUNNING || this.session.status === STATUS_PAUSED)) {
          progressService.heartbeatFocusSession(this.session.id).catch(() => {});
       }
    }, 3 * 60 * 1000);

    StudySessionStorage.save(this.session);
    this.notify();
    return true;
  }

  /**
   * Transitions session status from running to paused.
   */
  pauseSession() {
    if (!this.canPause()) {
      devWarn("[StudySessionManager] Invalid transition: pauseSession called outside RUNNING status.");
      return false;
    }

    const now = Date.now();
    this.session.status = STATUS_PAUSED;
    this.session.pausedAt = now;
    this.session.updatedAt = now;

    const payload = { sessionId: this.session.id };
    progressService.pauseFocusSession(this.session.id, payload).catch(() => {
      retryQueue.enqueue('pause', payload);
    });

    StudySessionStorage.save(this.session);
    this.notify();
    return true;
  }

  /**
   * Transitions session status from paused back to running.
   */
  resumeSession() {
    if (!this.canResume()) {
      devWarn("[StudySessionManager] Invalid transition: resumeSession called outside PAUSED status.");
      return false;
    }

    const now = Date.now();
    const pauseDuration = now - this.session.pausedAt;
    this.session.status = STATUS_RUNNING;
    this.session.accumulatedPauseTime += pauseDuration;
    this.session.pausedAt = null;
    this.session.updatedAt = now;

    const payload = { sessionId: this.session.id };
    progressService.resumeFocusSession(this.session.id, payload).catch(() => {
      retryQueue.enqueue('resume', payload);
    });

    StudySessionStorage.save(this.session);
    this.notify();
    return true;
  }

  /**
   * Transitions session status from running/paused to cancelled.
   */
  cancelSession() {
    if (!this.canCancel()) {
      devWarn("[StudySessionManager] Invalid transition: cancelSession called outside active statuses.");
      return false;
    }

    const now = Date.now();
    this.session.status = STATUS_CANCELLED;
    this.session.endedAt = now;
    this.session.updatedAt = now;

    this._normalizeSessionState(this.session);

    // Purge any queued API tasks for this session — it was cancelled locally
    // and may never have been created on the backend
    retryQueue.clear();

    StudySessionStorage.save(this.session);
    this.notify();
    return true;
  }

  finalizeSession(reason = 'manual_early') {
    if (!this.canComplete()) {
      devWarn("[StudySessionManager] Invalid transition: finalizeSession called outside RUNNING status.");
      return null;
    }

    if (this.heartbeatInterval) {
       clearInterval(this.heartbeatInterval);
    }

    // ---------------------------------------------------------------------------------
    // ARCHITECTURAL INVARIANT:
    // elapsedSeconds is the canonical source of truth for study duration.
    // remainingTime is derived for UI countdown purposes only.
    // History, analytics, XP, and persistence must never derive elapsed
    // time using (plannedDuration - remainingTime).
    // ---------------------------------------------------------------------------------
    const now = Date.now();
    this.session.status = STATUS_FINALIZING;
    this.session.syncState = SYNC_LOCAL_ONLY;
    this.session.endedAt = now;
    this.session.completedAt = now;
    this.session.updatedAt = now;
    this.session.completionReason = reason;

    const payload = Object.freeze(JSON.parse(JSON.stringify({
      id: this.session.id,
      sessionId: this.session.id,
      reason,
      completionReason: reason,
      startedAt: this.session.startedAt,
      endedAt: now,
      elapsedSeconds: this.session.elapsedSeconds,
      plannedSeconds: this.session.duration,
      metadata: {
        goal: this.session.goal,
        focusMode: this.session.activityType,
        documentId: this.session.documentId,
        documentTitle: this.session.documentTitle,
        selectedSound: this.session.selectedSound,
        notes: this.session.notes
      },
      timezone: this.session.timezone
    })));

    StudySessionStorage.save(this.session);
    this.notify();
    return payload;
  }

  markSyncing() {
    if (this.session) {
      this.session.syncState = SYNC_SYNCING;
      this.session.updatedAt = Date.now();
      StudySessionStorage.save(this.session);
      this.notify();
    }
  }

  markSynced(result) {
    if (this.session) {
      this.session.status = STATUS_COMPLETED;
      this.session.syncState = SYNC_SYNCED;
      this.session.updatedAt = Date.now();
      
      // Merge canonical metadata from server
      if (result) {
        this.session.totalXP = result.totalXP;
        this.session.xpEarned = result.xpEarned;
        this.session.currentStreak = result.currentStreak;
      }
      
      this._normalizeSessionState(this.session);
      StudySessionStorage.save(this.session);
      this.notify();
    }
  }

  markSyncPending() {
    if (this.session) {
      this.session.status = STATUS_COMPLETED;
      this.session.syncState = SYNC_PENDING;
      this.session.updatedAt = Date.now();
      this._normalizeSessionState(this.session);
      StudySessionStorage.save(this.session);
      this.notify();
    }
  }

  /**
   * Updates checklist specifically and syncs with backendnd
   */
  updateChecklist(checklist) {
    if (!this.session) {
      devWarn("[StudySessionManager] No active session to update checklist.");
      return false;
    }
    this.session.checklist = checklist;
    this.session.updatedAt = Date.now();
    StudySessionStorage.save(this.session);
    this.notify();

    // Only fire API call asynchronously if the session is actually running
    // Otherwise it remains a local draft until startSession() sends it
    if (this.session.status !== STATUS_CREATED) {
      const payload = { sessionId: this.session.id, checklist };
      progressService.updateFocusChecklist(this.session.id, checklist, payload).catch(() => {
        retryQueue.enqueue('updateChecklist', payload);
      });
    }
    
    return true;
  }

  /**
   * Heartbeat for tracking real active time
   */
  resetSession() {
    if (!this.canReset()) {
      devWarn("[StudySessionManager] Invalid transition: resetSession called outside completed, cancelled, or created statuses.");
      return false;
    }

    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    // Clear any pending queue items; the session is done
    retryQueue.clear();

    this.session = null;
    StudySessionStorage.clear();
    this.notify();
    return true;
  }

  /**
   * Updates specific fields on the active session.
   * @param {Object} fields - Fields to patch.
   */
  updateSession(fields = {}) {
    if (!this.session) {
      devWarn("[StudySessionManager] No active session to update.");
      return false;
    }

    this.session = {
      ...this.session,
      ...fields,
      updatedAt: Date.now()
    };

    StudySessionStorage.save(this.session);
    this.notify();
    return true;
  }

  /**
   * Recalculates remaining duration dynamically on clock ticks.
   * Internal hook for background timers.
   */
  tick() {
    if (!this.session || this.session.status !== STATUS_RUNNING) return;

    const now = Date.now();
    const elapsedMs = now - this.session.startedAt - this.session.accumulatedPauseTime;
    const remaining = Math.max(0, this.session.duration - Math.floor(elapsedMs / 1000));

    let updated = false;
    
    if (remaining !== this.session.remainingTime) {
      this.session.remainingTime = remaining;
      updated = true;
    }
    
    const newElapsedSeconds = Math.floor(elapsedMs / 1000);
    if (newElapsedSeconds !== this.session.elapsedSeconds) {
      this.session.elapsedSeconds = newElapsedSeconds;
      updated = true;
    }

    if (remaining <= 0) {
      if (this.onExpireCallback) {
        this.onExpireCallback();
      }
    } else if (updated) {
      this.session.updatedAt = now;
      StudySessionStorage.save(this.session);
      this.notify();
    }
  }
}

// Single instance of StudySessionManager export for global app binding
const studySessionManagerInstance = new StudySessionManager();
export default studySessionManagerInstance;
export { studySessionManagerInstance as StudySessionManager };
