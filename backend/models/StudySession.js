import mongoose from 'mongoose';

const StudySessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  activityType: { 
    type: String, 
    enum: [
      'upload_document', 
      'read_notes', 
      'flashcard_review', 
      'quiz_completed', 
      'podcast_listening', 
      'focus_session', 
      'ai_chat'
    ],
    required: true 
  },
  documentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Document' 
  },
  duration: { 
    type: Number, 
    default: 0 
  }, // in minutes
  pointsEarned: { 
    type: Number, 
    default: 0 
  }, // How many points this specific session yielded
  metadata: { 
    type: mongoose.Schema.Types.Mixed 
  }, // Flexible field (e.g., { score: 85, cardsReviewed: 20 })
  localDate: { 
    type: String, 
    required: true,
    index: true
  }, // The YYYY-MM-DD it occurred in the user's timezone
  occurredAt: {
    type: Date,
    default: Date.now,
    required: true
  }, // Immutable UTC timestamp of the event
  idempotencyKey: {
    type: String,
    sparse: true,
    unique: true
  } // Prevent duplicate processing of the exact same event
}, { 
  timestamps: true 
});

// Compound index for fast daily/weekly/monthly aggregations
StudySessionSchema.index({ userId: 1, localDate: 1 });

const StudySession = mongoose.models.StudySession || mongoose.model("StudySession", StudySessionSchema);
export default StudySession;
