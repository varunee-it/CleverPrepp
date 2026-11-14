import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  badgeId: { 
    type: String, 
    required: true 
  },
  earnedAt: { 
    type: Date, 
    default: Date.now 
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed 
  } // E.g., for storing exactly when a 7-day streak was hit
}, { 
  timestamps: true 
});

// Ensure a user can only earn a specific badge once (if appropriate, or just index for fast lookup)
AchievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
export default Achievement;
