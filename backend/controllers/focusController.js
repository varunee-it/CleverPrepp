import FocusSession from '../models/FocusSession.js';
import { recordStudyActivity } from '../services/studyProgressService.js';
import { serializeFocusSession } from '../utils/serializers.js';

const DEBUG_SYNC = process.env.NODE_ENV === "development";
const logSync = (event, data) => {
  if (!DEBUG_SYNC) return;
  console.log(JSON.stringify({
    component: "FocusController",
    event,
    timestamp: new Date().toISOString(),
    ...data
  }));
};

const extractCorrelationIds = (req) => ({
  traceId: req.headers['x-trace-id'] || null,
  taskId: req.headers['x-queue-task'] || null,
  sessionId: req.headers['x-session-id'] || null
});

// Helper to calculate actual active duration in seconds
const calculateActiveDurationSeconds = (session) => {
  let endTime = session.completedAt || Date.now();
  if (session.status === 'paused' && session.lastPausedAt) {
    endTime = session.lastPausedAt;
  }
  const totalElapsedMs = endTime - session.startedAt;
  const activeMs = totalElapsedMs - session.accumulatedPauseTime;
  return Math.max(0, Math.floor(activeMs / 1000));
};

export const startFocusSession = async (req, res, next) => {
  const cIds = extractCorrelationIds(req);
  logSync('API_REQUEST', { ...cIds, action: 'start' });
  try {
    const { sessionId, plannedDuration, device, checklist } = req.body;
    const userId = req.user._id;

    if (!sessionId) {
      return res.status(400).json({ success: false, error: "sessionId is required" });
    }

    if (plannedDuration === undefined || plannedDuration === null || plannedDuration <= 0) {
      return res.status(400).json({ success: false, error: "A valid plannedDuration is required" });
    }

    // Check if there is already an active session
    logSync('MONGO_FIND', { ...cIds, query: { userId, status: { $in: ['running', 'paused'] } } });
    let existingSession = await FocusSession.findOne({ 
      userId, 
      status: { $in: ['running', 'paused'] } 
    });
    logSync('MONGO_RESULT', { ...cIds, found: !!existingSession, _id: existingSession?._id });

    if (existingSession) {
      if (existingSession._id === sessionId) {
        // It's a retry of the same session start, just return it
        return res.status(200).json({
          success: true,
          message: "Session already running.",
          data: serializeFocusSession(existingSession)
        });
      }
    }

    // Safely create the new session first. If this fails, the old session remains untouched.
    logSync('MONGO_CREATE', { ...cIds, _id: sessionId });
    const newSession = await FocusSession.create({
      _id: sessionId,
      userId,
      plannedDuration,
      device: device || 'unknown',
      status: 'running',
      checklist: checklist || []
    });
    logSync('MONGO_CREATE_RESULT', { ...cIds, success: true });

    // Now that the new session is successfully persisted, abandon the old one if it existed.
    if (existingSession && existingSession._id !== sessionId) {
      logSync('MONGO_UPDATE', { ...cIds, _id: existingSession._id, action: 'abandon' });
      await FocusSession.updateOne(
        { _id: existingSession._id },
        { 
          $set: { 
            status: 'abandoned',
            abandonReason: 'replaced_by_new_session',
            replacedBy: sessionId,
            abandonedAt: Date.now()
          } 
        }
      );
    }

    res.status(201).json({
      success: true,
      data: serializeFocusSession(newSession)
    });
  } catch (error) {
    console.error("[POST /api/progress/focus/start] Error:", error);
    next(error);
  }
};

export const getActiveSession = async (req, res, next) => {
  try {
    const session = await FocusSession.findOne({ 
      userId: req.user._id, 
      status: { $in: ['running', 'paused'] } 
    });

    if (session) {
      // Expire if no heartbeat in 15 mins
      const timeSinceHeartbeat = Date.now() - new Date(session.lastHeartbeat).getTime();
      if (timeSinceHeartbeat > 15 * 60 * 1000) {
        session.status = 'abandoned';
        await session.save();
        return res.status(200).json({ success: true, data: null });
      }
    }

    res.status(200).json({ success: true, data: serializeFocusSession(session) });
  } catch (error) {
    next(error);
  }
};

export const pauseFocusSession = async (req, res, next) => {
  const cIds = extractCorrelationIds(req);
  logSync('API_REQUEST', { ...cIds, action: 'pause' });
  try {
    logSync('MONGO_FIND', { ...cIds, query: { _id: req.params.id, userId: req.user._id } });
    const session = await FocusSession.findOne({ _id: req.params.id, userId: req.user._id });
    logSync('MONGO_RESULT', { ...cIds, found: !!session });
    
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });
    
    if (session.status !== 'running') {
      return res.status(400).json({ success: false, error: `Cannot pause a session in status: ${session.status}` });
    }

    session.status = 'paused';
    session.lastPausedAt = Date.now();
    session.pauseCount = (session.pauseCount || 0) + 1;
    session.lastHeartbeat = Date.now();
    
    logSync('MONGO_UPDATE', { ...cIds, action: 'save_paused' });
    await session.save();

    res.status(200).json({ success: true, data: serializeFocusSession(session) });
  } catch (error) {
    next(error);
  }
};

