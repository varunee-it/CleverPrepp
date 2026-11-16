# Ubiquitous Language: CleverPrep

**Project:** CleverPrep — AI-Powered Personalized Learning & Exam Preparation Platform
**Academic Program:** M.Sc. (IT), Dhirubhai Ambani University  
**Project Guide:** Prof. Shruti Bhilare  

### Team Members

| Enrollment Number | Team Member     |
| ----------------- | --------------- |
| 202512001         | Shruti Makwana  |
| 202512064         | Krisha Shah     |
| 202512067         | Varunee Agrawal |
| 202512085         | Hardi Dhadhal   |

---

## 1. Domain Glossary

| Term | Definition | Aliases to Avoid | Implemented in Code at |
|---|---|---|---|
| **Document** | An uploaded academic PDF persisted in MongoDB GridFS and parsed into text chunks. | File, Courseware, Paper, Slide Deck | [backend/models/Document.js:3-71](backend/models/Document.js#L3-L71), [backend/controllers/documentController.js:22-81](backend/controllers/documentController.js#L22-L81) |
| **Text Chunk** | A normalized segment of extracted document text (~500 words) with page index, used for AI grounding. | Text Block, Fragment, Slice | [backend/models/Document.js:42-55](backend/models/Document.js#L42-L55), [backend/utils/textChunker.js:1-35](backend/utils/textChunker.js#L1-L35) |
| **Summary** | An AI-generated conceptual digest and exam takeaway analysis synthesized from document text. | Overview, Synopsis, Digest | [backend/controllers/aiController.js:203-248](backend/controllers/aiController.js#L203-L248), [backend/utils/geminiService.js:372-430](backend/utils/geminiService.js#L372-L430) |
| **Flashcard Set** | A container entity representing a generated deck of flashcards for a specific document. | Deck, Stack, Collection | [backend/models/Flashcard.js:3-76](backend/models/Flashcard.js#L3-L76), [backend/controllers/flashcardController.js:10-38](backend/controllers/flashcardController.js#L10-L38) |
| **Card (Flashcard)** | An individual revision item with question, answer, explanation, memory tip, difficulty tag, and star toggle. | Prompt, Flipcard | [backend/models/Flashcard.js:41-73](backend/models/Flashcard.js#L41-L73), [backend/controllers/flashcardController.js:40-75](backend/controllers/flashcardController.js#L40-L75) |
| **Quiz** | A multiple-choice assessment generated from document chunks with automated grading. | Test, Exam, Mock Test | [backend/models/Quize.js:3-73](backend/models/Quize.js#L3-L73), [backend/controllers/quizController.js:10-60](backend/controllers/quizController.js#L10-L60) |
| **Question** | A quiz prompt with exactly 4 distinct options, one correct answer, and an explanation. | Item, MCQ, Problem | [backend/models/Quize.js:19-40](backend/models/Quize.js#L19-L40), [backend/utils/geminiService.js:110-180](backend/utils/geminiService.js#L110-L180) |
| **User Answer** | A learner's option selection for a quiz question, recording selection, correctness, and timestamp. | Pick, Choice, Submission | [backend/models/Quize.js:41-58](backend/models/Quize.js#L41-L58), [backend/controllers/quizController.js:63-145](backend/controllers/quizController.js#L63-L145) |
| **Chat Conversation** | A multi-turn AI tutoring dialogue thread grounded in document chunks. | Thread, Session, AI Talk | [backend/models/ChatHistory.js:15-38](backend/models/ChatHistory.js#L15-L38), [backend/controllers/aiController.js:250-320](backend/controllers/aiController.js#L250-L320) |
| **Memory Summary** | An automated LLM compression of earlier chat messages to maintain context within token limits. | Rolling Summary, Buffer | [backend/models/ChatHistory.js:25-28](backend/models/ChatHistory.js#L25-L28), [backend/utils/geminiService.js:300-340](backend/utils/geminiService.js#L300-L340) |
| **Shared Conversation** | A public, read-only snapshot of an AI tutoring chat accessible via a unique UUID `shareId`. | Public Chat, Exported Thread | [backend/models/ChatHistory.js:29-36](backend/models/ChatHistory.js#L29-L36), [backend/routes/shareRoutes.js:7](backend/routes/shareRoutes.js#L7) |
| **Podcast** | An AI-generated, dual-speaker educational audio episode (Teacher and Student dialogue). | Audio Lesson, Lecture | [backend/models/Podcast.js:21-54](backend/models/Podcast.js#L21-L54), [backend/controllers/podcastController.js:10-80](backend/controllers/podcastController.js#L10-L80) |
| **Generation Job** | An asynchronous task tracking podcast synthesis (`pending` $\rightarrow$ `processing` $\rightarrow$ `completed` / `failed`). | Audio Job, Worker Task | [backend/models/GenerationJob.js:3-48](backend/models/GenerationJob.js#L3-L48), [backend/controllers/podcastController.js:120-170](backend/controllers/podcastController.js#L120-L170) |
| **Chapter** | A structured topic division within a podcast episode with duration and dialogue segments. | Episode Section, Track | [backend/models/Podcast.js:8-19](backend/models/Podcast.js#L8-L19) |
| **Segment** | A single dialogue line spoken by either the `teacher` or `student` voice. | Line, Dialogue Turn | [backend/models/Podcast.js:3-6](backend/models/Podcast.js#L3-L6) |
| **Smart Pause** | An audio checkpoint in a podcast chapter prompting the learner to explain a concept out loud. | Audio Break, Checkpoint | [backend/models/Podcast.js:18](backend/models/Podcast.js#L18) |
| **Focus Session** | A stateful Pomodoro work block (`running`, `paused`, `completed`) managing timer, checklist, and XP. | Pomodoro Session, Work Block | [backend/models/FocusSession.js:3-80](backend/models/FocusSession.js#L3-L80), [backend/controllers/focusController.js:15-60](backend/controllers/focusController.js#L15-L60) |
| **Focus Checklist** | A task list inside a focus session to track completed goals during deep work. | Task List, Subtasks | [backend/models/FocusSession.js:66-72](backend/models/FocusSession.js#L66-L72) |
| **Ambient Sound** | Background audio (Rain, Cafe, White Noise) managed by client audio manager to aid concentration. | White Noise, Soundscape | [frontend/src/manager/AmbientAudioManager.js:1-95](frontend/src/manager/AmbientAudioManager.js#L1-L95) |
| **Study Session** | An immutable audit log created whenever an educational activity is completed. | Activity Log, Event Record | [backend/models/StudySession.js:3-55](backend/models/StudySession.js#L3-L55), [backend/services/studyProgressService.js:46-163](backend/services/studyProgressService.js#L46-L163) |
| **Activity Type** | One of 7 tracked learning activities: `upload_document`, `read_notes`, `flashcard_review`, `quiz_completed`, `podcast_listening`, `focus_session`, `ai_chat`. | Action, Event Type | [backend/models/StudySession.js:10-22](backend/models/StudySession.js#L10-L22) |
| **Experience Points (XP)** | Quantitative effort points awarded per activity based on formulaic weights. | Points, Score | [backend/config/gamification.js:6-14](backend/config/gamification.js#L6-L14), [backend/services/studyProgressService.js:21-40](backend/services/studyProgressService.js#L21-L40) |
| **Daily Streak** | Consecutive count of local calendar days on which a learner earns $\ge 50$ XP. | Streak Counter, Study Habit | [backend/config/gamification.js:2](backend/config/gamification.js#L2), [backend/services/studyProgressService.js:114-150](backend/services/studyProgressService.js#L114-L150) |
| **Gamification Level** | Level index calculated dynamically from total XP: $\text{Level} = \lfloor\sqrt{\text{Total XP} / 100}\rfloor + 1$. | Rank, User Tier | [backend/config/gamification.js:18-22](backend/config/gamification.js#L18-L22), [backend/services/studyProgressService.js:102-107](backend/services/studyProgressService.js#L102-L107) |
| **User Profile** | Authenticated user account with credentials, timezone, studyStats, and onboarding state. | Account, Learner | [backend/models/User.js:4-132](backend/models/User.js#L4-L132) |
| **Pending User** | Staging document for unverified credentials and 6-digit OTP with 10-minute TTL. | Unverified Account, OTP Record | [backend/models/PendingUser.js:3-43](backend/models/PendingUser.js#L3-L43) |

---

## 2. Flagged Terminology Ambiguities & Preferred Terms

| Ambiguity | Conflicting Terms & Code References | Preferred Term | Resolution / Rationale |
|---|---|---|---|
| **1. Quiz vs Quize** | `Quiz` in routes/docs vs `Quize.js` in [backend/models/Quize.js:3](backend/models/Quize.js#L3) | **`Quiz`** | Standard English spelling `Quiz` is preferred across all documentation and APIs. File naming typo `Quize.js` is preserved to avoid breaking import paths. |
| **2. FocusSession vs StudySession** | `FocusSession` in [backend/models/FocusSession.js:3](backend/models/FocusSession.js#L3) vs `StudySession` in [backend/models/StudySession.js:3](backend/models/StudySession.js#L3) | **`FocusSession`** (Live Timer)<br>**`StudySession`** (Audit Log) | `FocusSession` is the stateful, mutable Pomodoro timer. `StudySession` is the immutable, finalized audit record created across all 7 activity types. |
| **3. Flashcard vs Flashc** | `Flashcard` in models vs `Flashc.jsx` in frontend | **`Flashcard`** | Canonical product term is `Flashcard`. Component name `Flashc.jsx` is an internal shorthand. |
| **4. XP vs Points vs Score** | `pointsEarned` in [backend/models/StudySession.js:33](backend/models/StudySession.js#L33) vs `score` in [backend/models/Quize.js:63](backend/models/Quize.js#L63) | **`XP`** (Effort)<br>**`Score`** (Quiz %) | `XP` represents gamified effort rewards. `Score` is reserved exclusively for quiz performance percentages (0–100%). |
| **5. Document vs File vs Note** | `Document` in models vs `fileName` vs `read_notes` in `StudySession.js` | **`Document`** (PDF Entity)<br>**`Notes`** (Generated Content) | `Document` is the uploaded PDF. `Notes` refers to the AI-generated study summary or notes reading activity. |
| **6. isEmailVerified vs emailVerified** | `isEmailVerified` vs `emailVerified` in [backend/models/User.js:37-44](backend/models/User.js#L37-L44) | **`isEmailVerified`** | Standard boolean convention. `authController.js` checks `user.isEmailVerified \|\| user.emailVerified` to support both without lockout. |
| **7. avatar vs profileImage** | `profileImage` (line 33) vs `avatar` (line 85) in [backend/models/User.js](backend/models/User.js) | **`avatar`** | `avatar` is the canonical attribute for user profile pictures across all API responses. |
| **8. Username vs Name vs Preferred Study Name** | `username` vs `name` vs `preferredStudyName` in [backend/models/User.js:5-91](backend/models/User.js#L5-L91) | **`Username`** (Login handle)<br>**`Name`** (Full Name)<br>**`preferredStudyName`** (AI Persona) | AI podcasts address learners by `preferredStudyName` rather than login `username`. |
| **9. contexts vs context** | `frontend/src/contexts` vs `frontend/src/context` | **`context`** | Singular directory `frontend/src/context/` is the canonical React context directory. |
| **10. Root Streak Fields vs studyStats** | Legacy root streak fields vs nested `user.studyStats` in [backend/models/User.js:101-108](backend/models/User.js#L101-L108) | **`studyStats`** | Consolidated object `user.studyStats` is the single source of truth for streak and XP tracking. |

---

## 3. Implementation Verification Note

- **Email Verification Bypass Status:** **RESOLVED.** The historical bypass check (`// BYPASS FOR TEST`) in [backend/controllers/authController.js:222-231](backend/controllers/authController.js#L222-L231) has been completely restored to enforce email verification:
  ```javascript
  const isVerified = Boolean(user.isEmailVerified || user.emailVerified);
  if (!isVerified) {
      return res.status(400).json({
          success: false,
          error: "Please verify your email before signing in.",
          statusCode: 400,
          notVerified: true,
          email: user.email,
      });
  }
  ```
  Unverified credential sign-ins are rejected with HTTP 400 (`notVerified: true`). This behavior is verified by automated unit tests in [backend/tests/authVerification.test.js:1-103](backend/tests/authVerification.test.js#L1-L103) (6/6 tests passing).
