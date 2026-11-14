import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One review per user
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, 'Please add a title for your review'],
    maxlength: 100,
  },
  review: {
    type: String,
    required: [true, 'Please add your review experience'],
    minlength: 30,
    maxlength: 500,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  wouldRecommend: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  
  // Snapshots at time of submission/update for verified user feel
  userStats: {
    documentsUploaded: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    flashcardsGenerated: { type: Number, default: 0 },
  },

  // Copied from user profile (makes querying easier without deep populations if needed)
  displayName: String,
  avatar: String,
  course: String,
  college: String,

  // Social / Engagement
  likes: {
    type: Number,
    default: 0,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },

  // Meta
  device: String,
  version: String,
  editedAt: {
    type: Date,
  }
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
