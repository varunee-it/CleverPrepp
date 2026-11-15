import test from 'node:test';
import assert from 'node:assert/strict';
import Quiz from '../models/Quize.js';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import { submitQuiz, resetQuiz } from '../controllers/quizController.js';

/**
 * Automated Test Suite for Business Rule 4: Quiz Resubmission Lock & Retake Rule
 * Enforced in: backend/controllers/quizController.js:90-97 (submitQuiz)
 * Reset endpoint: backend/controllers/quizController.js:280-307 (resetQuiz)
 */

test('Rule 4: Quiz Resubmission Lock & Reset Retake', async (t) => {
  const userId = '507f1f77bcf86cd799439011';
  let mockQuiz = null;

  // Mock response builder
  const createMockResponse = () => {
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      }
    };
    return res;
  };

  t.beforeEach(() => {
    mockQuiz = {
      _id: '507f1f77bcf86cd799439099',
      userId: userId,
      title: 'Operating Systems Quiz',
      totalQuestions: 2,
      questions: [
        {
          question: 'What is virtual memory?',
          options: ['Memory management technique', 'Physical RAM', 'Cache storage', 'Hard disk partition'],
          correctAnswer: 'Memory management technique'
        },
        {
          question: 'Which scheduling algorithm is non-preemptive?',
          options: ['FCFS', 'Round Robin', 'SRTF', 'Priority Preemptive'],
          correctAnswer: 'FCFS'
        }
      ],
      completedAt: null,
      userAnswers: [],
      score: 0,
      save: async function () { return this; }
    };

    // Mock Quiz.findOne
    Quiz.findOne = async (query) => {
      if (query._id === mockQuiz._id && query.userId === userId) {
        return mockQuiz;
      }
      return null;
    };

    // Mock User and StudySession to prevent background unhandled rejections during recordStudyActivity
    User.findById = async () => ({
      _id: userId,
      timezone: 'UTC',
      studyStats: { totalPoints: 0, currentStreak: 0 },
      save: async function () { return this; }
    });
    StudySession.create = async (doc) => ({
      ...doc,
      populate: async function () { return this; }
    });
    StudySession.find = async () => [];
    StudySession.findOne = async () => null;
  });

  await t.test('4.1 Incomplete quiz can be submitted successfully (HTTP 200)', async () => {
    const req = {
      params: { id: mockQuiz._id },
      user: { _id: userId },
      body: {
        answers: [
          { questionIndex: 0, selectedAnswer: 'Memory management technique' },
          { questionIndex: 1, selectedAnswer: 'FCFS' }
        ]
      }
    };
    const res = createMockResponse();

    await submitQuiz(req, res, () => {});

    assert.equal(res.statusCode, 200, 'Incomplete quiz submission must return HTTP 200');
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.score, 100);
    assert.equal(res.body.data.correctCount, 2);
    assert.ok(mockQuiz.completedAt, 'quiz.completedAt timestamp must be recorded');
  });

  await t.test('4.2 Completed quiz cannot be submitted again (HTTP 400)', async () => {
    // Mark quiz as already completed
    mockQuiz.completedAt = new Date('2026-11-17T10:00:00.000Z');
    mockQuiz.score = 100;

    const req = {
      params: { id: mockQuiz._id },
      user: { _id: userId },
      body: {
        answers: [
          { questionIndex: 0, selectedAnswer: 'Memory management technique' }
        ]
      }
    };
    const res = createMockResponse();

    await submitQuiz(req, res, () => {});

    assert.equal(res.statusCode, 400, 'Resubmission must be blocked with HTTP 400');
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Quiz already completed', 'Must return exact error message');
    assert.equal(res.body.statusCode, 400);
  });

  await t.test('4.3 Reset retake mechanism clears completedAt, score, and userAnswers', async () => {
    // Start with a completed quiz
    mockQuiz.completedAt = new Date();
    mockQuiz.score = 100;
    mockQuiz.userAnswers = [{ questionIndex: 0, selectedAnswer: 'A', isCorrect: true }];

    const req = {
      params: { id: mockQuiz._id },
      user: { _id: userId }
    };
    const res = createMockResponse();

    await resetQuiz(req, res, () => {});

    assert.equal(res.statusCode, 200, 'Reset retake must return HTTP 200');
    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'Quiz reset successfully');
    assert.equal(mockQuiz.completedAt, null, 'completedAt must be reset to null');
    assert.equal(mockQuiz.score, 0, 'score must be reset to 0');
    assert.equal(mockQuiz.userAnswers.length, 0, 'userAnswers must be cleared');
  });

  await t.test('4.4 Quiz can be submitted again after successful reset retake', async () => {
    // 1. Mark as completed
    mockQuiz.completedAt = new Date();
    mockQuiz.score = 50;

    // 2. Reset the quiz
    const resetReq = { params: { id: mockQuiz._id }, user: { _id: userId } };
    const resetRes = createMockResponse();
    await resetQuiz(resetReq, resetRes, () => {});
    assert.equal(mockQuiz.completedAt, null);

    // 3. Resubmit after reset
    const submitReq = {
      params: { id: mockQuiz._id },
      user: { _id: userId },
      body: {
        answers: [
          { questionIndex: 0, selectedAnswer: 'Memory management technique' }
        ]
      }
    };
    const submitRes = createMockResponse();
    await submitQuiz(submitReq, submitRes, () => {});

    assert.equal(submitRes.statusCode, 200, 'Post-reset submission must succeed with HTTP 200');
    assert.ok(mockQuiz.completedAt, 'New completedAt timestamp must be recorded');
  });

  await t.test('4.5 Submitting non-existent quiz returns HTTP 404', async () => {
    const req = {
      params: { id: 'non_existent_quiz_id' },
      user: { _id: userId },
      body: { answers: [] }
    };
    const res = createMockResponse();

    await submitQuiz(req, res, () => {});

    assert.equal(res.statusCode, 404, 'Non-existent quiz must return HTTP 404');
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Quiz not found');
  });
});
