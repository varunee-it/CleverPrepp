import Feedback from '../models/Feedback.js';
import Document from '../models/Document.js';
import Quiz from '../models/Quize.js';
import Flashcard from '../models/Flashcard.js';
import User from '../models/User.js';

// Simple moderation check for spam/profanity
const performModeration = (text) => {
  const lowercaseText = text.toLowerCase();
  const bannedWords = ['spam', 'fuck', 'shit', 'bitch', 'asshole', 'buy now', 'click here'];
  const hasProfanity = bannedWords.some(word => lowercaseText.includes(word));
  
  // Basic check for repeated characters (e.g. "aaaaa")
  const hasKeyboardSmash = /(.)\1{4,}/.test(lowercaseText);
  
  // Basic check for URLs
  const hasLinks = /(http|https):\/\/[^\s]+/.test(lowercaseText);

  if (hasProfanity || hasKeyboardSmash || hasLinks) {
    return 'rejected';
  }
  
  // Auto-approve in development as requested
  return 'approved'; 
};

// =======================================
// @desc    Upsert user feedback (One review per user)
// @route   PUT /api/feedback
// @access  Private
// =======================================
export const upsertFeedback = async (req, res, next) => {
  try {
    const { rating, title, review, anonymous, wouldRecommend, device, version } = req.body;
    const userId = req.user._id;

    // Validate
    if (!rating || !title || !review) {
      return res.status(400).json({ success: false, message: 'Please provide rating, title, and review.' });
    }

    if (review.length < 30) {
      return res.status(400).json({ success: false, message: 'Review must be at least 30 characters.' });
    }

    // AI Moderation
    const status = performModeration(`${title} ${review}`);
    if (status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Review was rejected by moderation filters.' });
    }

    // Fetch user details for snapshot
    const user = await User.findById(userId);
    
    // Fetch stats
    const documentsUploaded = await Document.countDocuments({ userId });
    const quizzesCompleted = await Quiz.countDocuments({ userId, completedAt: { $ne: null } });
    const flashcardsGenerated = await Flashcard.countDocuments({ userId });

    const payload = {
      rating,
      title,
      review,
      anonymous,
      wouldRecommend,
      status,
      device,
      version,
      userStats: {
        documentsUploaded,
        quizzesCompleted,
        flashcardsGenerated
      },
      displayName: user.displayName || user.name,
      avatar: user.profileImage || user.avatar,
      course: user.course || 'Student',
      college: user.college || '',
    };

    // Check if review exists
    let feedback = await Feedback.findOne({ user: userId });

    if (feedback) {
      // Update existing
      payload.editedAt = Date.now();
      feedback = await Feedback.findOneAndUpdate({ user: userId }, payload, { new: true });
    } else {
      // Create new
      payload.user = userId;
      feedback = await Feedback.create(payload);
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error("[PUT /api/feedback] Error:", error);
    next(error);
  }
};

// =======================================
// @desc    Get user's own feedback
// @route   GET /api/feedback/my
// @access  Private
// =======================================
export const getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({ user: req.user._id });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

// =======================================
// @desc    Get public approved feedback
// @route   GET /api/feedback/public
// @access  Public
// =======================================
export const getPublicFeedback = async (req, res, next) => {
  try {
    const { tab } = req.query; // 'newest', 'top', 'helpful'
    
    let sortObj = { createdAt: -1 }; // default newest
    
    if (tab === 'top') {
      sortObj = { rating: -1, helpfulCount: -1, createdAt: -1 };
    } else if (tab === 'helpful') {
      sortObj = { helpfulCount: -1, createdAt: -1 };
    }

    const feedbacks = await Feedback.find({ status: 'approved' })
      .sort(sortObj)
      .limit(20)
      .select('-__v');

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    next(error);
  }
};

// =======================================
// @desc    Get feedback analytics for landing page
// @route   GET /api/feedback/stats
// @access  Public
// =======================================
export const getFeedbackStats = async (req, res, next) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          recommendCount: { $sum: { $cond: ['$wouldRecommend', 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          averageRating: 0,
          totalReviews: 0,
          recommendationPercent: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      });
    }

    const { averageRating, totalReviews, recommendCount, star5, star4, star3, star2, star1 } = stats[0];
    
    const recommendationPercent = Math.round((recommendCount / totalReviews) * 100);

    const distribution = {
      5: Math.round((star5 / totalReviews) * 100),
      4: Math.round((star4 / totalReviews) * 100),
      3: Math.round((star3 / totalReviews) * 100),
      2: Math.round((star2 / totalReviews) * 100),
      1: Math.round((star1 / totalReviews) * 100),
    };

    res.status(200).json({
      success: true,
      data: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews,
        recommendationPercent,
        distribution
      }
    });
  } catch (error) {
    next(error);
  }
};
