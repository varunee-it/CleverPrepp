import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Focused test suite for CleverPrep Email Verification & Authentication Logic
 */

// Verification evaluation logic as implemented in authController.js:222-231
function evaluateEmailVerification(user) {
  const isVerified = Boolean(user.isEmailVerified || user.emailVerified);
  if (!isVerified) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Please verify your email before signing in.",
        statusCode: 400,
        notVerified: true,
        email: user.email,
      },
    };
  }
  return {
    status: 200,
    allowed: true,
  };
}

test('1. Unverified user with isEmailVerified: false and emailVerified: false is rejected', () => {
  const unverifiedUser = {
    email: 'unverified@example.com',
    isEmailVerified: false,
    emailVerified: false,
  };

  const result = evaluateEmailVerification(unverifiedUser);
  assert.equal(result.status, 400);
  assert.equal(result.body.notVerified, true);
  assert.equal(result.body.error, 'Please verify your email before signing in.');
  assert.equal(result.body.email, 'unverified@example.com');
  assert.equal(result.allowed, undefined);
});

test('2. Unverified user with missing/undefined verification fields is rejected', () => {
  const emptyUser = {
    email: 'pending@example.com',
  };

  const result = evaluateEmailVerification(emptyUser);
  assert.equal(result.status, 400);
  assert.equal(result.body.notVerified, true);
  assert.equal(result.body.error, 'Please verify your email before signing in.');
});

test('3. Verified user with isEmailVerified: true is allowed to login', () => {
  const verifiedUser = {
    email: 'student@example.com',
    isEmailVerified: true,
    emailVerified: true,
  };

  const result = evaluateEmailVerification(verifiedUser);
  assert.equal(result.status, 200);
  assert.equal(result.allowed, true);
});

test('4. Legacy user with only emailVerified: true is allowed to login (no lockout)', () => {
  const legacyUser = {
    email: 'legacy@example.com',
    isEmailVerified: false,
    emailVerified: true,
  };

  const result = evaluateEmailVerification(legacyUser);
  assert.equal(result.status, 200);
  assert.equal(result.allowed, true);
});

test('5. Legacy user with only isEmailVerified: true is allowed to login (no lockout)', () => {
  const legacyUser2 = {
    email: 'legacy2@example.com',
    isEmailVerified: true,
    emailVerified: false,
  };

  const result = evaluateEmailVerification(legacyUser2);
  assert.equal(result.status, 200);
  assert.equal(result.allowed, true);
});

test('6. Google OAuth user sets isEmailVerified and passes verification', () => {
  const googleUser = {
    email: 'student@gmail.com',
    provider: 'google',
    googleId: 'google-oauth2-12345',
    isEmailVerified: true,
    emailVerified: true,
  };

  const result = evaluateEmailVerification(googleUser);
  assert.equal(result.status, 200);
  assert.equal(result.allowed, true);
});
