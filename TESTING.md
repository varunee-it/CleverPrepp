# Software Testing Specification: CleverPrep

**Project:** CleverPrep — AI-Powered Personalized Learning & Exam Preparation Platform  
**Academic Program:** M.Sc. (IT), Dhirubhai Ambani University  
**Project Guide:** Prof. Shruti Bhilare  
**Test Framework:** Node.js Native Test Runner (`node:test`) & Assertions (`node:assert/strict`)  

---

## 1. Business Rule Testing Coverage

**Testing Coverage:** All 5 of the 5 business rules are automated and tested (26 individual test cases across 5 test files, 30 runner test nodes passing).

| Rule | Test file:line | If untested — what stops you |
|---|---|---|
| **Rule 1: Daily streak requires at least 50 XP** | [backend/tests/dailyStreak.test.js:1-155](backend/tests/dailyStreak.test.js#L1-L155) | Fully tested (6 test cases pass: $<50$ XP, $=50$ XP, $>50$ XP, consecutive days, missed days, timezone offsets) |
| **Rule 2: Focus sessions award a maximum of 500 XP per day** | [backend/tests/focusCap.test.js:1-122](backend/tests/focusCap.test.js#L1-L122) | Fully tested (5 test cases pass: standard rate, approaching 500 clamping, 0 XP post-cap, next day reset, ineligible sessions) |
| **Rule 3: Duplicate study activities cannot award XP twice** | [backend/tests/idempotency.test.js:1-149](backend/tests/idempotency.test.js#L1-L149) | Fully tested (4 test cases pass: first submission awards XP, duplicate submission returns 0 XP, distinct keys, schema unique index) |
| **Rule 4: Completed quizzes cannot be resubmitted without retake** | [backend/tests/quizResubmission.test.js:1-192](backend/tests/quizResubmission.test.js#L1-L192) | Fully tested (5 test cases pass: incomplete submission 200, resubmission 400 rejection, reset retake 200, post-reset submission 200, 404 on missing quiz) |
| **Rule 5: Email/password login requires verified email** | [backend/tests/authVerification.test.js:1-103](backend/tests/authVerification.test.js#L1-L103) | Fully tested (6 test cases pass: unverified rejection 400, missing fields 400, verified 200, legacy `emailVerified` 200, legacy `isEmailVerified` 200, Google OAuth 200) |

---

## 2. Test Execution Command & Summary

### Command

```bash
npm test --prefix backend
```

### Verified Results
```text
✔ 5 test suites executed
✔ 26 individual test cases passed
✔ 30 total test nodes passed (26 leaf assertions + 4 parent suite nodes)
✔ 0 failed, 0 skipped, 0 cancelled
✔ Duration: ~860 ms (100% deterministic, in-memory execution)
```

> **Note on Runner Count:** Node's native test runner (`node:test`) reports **30 passed tests** because each of the 4 parent `test()` suite blocks with subtests (`dailyStreak`, `focusCap`, `idempotency`, `quizResubmission`) is counted as a test node alongside the 26 leaf test assertions (`26 + 4 = 30`).

---

## 3. Analysis of One Weak Test

- **Identified Weak Test:** [backend/tests/authVerification.test.js:9-27](backend/tests/authVerification.test.js#L9-L27) (`evaluateEmailVerification`).
- **Why It Is Weak:** While Rules 1 through 4 execute production code directly from `studyProgressService.js` and `quizController.js`, `authVerification.test.js` isolates the verification conditional into a local helper function rather than executing the complete `login(req, res, next)` Express controller route. It does not test password bcrypt hash comparison (`user.comparePassword`), database user lookup (`User.findOne`), or JWT emission (`generateToken`).
- **Improvement Path:** Refactor into an HTTP integration test using `supertest` with `mongodb-memory-server` to exercise the full `POST /api/auth/login` request/response pipeline.

---

## 4. Untested Scenarios & Architectural Boundaries

1. **Live Database Integration:** Tests use controlled in-memory model stubs. The automated test suite does not connect to a live MongoDB instance, nor does it test multi-document ACID transaction rollbacks.
2. **High-Concurrency Race Conditions:** Tests execute sequentially in single-threaded Node.js turns. Simultaneous requests with identical idempotency keys arriving at the exact same millisecond before MongoDB finishes index writes remain an untested scenario.
3. **Live External AI Network Timeouts:** Live socket drops and rate limits (HTTP 429) from Google Gemini and Edge-TTS APIs are not simulated in automated unit tests.
