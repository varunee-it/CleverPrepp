import { devLog, devWarn } from '../utils/logger';
import focusStorage from "./FocusStorage";
import { recordStudyStreak } from "./authService";

class FocusStatsEngine {
  // Evaluates session stats and achievements based on the latest completed session and MongoDB backend history
  compute(session, globalHistory = []) {
    try {
      const stats = focusStorage.loadStats();
      const records = focusStorage.loadPersonalRecords();
      const achievements = focusStorage.loadAchievements();
      const dailyGoals = focusStorage.loadDailyGoals();

      const now = new Date();
      // Calculate duration and completion rate based on MongoDB schema
      const completedDuration = session.duration || 0; // standard duration is in minutes
      const completedDurationMins = completedDuration;

      // Only update goals, streaks, and achievements if the user actually spent time focusing (at least 1 minute)
      if (completedDurationMins < 1) {
        return { unlockedAchievements: [] };
      }

      // 2. Update Daily Goals
      dailyGoals.minutesCompleted += completedDurationMins;
      if (session.status === "completed") {
        dailyGoals.sessionsCompleted += 1;
      }

      // Sync activity categories to daily goals
      const act = (session.activityType || "study_session").toLowerCase();
      if (act.includes("pdf") || act.includes("read")) dailyGoals.pdfsCompleted += 1;
      else if (act.includes("flashcard")) dailyGoals.flashcardsCompleted += 1;
      else if (act.includes("quiz")) dailyGoals.quizzesCompleted += 1;
      else if (act.includes("podcast")) dailyGoals.podcastsCompleted += 1;
      else if (act.includes("note") || act.includes("view")) dailyGoals.notesCompleted += 1;

      focusStorage.saveDailyGoals(dailyGoals);

      // 3. Update Streaks (Only on successful completed sessions)
      let streakIncreased = false;
      if (session.status === "completed") {
        const todayStr = session.localDate || now.toLocaleDateString("en-CA");
        recordStudyStreak(todayStr).catch(err => devWarn("Backend streak sync failed:", err));
        const lastActive = stats.lastActiveDate;

        if (!lastActive) {
          stats.currentStreak = 1;
          stats.longestStreak = 1;
          stats.lastActiveDate = todayStr;
          streakIncreased = true;
        } else {
          const diffDays = this._getDaysDifference(lastActive, todayStr);

          if (diffDays === 0) {
            // Already focused today, streak remains same
          } else if (diffDays === 1) {
            // Consecutive day
            stats.currentStreak += 1;
            stats.lastActiveDate = todayStr;
            streakIncreased = true;
          } else {
            // Missed day(s) - check streak freezes
            if (stats.streakFreezes > 0) {
              // Deduct streak freeze and recover
              stats.streakFreezes -= 1;
              stats.currentStreak += 1;
              stats.lastActiveDate = todayStr;
              streakIncreased = true;
              devLog(`[Streak Engine] Streak freeze consumed. Saved streak! Remaining freezes: ${stats.streakFreezes}`);
            } else {
              // Streak broken - reset to 1
              stats.currentStreak = 1;
              stats.lastActiveDate = todayStr;
              streakIncreased = true;
            }
          }
        }

        if (stats.currentStreak > stats.longestStreak) {
          stats.longestStreak = stats.currentStreak;
        }
      }

      // Update total focus credits and stats
      stats.totalMinutes += completedDurationMins;
      stats.totalFocusPoints += completedDurationMins * 10; // 10 coins per focused minute
      focusStorage.saveStats(stats);

      // 4. Update Personal Records
      if (completedDurationMins > records.longestSession) {
        records.longestSession = completedDurationMins;
      }
      if (stats.longestStreak > records.highestStreak) {
        records.highestStreak = stats.longestStreak;
      }

      // Re-evaluate favorite environments and motivations
      records.favoriteEnvironment = this._getFavoriteItem(globalHistory, "environment");
      records.favoriteMotivation = this._getFavoriteItem(globalHistory, "motivation");

      focusStorage.savePersonalRecords(records);

      // 5. Evaluate Achievements
      const unlockedAchievements = [];
      const newAchievements = [...achievements];

      const achievementCriteria = [
        { id: "first_session", title: "🌱 First Session", desc: "Completed your first study block" },
        { id: "streak_7", title: "🔥 7 Day Streak", desc: "Maintained a 7-day study streak" },
        { id: "sessions_30", title: "⚡ 30 Sessions", desc: "Completed 30 focus sessions" },
        { id: "hours_100", title: "📚 100 Hours", desc: "Studied for a total of 100 hours" },
        { id: "night_owl", title: "🌙 Night Owl", desc: "Studied after midnight (12:00 AM - 4:00 AM)" },
        { id: "early_bird", title: "🌅 Early Bird", desc: "Studied early in the morning (5:00 AM - 8:00 AM)" },
        { id: "deep_focus", title: "🧠 Deep Focus", desc: "Completed a study session of at least 45 minutes" },
        { id: "productivity_master", title: "🚀 Productivity Master", desc: "Completed 4 sessions in a single day" }
      ];

      // Total completed sessions count
      const totalCompletedCount = globalHistory.filter(h => h.status === "completed").length;
      const totalHours = stats.totalMinutes / 60;

      // Check each criteria
      achievementCriteria.forEach(crit => {
        const isAlreadyUnlocked = achievements.some(a => a.id === crit.id);
        if (isAlreadyUnlocked) return;

        let shouldUnlock = false;

        if (crit.id === "first_session" && totalCompletedCount >= 1) {
          shouldUnlock = true;
        } else if (crit.id === "streak_7" && stats.longestStreak >= 7) {
          shouldUnlock = true;
        } else if (crit.id === "sessions_30" && totalCompletedCount >= 30) {
          shouldUnlock = true;
        } else if (crit.id === "hours_100" && totalHours >= 100) {
          shouldUnlock = true;
        } else if (crit.id === "deep_focus" && completedDurationMins >= 45 && session.status === "completed") {
          shouldUnlock = true;
        } else if (crit.id === "night_owl") {
          const hour = new Date(session.occurredAt || session.createdAt || now).getHours();
          if (hour >= 0 && hour < 4) shouldUnlock = true;
        } else if (crit.id === "early_bird") {
          const hour = new Date(session.occurredAt || session.createdAt || now).getHours();
          if (hour >= 5 && hour < 8) shouldUnlock = true;
        } else if (crit.id === "productivity_master") {
          const todayStr = session.localDate || now.toLocaleDateString("en-CA");
          const todayCompletedCount = globalHistory.filter(h => h.localDate === todayStr && h.status === "completed").length;
          if (todayCompletedCount >= 4) shouldUnlock = true;
        }

        if (shouldUnlock) {
          const unlockedItem = {
            id: crit.id,
            title: crit.title,
            desc: crit.desc,
            unlockedAt: new Date().toLocaleDateString()
          };
          newAchievements.push(unlockedItem);
          unlockedAchievements.push(unlockedItem);
        }
      });

      if (unlockedAchievements.length > 0) {
        focusStorage.saveAchievements(newAchievements);
      }

      return { unlockedAchievements };
    } catch (err) {
      devWarn("[FocusStatsEngine] Failed to log session or compute streaks:", err.message);
      return { unlockedAchievements: [] };
    }
  }

