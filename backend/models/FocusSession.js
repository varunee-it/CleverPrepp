import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ['running', 'paused', 'completed', 'abandoned', 'failed'],
    default: 'running'
  },
  plannedDuration: { 
    type: Number, // in seconds
    required: true 
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastPausedAt: {
    type: Date,
    default: null
  },
  accumulatedPauseTime: {
    type: Number, // in milliseconds
    default: 0
  },
  pauseCount: {
    type: Number,
    default: 0
  },
  lastHeartbeat: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  completionReason: {
    type: String,
    enum: ['natural', 'manual_early', 'timeout', 'null'],
    default: 'null'
  },
  abandonReason: {
    type: String,
    enum: ['timeout', 'replaced_by_new_session', 'null'],
    default: 'null'
  },
  replacedBy: {
    type: String,
    default: null
  },
  abandonedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  checklist: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
  }],
  device: {
    type: String,
    default: 'unknown'
  }
}, { 
  timestamps: true 
});

// Index to quickly find active sessions for a user
FocusSessionSchema.index({ userId: 1, status: 1 });

const FocusSession = mongoose.models.FocusSession || mongoose.model("FocusSession", FocusSessionSchema);
export default FocusSession;
