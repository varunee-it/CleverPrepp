import express from 'express';
import { getDashboard, getStudyHistory } from '../controllers/progressController.js';
import { 
  startFocusSession, 
  getActiveSession, 
  pauseFocusSession, 
  resumeFocusSession, 
  heartbeatFocusSession, 
  completeFocusSession,
  updateFocusChecklist
} from '../controllers/focusController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Dashboard route
router.get('/dashboard', getDashboard);
router.get('/history', getStudyHistory);

// Focus routes
router.post('/focus/start', startFocusSession);
router.get('/focus/active', getActiveSession);
router.post('/focus/:id/pause', pauseFocusSession);
router.post('/focus/:id/resume', resumeFocusSession);
router.post('/focus/:id/heartbeat', heartbeatFocusSession);
router.post('/focus/:id/complete', completeFocusSession);
router.patch('/focus/:id/checklist', updateFocusChecklist);

export default router;