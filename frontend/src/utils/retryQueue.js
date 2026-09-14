import progressService from '../services/progressService';

const QUEUE_KEY = 'cleverprep_focus_retry_queue';
// Items older than 2 hours are considered stale and must not be replayed
const MAX_ITEM_AGE_MS = 2 * 60 * 60 * 1000;


const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

class RetryQueue {
  constructor() {
    this.isProcessing = false;
    this.queue = this._loadAndPrune();
    // Start processing asynchronously so it doesn't block instantiation
    Promise.resolve().then(() => this.processQueue());
  }

  // Load from localStorage and immediately discard items that are too old
  _loadAndPrune() {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      const now = Date.now();
      const fresh = parsed.filter(item => (now - item.timestamp) < MAX_ITEM_AGE_MS);
      // If we pruned anything, persist the cleaned queue immediately
      if (fresh.length !== parsed.length) {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(fresh));
      }
      return fresh;
    } catch {
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch {
      // Ignore storage quota errors
    }
  }

  /**
   * Remove all queued actions tied to a specific sessionId.
   * Called when a 'start' action fails — every subsequent action for that
   * sessionId (pause, resume, complete, updateChecklist) is now meaningless.
   */
  _purgeSessionId(sessionId) {
    const before = this.queue.length;
    this.queue = this.queue.filter(item => item.payload?.sessionId !== sessionId);
    if (this.queue.length < before) {
      this.saveQueue();
    }
  }

  enqueue(action, payload) {
    const taskId = generateId();
    const traceId = generateId();
    const sessionId = payload?.sessionId || payload?._id || 'unknown';
    
    const now = Date.now();
    const task = { 
      action, 
      payload, 
      taskId, 
      traceId, 
      sessionId, 
      timestamp: now, 
      createdAt: now,
      lastAttempt: null,
      attempt: 0,
      version: 1 
    };
    this.queue.push(task);
    

    this.saveQueue();
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const remainingQueue = [];

    for (const item of this.queue) {
      // Skip items that have already been pruned from the working list
      const alreadyPurged = !this.queue.includes(item);
      if (alreadyPurged) continue;

      item.attempt = (item.attempt || 0) + 1;
      item.lastAttempt = Date.now();


      try {
        // We pass the full item down so progressService can inject headers if needed
        // but progressService expects payload. We will inject headers at axios interceptor
        // For now, we inject taskId and traceId into payload so service can use them
        const payloadWithIds = { ...item.payload, _taskId: item.taskId, _traceId: item.traceId };
        
        switch (item.action) {
          case 'start':
            await progressService.startFocusSession(payloadWithIds);
            break;
          case 'pause':
            await progressService.pauseFocusSession(payloadWithIds.sessionId, payloadWithIds);
            break;
          case 'resume':
            await progressService.resumeFocusSession(payloadWithIds.sessionId, payloadWithIds);
            break;
          case 'complete':
            await progressService.completeFocusSession(payloadWithIds);
            break;
          case 'updateChecklist':
            await progressService.updateFocusChecklist(payloadWithIds.sessionId, payloadWithIds.checklist, payloadWithIds);
            break;
        }
        
      } catch (err) {
        const status = err.response?.status;

        if (status >= 400 && status < 500) {
          if (item.action === 'start' && item.sessionId) {
            this._purgeSessionId(item.sessionId);
          } else if (item.action === 'complete' && status === 404) {
             // If a complete gets a 404, only drop it if the start action is NO LONGER pending
             const startIsPending = this.queue.some(qItem => qItem.action === 'start' && qItem.sessionId === item.sessionId);
             if (startIsPending) {
                remainingQueue.push(item);
             } else {
                // The session doesn't exist and start is not pending, so drop it
             }
          } else if (status === 400 && err.response?.data?.error === "Session already completed") {
             // Already successfully processed by backend previously
             // Drop it implicitly by not pushing to remainingQueue
          } else {
             // Drop other unrecoverable 4xx errors
          }
        } else {
          remainingQueue.push(item);
        }
      }
    }

    this.queue = remainingQueue;
    this.saveQueue();
    this.isProcessing = false;
  }

  /**
   * Manually flush the entire queue. Used on logout or session reset.
   */
  clear() {
    this.queue = [];
    this.saveQueue();
  }
}

const retryQueue = new RetryQueue();
export default retryQueue;

