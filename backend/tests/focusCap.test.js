import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import { recordStudyActivity, getLocalDateString } from '../services/studyProgressService.js';
import { STUDY_CONFIG } from '../config/gamification.js';

/**
 * Automated Test Suite for Business Rule 2: Focus Session Daily XP Cap (Anti-Farming Rule)
 * Enforced in: backend/services/studyProgressService.js:72-80
 * Cap config: backend/config/gamification.js:3 (MAX_FOCUS_XP_PER_DAY = 500)
 */

test('Rule 2: Focus Session Daily XP Cap & Reset', async (t) => {
  let inMemorySessions = [];
  let mockUser = null;

  t.beforeEach(() => {
    inMemorySessions = [];
    mockUser = {
      _id: '507f1f77bcf86cd799439011',
      timezone: 'UTC',
      studyStats: {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalStudyDays: 0,
        totalStudyMinutes: 0,
        lastStreakDate: null,
      },
      gamification: { currentLevel: 1 },
      save: async function () { return this; }
    };

    User.findById = async () => mockUser;

    StudySession.create = async (doc) => {
      const session = {
        ...doc,
        _id: 'session_' + (inMemorySessions.length + 1),
        populate: async () => session,
      };
      inMemorySessions.push(session);
      return session;
    };

    StudySession.find = async (query) => {
      return inMemorySessions.filter((s) => {
        if (query.userId && String(s.userId) !== String(query.userId)) return false;
        if (query.localDate && s.localDate !== query.localDate) return false;
        if (query.activityType && s.activityType !== query.activityType) return false;
        return true;
      });
    };

    StudySession.findOne = async () => null;
  });

  await t.test('2.1 Focus sessions below 500 XP award standard rate (2 XP/min)', async () => {
    // 60 minutes focus session = 120 XP
    const res = await recordStudyActivity(mockUser._id, 'focus_session', 60, {});
    assert.equal(res.xpEarned, 120);
    assert.equal(mockUser.studyStats.totalPoints, 120);
    assert.equal(mockUser.studyStats.totalStudyMinutes, 60);
  });

  await t.test('2.2 Focus session approaching 500 XP is clamped to remaining allowance', async () => {
    // Session 1: 240 minutes = 480 XP
    const res1 = await recordStudyActivity(mockUser._id, 'focus_session', 240, {});
    assert.equal(res1.xpEarned, 480);
    assert.equal(mockUser.studyStats.totalPoints, 480);

    // Session 2: 20 minutes (normally 40 XP). Since 480 + 40 = 520 > 500, pointsEarned is clamped to 20 XP
    const res2 = await recordStudyActivity(mockUser._id, 'focus_session', 20, {});
    assert.equal(res2.xpEarned, 20, 'Awarded XP must be clamped to remaining 20 XP to reach 500 cap');
    assert.equal(mockUser.studyStats.totalPoints, 500, 'Total user points must reach exactly 500');
    assert.equal(mockUser.studyStats.totalStudyMinutes, 260, 'Study minutes should still record the full 260 min');
  });

  await t.test('2.3 Additional focus sessions after reaching 500 cap award 0 XP', async () => {
    // Reach 500 XP cap (250 minutes = 500 XP)
    await recordStudyActivity(mockUser._id, 'focus_session', 250, {});
    assert.equal(mockUser.studyStats.totalPoints, 500);

    // Additional 30-minute session on same day
    const res = await recordStudyActivity(mockUser._id, 'focus_session', 30, {});
    assert.equal(res.xpEarned, 0, 'Must award 0 XP once 500 cap is reached');
    assert.equal(mockUser.studyStats.totalPoints, 500, 'Total points must not exceed 500');
    assert.equal(mockUser.studyStats.totalStudyMinutes, 280, 'Session time is still tracked for analytics');
    assert.equal(inMemorySessions.length, 2, 'Session record is created in database');
  });

  await t.test('2.4 Daily focus cap resets on the next local calendar day', async () => {
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate, 'UTC');

    // Seed in-memory database with yesterday's maxed-out focus session (500 XP)
    inMemorySessions.push({
      _id: 'session_yesterday',
      userId: mockUser._id,
      activityType: 'focus_session',
      duration: 250,
      pointsEarned: 500,
      localDate: yesterday,
      occurredAt: yesterdayDate,
    });
    mockUser.studyStats.totalPoints = 500;

    // Today's focus session should query today's sessions, finding 0 XP, and award full points
    const resToday = await recordStudyActivity(mockUser._id, 'focus_session', 30, {});
    assert.equal(resToday.xpEarned, 60, 'Next day focus session must award full 60 XP because cap reset');
    assert.equal(mockUser.studyStats.totalPoints, 560, 'Total points should increase by 60');
  });

  await t.test('2.5 Ineligible focus session (isEligibleForXP: false) awards 0 XP', async () => {
    // Focus sessions under 15 minutes are flagged with isEligibleForXP: false
    const res = await recordStudyActivity(mockUser._id, 'focus_session', 10, { isEligibleForXP: false });
    assert.equal(res.xpEarned, 0, 'Ineligible sessions must award 0 XP');
    assert.equal(mockUser.studyStats.totalPoints, 0);
  });
});
