import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quize.js';
import StudySession from '../models/StudySession.js';
import { getUserAnalytics } from '../services/studyProgressService.js';
import { serializeFocusSession } from '../utils/serializers.js';

// =======================================
// @desc    Get user learning statistics
// @route   GET /api/progress/dashboard
// @access  Private
// =======================================
export const getDashboard = async (req, res, next) => {
  try {
    console.log(`[GET /api/progress/dashboard] Fetching dashboard for user: ${req.user?._id}`);
    const userId = req.user._id;

    // =========================
    // Get total counts
    // =========================
    const totalDocuments = await Document.countDocuments({
      userId,
    });

    const totalFlashcardSets =
      await Flashcard.countDocuments({
        userId,
      });

    const totalQuizzes = await Quiz.countDocuments({
      userId,
    });

    const completedQuizzes =
      await Quiz.countDocuments({
        userId,
        completedAt: { $ne: null },
      });

    // =========================
    // Flashcard statistics
    // =========================
    const flashcardSets = await Flashcard.find({
      userId,
    });

    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;

      // Reviewed cards
      reviewedFlashcards += set.cards.filter(
        (card) => card.reviewCount > 0
      ).length;

      // Starred cards
      starredFlashcards += set.cards.filter(
        (card) => card.isStarred
      ).length;
    });

    // =========================
    // Quiz statistics
    // =========================
    const quizzes = await Quiz.find({
      userId,
      completedAt: { $ne: null },
    });

    // Calculate average score
    let averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce(
              (sum, q) => sum + q.score,
              0
            ) / quizzes.length
          )
        : 0;

    // =========================
    // Recent documents
    // =========================
    const recentDocuments = await Document.find({
      userId,
    })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select('title lastAccessed');

    // =========================
    // Recent quizzes
    // =========================
    const recentQuizzes = await Quiz.find({
      userId,
    })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('documentId', 'title')
      .select('title completedAt score');

    // Check decay
    let analyticsData = {};
    try {
      const userTimezone = req.user.timezone || 'UTC';
      analyticsData = await getUserAnalytics(userId, userTimezone);
    } catch (err) {
      console.error("[GET /api/progress/dashboard] Error fetching study analytics:", err);
    }

    // =========================
    // Final response
    // =========================
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          ...analyticsData.lifetime
        },
        
        today: analyticsData.today,
        heatmap: analyticsData.heatmap,
        focusActivity: analyticsData.focusActivity,
        distribution: analyticsData.distribution,
        premium: analyticsData.premium,

        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
        },
      },
    });
  } catch (error) {
    console.error("[GET /api/progress/dashboard] Dashboard error:", error);
    next(error);
  }
};

// =======================================
// @desc    Get user study history (paginated)
// @route   GET /api/progress/history
// @access  Private
// =======================================
export const getStudyHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const query = { userId };
    
    // Optional filtering
    if (req.query.activityType) {
      query.activityType = req.query.activityType;
    }

    const total = await StudySession.countDocuments(query);
    
    const history = await StudySession.find(query)
      .sort({ occurredAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('documentId', 'title type');

    res.status(200).json({
      success: true,
      count: history.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: history.map(serializeFocusSession)
    });
  } catch (error) {
    console.error("[GET /api/progress/history] Error fetching history:", error);
    next(error);
  }
};