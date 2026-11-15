import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import { recordStudyActivity } from '../services/studyProgressService.js';

/**
 * Automated Test Suite for Business Rule 3: Study Activity Idempotency & Duplicate Prevention
 * Enforced in: backend/services/studyProgressService.js:52-65
 * Database Schema: backend/models/StudySession.js:48-52 (sparse: true, unique: true)
 */

test('Rule 3: Study Activity Idempotency & Duplicate Prevention', async (t) => {
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
      save: async function () { return this; },
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

    // Find one matches on userId and idempotencyKey
    StudySession.findOne = async (query) => {
      return inMemorySessions.find((s) => {
        if (query.userId && String(s.userId) !== String(query.userId)) return false;
        if (query.idempotencyKey && s.idempotencyKey === query.idempotencyKey) return true;
        return false;
      }) || null;
    };
  });

  await t.test('3.1 Valid study activity awards XP on first submission', async () => {
    const key = 'upload_doc_101';
    const res = await recordStudyActivity(
      mockUser._id,
      'upload_document',
      0,
      { title: 'Lecture 1.pdf' },
      '507f1f77bcf86cd799439099',
      key
    );

    assert.equal(res.xpEarned, 20, 'First submission must award 20 XP for upload_document');
    assert.equal(mockUser.studyStats.totalPoints, 20);
    assert.equal(inMemorySessions.length, 1);
    assert.equal(inMemorySessions[0].idempotencyKey, key);
  });

  await t.test('3.2 Repeating same activity with same idempotencyKey awards 0 XP', async () => {
    const key = 'upload_doc_duplicate';

    // First attempt
    const res1 = await recordStudyActivity(
      mockUser._id,
      'upload_document',
      0,
      { title: 'Lecture 1.pdf' },
      '507f1f77bcf86cd799439099',
      key
    );
    assert.equal(res1.xpEarned, 20);
    assert.equal(mockUser.studyStats.totalPoints, 20);

    // Duplicate attempt (e.g. offline queue retry or double-click)
    const res2 = await recordStudyActivity(
      mockUser._id,
      'upload_document',
      0,
      { title: 'Lecture 1.pdf' },
      '507f1f77bcf86cd799439099',
      key
    );

    assert.equal(res2.xpEarned, 0, 'Duplicate request must award exactly 0 XP');
    assert.equal(res2.todayXP, 0);
    assert.equal(mockUser.studyStats.totalPoints, 20, 'User totalPoints must remain unchanged');
    assert.equal(inMemorySessions.length, 1, 'No second StudySession record should be created');
  });

  await t.test('3.3 Different activities with distinct idempotency keys award XP independently', async () => {
    const key1 = 'quiz_complete_1';
    const key2 = 'focus_complete_2';

    // Activity 1: Quiz completion (10 base XP)
    const res1 = await recordStudyActivity(
      mockUser._id,
      'quiz_completed',
      0,
      { score: 100, totalQuestions: 5 },
      null,
      key1
    );
    assert.equal(res1.xpEarned, 10);
    assert.equal(mockUser.studyStats.totalPoints, 10);

    // Activity 2: Focus session (15 min = 30 XP)
    const res2 = await recordStudyActivity(
      mockUser._id,
      'focus_session',
      15,
      {},
      null,
      key2
    );
    assert.equal(res2.xpEarned, 30);
    assert.equal(mockUser.studyStats.totalPoints, 40, 'Total points must sum both distinct activities');
    assert.equal(inMemorySessions.length, 2);
  });

  await t.test('3.4 Mongoose schema definition enforces sparse unique index on idempotencyKey', () => {
    const idempotencyField = StudySession.schema.path('idempotencyKey');
    assert.ok(idempotencyField, 'idempotencyKey must be defined on StudySession schema');
    assert.equal(idempotencyField.options.unique, true, 'idempotencyKey must have unique: true');
    assert.equal(idempotencyField.options.sparse, true, 'idempotencyKey must have sparse: true');
  });
});
