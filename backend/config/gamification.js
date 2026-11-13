export const STUDY_CONFIG = {
  DAILY_STREAK_THRESHOLD: 50, // Points required to earn/maintain a streak today
  MAX_FOCUS_XP_PER_DAY: 500, // Maximum XP a user can earn per day from focus sessions to prevent farming

  // Fixed points or base multipliers per activity type
  XP_VALUES: {
    upload_document: 20,
    read_notes: 10,
    flashcard_review: 1, // Per flashcard
    quiz_completed: 10, // Base points (could multiply by score)
    podcast_listening: 2, // Per minute
    focus_session: 2, // Per minute
    ai_chat: 5
  },

  // XP Required for each level (exponential/formula based)
  // e.g. Level N requires (N * 100) * 1.2 points
  calculateLevel: (totalXp) => {
    // simple formula for level calculation: Level = floor(sqrt(XP / 100)) + 1
    if (!totalXp || totalXp < 0) return 1;
    return Math.floor(Math.sqrt(totalXp / 100)) + 1;
  },

  xpForNextLevel: (currentLevel) => {
    // Inverse of calculateLevel to find XP for a specific level: XP = 100 * (Level - 1)^2
    return 100 * Math.pow(currentLevel, 2);
  }
};
