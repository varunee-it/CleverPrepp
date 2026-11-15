import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import { recordStudyActivity, getLocalDateString } from '../services/studyProgressService.js';
import { STUDY_CONFIG } from '../config/gamification.js';

/**
 * Automated Test Suite for Business Rule 1: Daily Streak XP Threshold
 * Enforced in: backend/services/studyProgressService.js:110-150
 * Threshold config: backend/config/gamification.js:2 (DAILY_STREAK_THRESHOLD = 50)
 */

test('Rule 1: Daily Streak XP Threshold & Boundaries', async (t) => {
  let inMemorySessions = [];
  let mockUser = null;

  // Setup test environment
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
        lastStreakDate: null,
      },
      gamification: { currentLevel: 1 },
      save: async function () { return this; }
    };

    // Mock User.findById
    User.findById = async () => mockUser;

    // Mock StudySession.create
    StudySession.create = async (doc) => {
      const session = {
        ...doc,
        _id: 'session_' + (inMemorySessions.length + 1),
        populate: async () => session,
      };
      inMemorySessions.push(session);
      return session;
    };

    // Mock StudySession.find
    StudySession.find = async (query) => {
      return inMemorySessions.filter((s) => {
        if (query.userId && String(s.userId) !== String(query.userId)) return false;
        if (query.localDate && s.localDate !== query.localDate) return false;
        if (query.activityType && s.activityType !== query.activityType) return false;
        return true;
      });
    };

    // Mock StudySession.findOne
    StudySession.findOne = async () => null;
  });

  await t.test('1.1 Below 50 XP does not qualify for a daily streak', async () => {
    // Perform upload_document (20 XP)
    const res1 = await recordStudyActivity(mockUser._id, 'upload_document', 0, {});
    assert.equal(res1.xpEarned, 20);
    assert.equal(mockUser.studyStats.currentStreak, 0, 'Streak should not increment below 50 XP');
    assert.equal(mockUser.studyStats.lastStreakDate, null);

    // Perform read_notes (10 XP) -> Total today is 30 XP (< 50 XP)
    const res2 = await recordStudyActivity(mockUser._id, 'read_notes', 0, {});
    assert.equal(res2.xpEarned, 10);
    assert.equal(mockUser.studyStats.currentStreak, 0, 'Streak should still be 0 at 30 XP');
    assert.equal(mockUser.studyStats.lastStreakDate, null);
  });

  await t.test('1.2 Exactly 50 XP qualifies and awards daily streak', async () => {
    // 20 XP (upload) + 20 XP (upload) + 10 XP (notes) = exactly 50 XP
    await recordStudyActivity(mockUser._id, 'upload_document', 0, {});
    await recordStudyActivity(mockUser._id, 'upload_document', 0, {});
    const res = await recordStudyActivity(mockUser._id, 'read_notes', 0, {});

    assert.equal(res.totalXP, 50);
    assert.equal(mockUser.studyStats.currentStreak, 1, 'Streak should increment to 1 at exactly 50 XP');
    assert.ok(mockUser.studyStats.lastStreakDate, 'lastStreakDate should be set');
    assert.equal(mockUser.studyStats.totalStudyDays, 1);
  });

  await t.test('1.3 More than 50 XP on the same day does not duplicate streak increment', async () => {
    // Reach 50 XP
    await recordStudyActivity(mockUser._id, 'upload_document', 0, {});
    await recordStudyActivity(mockUser._id, 'upload_document', 0, {});
    await recordStudyActivity(mockUser._id, 'read_notes', 0, {});
    assert.equal(mockUser.studyStats.currentStreak, 1);

    // Earn an additional 20 XP on the same day (total = 70 XP)
    const res = await recordStudyActivity(mockUser._id, 'upload_document', 0, {});
    assert.equal(res.totalXP, 70);
    assert.equal(mockUser.studyStats.currentStreak, 1, 'Streak must not increment twice on the same day');
  });

  await t.test('1.4 Consecutive day activity increments streak (diffDays === 1)', async () => {
    // Simulate user reached 50 XP yesterday
    const today = getLocalDateString(new Date(), 'UTC');
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate, 'UTC');

    mockUser.studyStats.currentStreak = 1;
    mockUser.studyStats.lastStreakDate = yesterday;
    mockUser.studyStats.totalStudyDays = 1;

    // Reach 50 XP today (25 min focus = 50 XP)
    await recordStudyActivity(mockUser._id, 'focus_session', 25, {});

    assert.equal(mockUser.studyStats.currentStreak, 2, 'Consecutive day activity should increment streak to 2');
    assert.equal(mockUser.studyStats.lastStreakDate, today);
    assert.equal(mockUser.studyStats.totalStudyDays, 2);
  });

  await t.test('1.5 Missed day resets streak back to 1 (diffDays > 1)', async () => {
    // Simulate user had streak 5, but last streak was 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const lastDate = getLocalDateString(threeDaysAgo, 'UTC');

    mockUser.studyStats.currentStreak = 5;
    mockUser.studyStats.longestStreak = 5;
    mockUser.studyStats.lastStreakDate = lastDate;
    mockUser.studyStats.totalStudyDays = 10;

    // Reach 50 XP today
    await recordStudyActivity(mockUser._id, 'focus_session', 25, {});

    assert.equal(mockUser.studyStats.currentStreak, 1, 'Missed day must reset current streak to 1');
    assert.equal(mockUser.studyStats.longestStreak, 5, 'Longest streak must be preserved');
  });

  await t.test('1.6 Calendar-day boundaries format accurately across timezones', () => {
    // 2026-11-17 20:00:00 UTC
    const eveningUtc = new Date('2026-11-17T20:00:00.000Z');

    // In UTC, this is still 2026-11-17
    const utcDate = getLocalDateString(eveningUtc, 'UTC');
    assert.equal(utcDate, '2026-11-17');

    // In IST (UTC+5:30), 20:00 UTC + 5:30 = 01:30 AM on 2026-11-18
    const istDate = getLocalDateString(eveningUtc, 'Asia/Kolkata');
    assert.equal(istDate, '2026-11-18');

    // In New York (UTC-5), 20:00 UTC - 5:00 = 15:00 on 2026-11-17
    const nyDate = getLocalDateString(eveningUtc, 'America/New_York');
    assert.equal(nyDate, '2026-11-17');
  });
});
