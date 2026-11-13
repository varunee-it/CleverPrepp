import StudySession from '../models/StudySession.js';
import User from '../models/User.js';
import { STUDY_CONFIG } from '../config/gamification.js';

/**
 * Helper to get the local YYYY-MM-DD string for a user's timezone from a specific UTC date.
 * If userTimezone is missing, defaults to UTC.
 */
export const getLocalDateString = (utcDate, userTimezone = 'UTC') => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: userTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(utcDate); // Returns YYYY-MM-DD
};

/**
 * Calculates XP based on activity type and metadata/duration.
 */
export const calculatePoints = (activityType, durationMinutes = 0, metadata = {}) => {
  const baseXP = STUDY_CONFIG.XP_VALUES[activityType] || 0;
  
  if (activityType === 'flashcard_review' && metadata.cardsReviewed) {
    return baseXP * metadata.cardsReviewed;
  }
  
  if (activityType === 'podcast_listening' || activityType === 'focus_session') {
    if (metadata.isEligibleForXP === false) return 0;
    return baseXP * (durationMinutes || 0);
  }
  
  if (activityType === 'quiz_completed') {
    // Optionally multiply by score percentage
    const scoreMult = (metadata.score !== undefined) ? metadata.score / 100 : 1;
    return Math.round(baseXP * scoreMult);
  }
  
  return baseXP;
};

/**
 * Records a study activity, calculates points, updates StudySession, and updates User streak.
 * Incorporates idempotency protection using an idempotencyKey.
 */
export const recordStudyActivity = async (userId, activityType, durationMinutes = 0, metadata = {}, documentId = null, idempotencyKey = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Check Idempotency if key is provided
    if (idempotencyKey) {
      const existingSession = await StudySession.findOne({ userId, idempotencyKey });
      if (existingSession) {
        console.log(`[StudyProgress] Idempotency hit for key ${idempotencyKey}. Skipping duplicate.`);
        await existingSession.populate('documentId', 'title type');
        return {
          session: existingSession,
          xpEarned: 0,
          totalXP: user.studyStats?.totalPoints || 0,
          currentStreak: user.studyStats?.currentStreak || 0,
          todayXP: 0
        };
      }
    }

    const occurredAt = new Date(); // Immutable UTC timestamp
    const userTimezone = metadata.timezone || user.timezone || 'UTC';
    const localDate = getLocalDateString(occurredAt, userTimezone);
    let pointsEarned = calculatePoints(activityType, durationMinutes, metadata);
    
    // Apply Focus Session Daily Cap
    if (activityType === 'focus_session') {
      const todayFocusSessions = await StudySession.find({ userId, localDate, activityType: 'focus_session' });
      const todayFocusPoints = todayFocusSessions.reduce((acc, curr) => acc + curr.pointsEarned, 0);
      if (todayFocusPoints + pointsEarned > STUDY_CONFIG.MAX_FOCUS_XP_PER_DAY) {
        pointsEarned = Math.max(0, STUDY_CONFIG.MAX_FOCUS_XP_PER_DAY - todayFocusPoints);
        console.log(`[StudyProgress] Focus XP capped for user ${userId}. Earned: ${pointsEarned}`);
      }
    }
    
    // Create Study Session record
    const studySession = await StudySession.create({
      userId,
      activityType,
      documentId,
      duration: durationMinutes,
      pointsEarned,
      metadata,
      localDate,
      occurredAt,
      idempotencyKey: idempotencyKey || undefined
    });

    await studySession.populate('documentId', 'title type');

    // Update User Stats caching
    user.studyStats.totalStudyMinutes = (user.studyStats.totalStudyMinutes || 0) + durationMinutes;
    user.studyStats.totalPoints = (user.studyStats.totalPoints || 0) + pointsEarned;
    
    // Calculate current level
    const newLevel = STUDY_CONFIG.calculateLevel(user.studyStats.totalPoints);
    if (newLevel > (user.gamification?.currentLevel || 1)) {
      if (!user.gamification) user.gamification = {};
      user.gamification.currentLevel = newLevel;
      // Optional: push a level up achievement or notification here
    }

    // --- Streak Logic ---
    // Calculate total points for the localDate
    const todaySessions = await StudySession.find({ userId, localDate });
    const todayTotalPoints = todaySessions.reduce((acc, curr) => acc + curr.pointsEarned, 0);

    if (todayTotalPoints >= STUDY_CONFIG.DAILY_STREAK_THRESHOLD) {
      if (!user.studyStats) user.studyStats = {};
      const lastStreakDate = user.studyStats.lastStreakDate;
      
      if (lastStreakDate !== localDate) { // If streak hasn't been awarded for *today* yet
        if (!user.studyStats) user.studyStats = {};
        let currentStreak = user.studyStats.currentStreak || 0;
        let totalStudyDays = user.studyStats.totalStudyDays || 0;
        
        if (!lastStreakDate) {
          // First time earning a streak
          currentStreak = 1;
        } else {
          // Calculate days difference
          // Since both are YYYY-MM-DD, we can parse them as UTC midnight to avoid skew
          const d1 = new Date(`${lastStreakDate}T00:00:00Z`);
          const d2 = new Date(`${localDate}T00:00:00Z`);
          const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            currentStreak += 1;
          } else if (diffDays > 1) {
            // Missed a day
            currentStreak = 1;
          }
        }

        user.studyStats.currentStreak = currentStreak;
        user.studyStats.totalStudyDays = totalStudyDays + 1;
        user.studyStats.lastStreakDate = localDate;
        
        if (currentStreak > (user.studyStats.longestStreak || 0)) {
          user.studyStats.longestStreak = currentStreak;
        }
      }
    }

    await user.save();
    return {
      session: studySession,
      xpEarned: pointsEarned,
      totalXP: user.studyStats?.totalPoints || 0,
      currentStreak: user.studyStats?.currentStreak || 0
    };
  } catch (error) {
    console.error(`[StudyProgress] Error recording activity: ${error.message}`);
    throw error;
  }
};

