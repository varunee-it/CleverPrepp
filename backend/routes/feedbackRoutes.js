import express from 'express';
import protect from '../middleware/auth.js';
import {
  upsertFeedback,
  getMyFeedback,
  getPublicFeedback,
  getFeedbackStats
} from '../controllers/feedbackController.js';

const router = express.Router();

// Public routes
router.get('/', getPublicFeedback); // Alias for public
router.get('/public', getPublicFeedback);
router.get('/stats', getFeedbackStats);

// Protected routes
router.use(protect);
router.post('/', upsertFeedback); // Added POST support
router.put('/', upsertFeedback); // POST or PUT mapped to upsert
router.get('/my', getMyFeedback);

export default router;
