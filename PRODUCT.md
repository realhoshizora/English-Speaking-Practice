# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Vietnamese school students (secondary/high school) at CEFR level A1–B1, practicing English on their own at home without a teacher present. They use it on phones (Android/Chrome) and on laptops (Chrome/Edge) equally, so both must work equally well.

## Product Purpose

English Speaking Coach helps learners rehearse spoken English for everyday situations: listen, speak aloud, get feedback, and come back daily. Success means a student finishes scenarios, speaks rather than only reads, and builds a daily habit (daily goal, progress history, words to review).

## Positioning

Real-life scenario practice, end to end. Each scenario (ordering coffee, asking directions, checking into a hotel, etc.) bundles vocabulary, sentence patterns, a translated model dialogue, a task, and completion criteria, then lets the learner act it out in three speaking modes: Listen and Repeat, Guided Speaking, Free Role-play. The scenario is the unit of learning, not isolated words or drills.

## Operating Context

- Self-study at home, alone, often a short daily session.
- Speaking via the browser microphone (Web Speech API); typing an answer is always an alternative.
- Sections: Home, Speaking, Listening, Scenarios, Vocabulary, My Progress, Settings.
- Interface chrome and explanations are in Vietnamese; practice content is in English.

## Capabilities and Constraints

- Runs entirely in the browser: no account, no server, no paid API. Static build deployable anywhere; mic needs https or localhost.
- Conversation defaults to a scripted, keyword-matched mode (not AI). Optional local AI via Ollama; remote AI is not implemented.
- Speech recognition: Chrome/Edge supported, Firefox not, Safari partial. Chrome needs internet for recognition. Text-to-speech voices vary by OS.
- The app does **not** score pronunciation. "Transcript match" only shows which words the browser heard; never present it as a pronunciation grade.
- Progress is stored in LocalStorage on one device only; clearing browser data loses it.
- Optional teacher tracking (small class, currently two students): when `VITE_TEACHER_SHEET_URL` is set at build time and the student enters a name in Settings, each finished activity (type, scenario, score, time, name) is sent to the teacher's Google Sheet via Apps Script. No login; voice and answers are never sent. Setup: `docs/teacher-sheet.md`.
- 10 scenarios, 80 vocabulary items at present. Not in scope: accounts, cloud sync, classroom management, PWA/offline install (not yet).

## Brand Commitments

- Name: "English Speaking Coach".
- Voice: encouraging, plain Vietnamese for guidance; honest about limitations (e.g. scripted mode is "không phải AI").

## Evidence on Hand

- Real content: 10 scenarios in `src/data/scenarios/`, vocabulary in `src/data/vocabulary/`.
- No user testimonials, usage data, or outcome studies exist. Do not invent them.

## Product Principles

1. The scenario comes first: every feature should lead the learner back to rehearsing a real situation.
2. Speaking aloud is the goal; typing is a fallback that never blocks progress.
3. Be honest about what the machine can judge (transcript match, not pronunciation) and what mode is active (scripted vs AI).
4. Built for a learner alone: guidance in Vietnamese, clear next step, no teacher assumed.
5. Private and free: nothing to sign up for, no voice stored. The only data that leaves the device is the activity log a student chooses to send to their teacher.

## Accessibility & Inclusion

- Young learners at A1–B1: short English, Vietnamese explanations, generous touch targets on phones.
- Every voice-dependent task has a non-voice path (typing, transcript text).
- Browser capability gaps (no mic, no TTS) are explained in place with a way forward.