  // Calculate day difference between two dates YYYY-MM-DD
  _getDaysDifference(date1Str, date2Str) {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Helper to find favorite items in array (e.g. environment, motivation)
  _getFavoriteItem(globalHistory, field) {
    if (!globalHistory || globalHistory.length === 0) return "None";
    const counts = {};
    let favorite = "None";
    let maxCount = 0;

    globalHistory.forEach(item => {
      let val = "None";
      if (field === "environment") {
        val = item.metadata?.ambientMode || item.selectedSound || "None";
      } else if (field === "motivation") {
        val = item.metadata?.motivationTrack || "None";
      }

      if (!val || val === "None" || val === "Silence Off") return;
      counts[val] = (counts[val] || 0) + 1;
      if (counts[val] > maxCount) {
        maxCount = counts[val];
        favorite = val;
      }
    });

    return favorite;
  }

  recordActivityStreak() {
    try {
      const stats = focusStorage.loadStats();
      const todayStr = new Date().toLocaleDateString("en-CA");
      const lastActive = stats.lastActiveDate;

      // Sync to backend asynchronously
      recordStudyStreak(todayStr).catch(err => devWarn("Backend streak sync failed:", err));

      if (!lastActive) {
        stats.currentStreak = 1;
        stats.longestStreak = 1;
        stats.lastActiveDate = todayStr;
      } else {
        const diffDays = this._getDaysDifference(lastActive, todayStr);

        if (diffDays === 0) {
          return;
        } else if (diffDays === 1) {
          stats.currentStreak += 1;
          stats.lastActiveDate = todayStr;
        } else {
          if (stats.streakFreezes > 0) {
            stats.streakFreezes -= 1;
            stats.currentStreak += 1;
            stats.lastActiveDate = todayStr;
          } else {
            stats.currentStreak = 1;
            stats.lastActiveDate = todayStr;
          }
        }
      }

      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }

      focusStorage.saveStats(stats);
    } catch (e) {
      devWarn("Failed to record activity streak:", e);
    }
  }
}

export const focusStatsEngine = new FocusStatsEngine();
export default focusStatsEngine;