/**
 * Aggregates analytics for the user.
 */
export const getUserAnalytics = async (userId, userTimezone = 'UTC') => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error('User not found');
  
  const todayDateStr = getLocalDateString(new Date(), userTimezone);
  
  // Get today's sessions
  const todaySessions = await StudySession.find({ userId, localDate: todayDateStr }).lean();
  
  const todayPoints = todaySessions.reduce((acc, curr) => acc + curr.pointsEarned, 0);
  const todayMinutes = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);
  const todayFocusPoints = todaySessions.filter(s => s.activityType === 'focus_session').reduce((acc, curr) => acc + curr.pointsEarned, 0);
  
  // Aggregate recent days (e.g., last 7 days for bar chart or last 365 days for heatmap)
  // For the Github calendar, we can group by localDate
  const allSessions = await StudySession.aggregate([
    { $match: { userId: user._id } },
    { $group: { 
        _id: "$localDate", 
        totalPoints: { $sum: "$pointsEarned" },
        totalMinutes: { $sum: "$duration" },
        activities: { $push: "$activityType" }
      } 
    },
    { $sort: { "_id": 1 } }
  ]);
  
  const sessionsMap = {};
  allSessions.forEach(session => {
    sessionsMap[session._id] = session;
  });

  const getIntensityLevel = (points) => {
    if (!points || points === 0) return 0;
    if (points <= 20) return 1;
    if (points <= 50) return 2;
    if (points <= 100) return 3;
    return 4;
  };

  const todayDateObj = new Date(new Date().toLocaleString("en-US", { timeZone: userTimezone }));
  todayDateObj.setHours(0, 0, 0, 0);

  const dayOfWeek = todayDateObj.getDay();
  const daysToSubtract = (52 * 7) + dayOfWeek; // (52 weeks + days since Sunday)
  const startDate = new Date(todayDateObj);
  startDate.setDate(todayDateObj.getDate() - daysToSubtract);

  const heatmapData = [];
  const currentDate = new Date(startDate);
  
  const currentStreak = user.studyStats?.currentStreak || 0;
  const lastStreakDate = user.studyStats?.lastStreakDate;
  const lastStreakObj = lastStreakDate ? new Date(`${lastStreakDate}T00:00:00Z`) : null;

  while (currentDate <= todayDateObj) {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const session = sessionsMap[dateStr];
    const points = session ? session.totalPoints : 0;
    
    let isCurrentStreak = false;
    if (lastStreakObj && currentStreak > 0) {
      const currObj = new Date(`${dateStr}T00:00:00Z`);
      const diff = Math.round((lastStreakObj - currObj) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < currentStreak) {
        isCurrentStreak = true;
      }
    }

    heatmapData.push({
      date: dateStr,
      points: points,
      minutes: session ? session.totalMinutes : 0,
      activities: session ? session.activities : [],
      intensityLevel: session && (points > 0 || session.totalMinutes > 0) ? getIntensityLevel(points || session.totalMinutes) : 0,
      isToday: dateStr === todayDateStr,
      isCurrentStreak: isCurrentStreak
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // ----------------------------------------
  // Generate 30-Day Focus Activity Array
  // ----------------------------------------
  const focusActivity = [];
  const thirtyDaysAgo = new Date(todayDateObj);
  thirtyDaysAgo.setDate(todayDateObj.getDate() - 29);
  
  const current30Date = new Date(thirtyDaysAgo);
  while (current30Date <= todayDateObj) {
    const yyyy = current30Date.getFullYear();
    const mm = String(current30Date.getMonth() + 1).padStart(2, '0');
    const dd = String(current30Date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    const session = sessionsMap[dateStr];
    focusActivity.push({
      date: dateStr,
      minutes: session ? session.totalMinutes : 0
    });
    
    current30Date.setDate(current30Date.getDate() + 1);
  }

  // ----------------------------------------
  // Generate 30-Day Distribution Array (Pie Chart)
  // ----------------------------------------
  const distributionMap = {};
  
  // Aggregate from the last 30 days of data in sessionsMap
  Object.keys(sessionsMap).forEach((dateStr) => {
    const dObj = new Date(`${dateStr}T00:00:00Z`);
    // Only include last 30 days
    if (dObj >= thirtyDaysAgo) {
      const session = sessionsMap[dateStr];
      if (session && session.activities) {
        session.activities.forEach((act) => {
           const type = act.activityType || 'unknown';
           distributionMap[type] = (distributionMap[type] || 0) + (act.duration || 0);
        });
      }
    }
  });

  const distribution = Object.keys(distributionMap).map(type => ({
    name: type,
    value: distributionMap[type]
  })).filter(d => d.value > 0);

  // ----------------------------------------
  // Generate Premium Analytics & Insights
  // ----------------------------------------

  // Calculate Best Study Hour
  const rawSessions = await StudySession.find({ userId: user._id }).lean();
  let hourCounts = {};
  rawSessions.forEach(s => {
      const hour = new Date(s.occurredAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  let bestHour = 'Coming Soon';
  if (Object.keys(hourCounts).length > 0) {
      const maxHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
      bestHour = maxHour + ':00 - ' + (parseInt(maxHour) + 1) + ':00';
  }

  // Calculate Weekly Improvement
  const currentWeekMin = heatmapData.slice(-7).reduce((acc, d) => acc + d.minutes, 0);
  const lastWeekMin = heatmapData.slice(-14, -7).reduce((acc, d) => acc + d.minutes, 0);
  let weeklyImprovement = 0;
  if (lastWeekMin > 0) {
      weeklyImprovement = Math.round(((currentWeekMin - lastWeekMin) / lastWeekMin) * 100);
  }

  // Calculate Personal Records
  let longestSession = 0;
  let highestXpDay = 0;
  let mostActiveWeekMin = 0;
  
  rawSessions.forEach(s => {
      if (s.duration > longestSession) longestSession = s.duration;
  });
  
  heatmapData.forEach(d => {
      if (d.points > highestXpDay) highestXpDay = d.points;
  });

  for(let i=0; i<heatmapData.length; i+=7) {
      const weekMin = heatmapData.slice(i, i+7).reduce((acc, d) => acc + d.minutes, 0);
      if (weekMin > mostActiveWeekMin) mostActiveWeekMin = weekMin;
  }

  const deepFocusScore = Math.round((user.studyStats?.totalStudyMinutes || 0) * 1.5 + (user.studyStats?.totalPoints || 0) * 0.5);

  const aiInsights = [];
  if (bestHour !== 'Coming Soon') {
      aiInsights.push({ icon: '🔥', text: 'You\'re most productive between ' + bestHour + '.' });
  }
  if (user.studyStats?.currentStreak > 0) {
      aiInsights.push({ icon: '📚', text: 'Consistency pays off. Your streak is ' + user.studyStats.currentStreak + ' days.' });
  } else {
      aiInsights.push({ icon: '📚', text: 'Flashcards improve your streak consistency. Try reviewing 20 cards today.' });
  }

  return {
    today: {
      points: todayPoints,
      minutes: todayMinutes,
      focusPoints: todayFocusPoints,
      isStreakEarned: todayPoints >= STUDY_CONFIG.DAILY_STREAK_THRESHOLD,
      goal: STUDY_CONFIG.DAILY_STREAK_THRESHOLD,
      focusCap: STUDY_CONFIG.MAX_FOCUS_XP_PER_DAY
    },
    lifetime: {
      currentStreak: user.studyStats?.currentStreak || 0,
      longestStreak: user.studyStats?.longestStreak || 0,
      totalStudyDays: user.studyStats?.totalStudyDays || 0,
      totalMinutes: user.studyStats?.totalStudyMinutes || 0,
      totalPoints: user.studyStats?.totalPoints || 0,
      level: user.gamification?.currentLevel || 1,
      xpForNextLevel: STUDY_CONFIG.xpForNextLevel(user.gamification?.currentLevel || 1)
    },
    heatmap: heatmapData,
    focusActivity,
    distribution,
    premium: {
      deepFocusScore,
      strongestSubject: 'Coming Soon',
      bestStudyHour: bestHour,
      weeklyImprovement,
      insights: aiInsights,
      records: {
          longestSession,
          highestXpDay,
          fastestQuiz: 'Coming Soon',
          mostActiveWeekMin
      }
    }
  };
};