export const resumeFocusSession = async (req, res, next) => {
  const cIds = extractCorrelationIds(req);
  logSync('API_REQUEST', { ...cIds, action: 'resume' });
  try {
    logSync('MONGO_FIND', { ...cIds, query: { _id: req.params.id, userId: req.user._id } });
    const session = await FocusSession.findOne({ _id: req.params.id, userId: req.user._id });
    logSync('MONGO_RESULT', { ...cIds, found: !!session });
    
    if (!session) return res.status(404).json({ success: false, error: "Session not found" });

    if (session.status !== 'paused') {
      return res.status(400).json({ success: false, error: `Cannot resume a session in status: ${session.status}` });
    }

    const pausedDurationMs = Date.now() - new Date(session.lastPausedAt).getTime();
    session.accumulatedPauseTime += pausedDurationMs;
    session.status = 'running';
    session.lastPausedAt = null;
    session.lastHeartbeat = Date.now();
    
    logSync('MONGO_UPDATE', { ...cIds, action: 'save_resumed' });
    await session.save();

    res.status(200).json({ success: true, data: serializeFocusSession(session) });
  } catch (error) {
    next(error);
  }
};

export const heartbeatFocusSession = async (req, res, next) => {
  try {
    const session = await FocusSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, status: { $in: ['running', 'paused'] } },
      { lastHeartbeat: Date.now() },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, error: "Active session not found" });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

  export const completeFocusSession = async (req, res, next) => {
    const cIds = extractCorrelationIds(req);
    logSync('API_REQUEST', { ...cIds, action: 'complete' });
    try {
      const { 
        completionReason,
        goal,
        focusMode,
        documentId,
        documentTitle,
        selectedSound,
        notes
      } = req.body;
      
      logSync('MONGO_FIND', { ...cIds, query: { _id: req.params.id, userId: req.user._id } });
      const session = await FocusSession.findOne({ _id: req.params.id, userId: req.user._id });
      logSync('MONGO_RESULT', { ...cIds, found: !!session });
      
      if (!session) return res.status(404).json({ success: false, error: "Session not found" });
      if (session.status === 'completed') {
        return res.status(400).json({ success: false, error: "Session already completed" });
      }
  
      session.completedAt = Date.now();
      const activeSeconds = calculateActiveDurationSeconds(session);
      const activeMinutes = Math.round(activeSeconds / 60);
  
      session.status = 'completed';
      session.completionReason = completionReason || 'manual_early';
      
      logSync('MONGO_UPDATE', { ...cIds, action: 'save_completed' });
      await session.save();
  
      const minXpMinutes = parseInt(process.env.MIN_XP_SESSION_MINUTES, 10) || 15;
      const isEligibleForXP = activeMinutes >= minXpMinutes;
  
      // Extract detailed metadata for the study journal
      const metadata = {
        type: 'focus', 
        plannedDuration: session.plannedDuration,
        pauseCount: session.pauseCount,
        completionReason: session.completionReason,
        isEligibleForXP,
        goal: goal || null,
        documentTitle: documentTitle || null,
        ambientMode: selectedSound || null,
        notes: notes || null,
        checklist: session.checklist || [],
        totalTasks: session.checklist?.length || 0,
        completedTasks: session.checklist?.filter(t => t.completed).length || 0,
        completionPercentage: session.checklist?.length ? 
          Math.round((session.checklist.filter(t => t.completed).length / session.checklist.length) * 100) : 0,
        device: session.device,
        timezone: req.user.timezone || 'UTC'
      };
  
      // Await study progress update (to catch failures)
      const result = await recordStudyActivity(
        req.user._id,
        'focus_session',
        activeMinutes,
        {
          ...metadata,
          focusMode: focusMode || "study_session"
        },
        documentId || null, 
        `focus_${session._id}`
      );

    res.status(200).json({
      success: true,
      message: isEligibleForXP ? "Focus session completed and XP awarded." : "Focus session completed (no XP for < 15m).",
      data: { 
        session: { ...serializeFocusSession(session), activeMinutes },
        xpEarned: result.xpEarned,
        totalXP: result.totalXP,
        currentStreak: result.currentStreak
      }
    });
  } catch (error) {
    console.error("[POST /api/progress/focus/complete] Error:", error);
    next(error);
  }
};

export const updateFocusChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checklist } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(checklist)) {
      return res.status(400).json({ success: false, error: "Checklist must be an array" });
    }

    const session = await FocusSession.findOne({ _id: id, userId });
    
    if (!session) {
      return res.status(404).json({ success: false, error: "Focus session not found" });
    }

    // Allow updating checklist even if paused or recently completed
    session.checklist = checklist;
    await session.save();

    res.status(200).json({
      success: true,
      message: "Checklist updated",
      data: serializeFocusSession(session)
    });
  } catch (error) {
    console.error("[PATCH /api/progress/focus/:id/checklist] Error:", error);
    next(error);
  }
};
