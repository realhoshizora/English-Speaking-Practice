---
name: English Speaking Coach
description: A quiet, warm practice room where A1–B1 students rehearse real-life English conversations.
colors:
  coach-blue: "#2457c5"
  coach-blue-soft: "#e8eefc"
  on-coach-blue: "#ffffff"
  heard-green: "#17703c"
  heard-green-soft: "#e4f5ea"
  missing-amber: "#8a5300"
  missing-amber-soft: "#fff3dc"
  stop-red: "#b3261e"
  stop-red-soft: "#fdeceb"
  ai-violet: "#6b3fb5"
  ai-violet-soft: "#f1eafc"
  ink: "#1b2333"
  slate-muted: "#5a6478"
  hairline: "#dfe4ee"
  paper: "#ffffff"
  morning-mist: "#f5f7fb"
  press-lip: "#cdd5e2"
  coach-blue-lip: "#173b8f"
  stop-red-lip: "#7d1a14"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "clamp(1.25rem, 3.5vw, 1.6rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  practice:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sm: "6px"
  input: "8px"
  md: "10px"
  button: "12px"
  card: "14px"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.coach-blue}"
    textColor: "{colors.on-coach-blue}"
    rounded: "{rounded.button}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-small:
    rounded: "{rounded.button}"
    padding: "0.3rem 0.7rem"
    height: "36px"
  button-danger:
    backgroundColor: "{colors.stop-red}"
    textColor: "{colors.on-coach-blue}"
    rounded: "{rounded.button}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.9rem"
    height: "36px"
  chip-active:
    backgroundColor: "{colors.coach-blue}"
    textColor: "{colors.on-coach-blue}"
  pill:
    backgroundColor: "{colors.coach-blue-soft}"
    textColor: "{colors.coach-blue}"
    rounded: "{rounded.pill}"
    padding: "0.1rem 0.55rem"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "1rem 1.1rem"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "0.5rem 0.65rem"
    height: "44px"
  nav-link-active:
    backgroundColor: "{colors.coach-blue}"
    textColor: "{colors.on-coach-blue}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.7rem"
  mic-button:
    backgroundColor: "{colors.coach-blue}"
    textColor: "{colors.on-coach-blue}"
    rounded: "{rounded.pill}"
    size: "112px"
  mic-button-listening:
    backgroundColor: "{colors.stop-red}"
    textColor: "{colors.on-coach-blue}"
  mascot:
    size: "72px"
  coach-bubble:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0.65rem 0.9rem"
  lesson-bar:
    backgroundColor: "{colors.heard-green}"
    rounded: "{rounded.pill}"
    height: "16px"
---

# Design System: English Speaking Coach

## Overview

**Creative North Star: "The Practice Room"**

A quiet, well-lit room where a student rehearses alone and nobody is judging. The surfaces are calm and pale, so the English sentence, the microphone, and the feedback are the only things that ask for attention. Warmth comes from the tone and the softness, not from decoration: rounded cards, gentle shadows, friendly pill shapes, and encouraging Vietnamese guidance next to the English being practiced.

The room has a coach: **Quạc**, a pixel-art yellow duck wearing the app's blue headset. Quạc is the app's ears. When the browser hears the learner, Quạc hops; when the scripted matcher does not understand, Quạc is the one holding its head ("Quạc chưa hiểu ý bạn"), never the learner who is "wrong". That keeps the playful, Duolingo-like energy honest about what the machine can judge. Motion and 8-bit sound give every answer a physical response, and lesson completion gets one authored celebration.

The system is a single-column-first web app (max 1040px), comfortable on a phone and a laptop alike. Density is moderate: generous 44px touch targets, 1rem gaps, cards that hold one idea each. Color carries meaning before mood: blue is "your turn / the coach", green is "the browser heard this", amber is "missing / try again", red is "stop / listening / danger", violet is "AI is active". Light and dark themes are both first-class and switch with the OS.

**Key Characteristics:**
- One accent (Coach Blue) for action and current state; semantic colors for everything else.
- System font stack: native, fast, renders Vietnamese diacritics everywhere.
- Soft, approachable components: 10–14px corners, pill navigation and chips, whisper-light shadows.
- The microphone is the hero object of any speaking screen.
- Every voice action has a visible text fallback next to it.
- Quạc reacts to the machine's understanding (listening, heard, not understood, finished); the text next to Quạc always carries the meaning.
- Press buttons: a solid darker lip under every button that the button sinks into when pressed.

## Colors

A cool, low-chroma neutral base with one confident blue, plus a small set of meaning colors that each come with a soft tint for backgrounds.

### Primary
- **Coach Blue** (coach-blue): primary buttons, the active nav pill, active chips, links, focus outlines, the idle mic button, and the "current line" ring in dialogues. It means "act here" or "you are here".
- **Coach Blue Mist** (coach-blue-soft): learner chat bubbles, learner dialogue lines, info notices, nav hover, selected match items.

### Secondary (semantic)
- **Heard Green** (heard-green / heard-green-soft): words the recognizer matched, passed results, the daily-goal bar, "ok" pills.
- **Missing Amber** (missing-amber / missing-amber-soft): words not heard (with wavy underline), hints and tips, warnings, "needs practice" pills.
- **Stop Red** (stop-red / stop-red-soft): the mic while listening (pulsing), errors, wrong answers, destructive actions.
- **AI Violet** (ai-violet / ai-violet-soft): only for signaling that the local AI conversation mode is active.

### Neutral
- **Ink** (ink): body text and headings.
- **Slate Muted** (slate-muted): secondary text, speaker labels, Vietnamese translations under English lines, inactive tabs and nav links.
- **Hairline** (hairline): card borders, dividers, inactive input and button borders, the empty progress track.
- **Paper** (paper): cards, inputs, the top bar, partner chat bubbles.
- **Morning Mist** (morning-mist): page background, inset feedback panels, explanation boxes.

Dark theme swaps every token in place (`prefers-color-scheme: dark`): background `#11151d`, surface `#1a202b`, text `#e8ecf4`, primary lifts to `#7aa2ff` with dark text on it. Semantic colors lighten so they stay readable on dark tints.

### Press lips
**Press Lip** (press-lip), **Coach Blue Lip** (coach-blue-lip), **Stop Red Lip** (stop-red-lip): the solid edge under default, primary and danger buttons and under tiles. Dark theme: `#0b0f16`, `#3f63c9`, `#c4574f`.

### Mascot palette
Quạc's yellows, oranges, pink blush and headset blues live only inside the sprites (`src/components/mascot/sprites.ts`) and the confetti. They never become UI colours.

### Named Rules
**The Meaning-First Rule.** Green, amber, red and violet are reserved for their meaning. Never use them as decoration or to make a section "pop".

**The Soft-Tint Pair Rule.** Every semantic color appears as a pair: the strong color for text/borders, its `-soft` tint for the background. Notices add a 25–35% `color-mix` border of the strong color.

**The One Accent Rule.** Coach Blue is the only accent. A screen should have at most one filled-blue primary action competing for the eye (the mic counts as one).

## Typography

**Display Font:** system-ui (with -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif)
**Body Font:** same stack

**Character:** One native family across all roles: familiar on every device, instant to load, and reliable for Vietnamese diacritics. Hierarchy comes from weight (700 vs 400/500) and size, not from a second typeface.

### Hierarchy
- **Display** (700, clamp(1.5rem, 4vw, 2rem), 1.25): page titles (h1) only.
- **Headline** (700, clamp(1.25rem, 3.5vw, 1.6rem), 1.25): the target sentence to say in Listen and Repeat. Flashcard words go bigger (2rem).
- **Title** (700, 1.2rem / 1.05rem, 1.25): card and section headings (h2/h3).
- **Body** (400, 1rem, 1.5): guidance, descriptions, Vietnamese explanations.
- **Practice** (400, 1.05–1.2rem, 1.5–2): English lines in chat bubbles and dialogues; the word-diff line runs 1.2rem with line-height 2 so highlight chips don't collide.
- **Label** (600–700, 0.75–0.85rem): speaker names, pills, stat labels, eyebrow text (uppercase, 0.05em tracking).

### Named Rules
**The English-Is-Bigger Rule.** English practice text is always set larger than the Vietnamese guidance around it. Translations sit below in Slate Muted at ~0.92rem.

## Layout

Centered column, `max-width: 1040px`, 1rem padding (0.75rem under 640px). Pages are a vertical grid with 1rem gaps. Card collections use auto-fill grids (`minmax(260px, 1fr)` for scenarios, `minmax(280px, 1fr)` for two-column sections, `minmax(150px, 1fr)` for stats), so they collapse to one column on phones without breakpoints.

The top bar is sticky, holding the brand and a horizontally scrollable row of nav pills; under 640px the nav wraps to its own full-width row. The one explicit breakpoint (640px) also centers the mic area, stacks the Match game to one column, turns the history table into stacked rows, and widens chat bubbles to 95%.

Spacing steps are 0.25 / 0.5 / 0.75 / 1 / 1.5rem. Speaking-page actions stick to the bottom of the viewport on a translucent background so the next step is always reachable.

## Elevation & Depth

Mostly flat with a whisper of lift. Cards carry a two-layer ambient shadow so they read as sheets of paper on the misty background; everything else is defined by 1px hairline borders and tonal tints. The only strong shadow belongs to the mic button.

### Shadow Vocabulary
- **Paper lift** (`box-shadow: 0 1px 2px rgb(16 24 40 / 6%), 0 2px 8px rgb(16 24 40 / 5%)`): all cards.
- **Mic glow** (`box-shadow: 0 4px 14px rgb(36 87 197 / 35%)`): the idle mic button.
- **Listening halo** (`0 0 0 8px` → `14px` of Stop Red at 25% → 10%, 1.4s pulse): the mic while listening, animated only under `prefers-reduced-motion: no-preference`.
- **Current ring** (`0 0 0 2px` Coach Blue): the dialogue line being played.
- **Press lip** (`0 4px 0` of the lip colour; 3px for small buttons and tiles, 5px for large): every button and tile. On press the button moves down by the lip height and the lip goes to 0, so it looks pushed in. Ghost and link buttons have no lip.

### Named Rules
**The Only-The-Mic-Glows Rule.** Strong, colored, blurred shadows belong to the microphone alone. The press lip is a solid edge with no blur, not a glow. Other components stay at paper lift or flat.

## Shapes

Soft and approachable. Corners scale with size: 6px for inline word highlights, 8px for inputs, hints and small boxes, 10px for notices and dialogue lines, 12px for press buttons and tiles, 14px for cards, chat bubbles and Quạc's speech bubble, full pill (999px) for nav links, chips, pills and progress bars, and a full circle for the mic. Borders are 1px hairline; buttons, tiles and the speech bubble use 2px. Feedback panels and result banners are tinted with their meaning colour (soft tint background, translucent border), never a thick coloured side border. The active tab keeps its 3px bottom border.

## Components

### Buttons
Chunky press buttons, friendly and tactile (the Duolingo feel, chosen by the product owner).
- **Shape:** 12px corners, 2px border, minimum 44px tall (36px small, 52px large), weight 700, sentence case.
- **Default:** Paper background, hairline border, Ink text, Press Lip underneath.
- **Primary:** Coach Blue fill and border, white text, Coach Blue Lip; hover lightens the fill slightly.
- **Press:** `:active` moves the button down by the lip height (90ms) and the lip disappears.
- **Hover / Focus:** hover shifts the border to Coach Blue; focus shows a 3px Coach Blue outline offset 2px. Disabled drops to 55% opacity and does not press.
- **Ghost / Danger / Link:** ghost is transparent with no lip; danger is Stop Red fill with Stop Red Lip (or red text when ghost); link is an underlined blue text button.
- **Tiles** (match and choose-the-word options) use the same 2px border, 12px corners and a 3px lip; matched tiles turn Heard Green, wrong picks turn Stop Red and shake once.

### Chips
- **Style:** pill, Paper background, hairline border, 36px tall. Used for filters (level, topic).
- **State:** active fills Coach Blue with white text.

### Pills (badges)
- Small pill labels (0.78rem, 600): Coach Blue Mist with blue text by default; green and amber variants for "done" and "needs practice".

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Paper.
- **Shadow Strategy:** paper lift.
- **Border:** 1px hairline.
- **Internal Padding:** 1rem × 1.1rem.

### Inputs / Fields
- **Style:** Paper background, 1px hairline, 8px corners, 44px tall, inherits the body font.
- **Focus:** the global 3px Coach Blue focus outline.

### Navigation
Sticky white top bar with a hairline bottom border. Links are pills in Slate Muted (weight 500) with emoji icons; hover tints to Coach Blue Mist; the current page fills Coach Blue with white text. On phones the pill row scrolls horizontally on its own line.

### Notices
Full-width rounded (10px) bars in a soft tint with a matching translucent border: info (blue), warn (amber), error (red), AI (violet). They explain state honestly in Vietnamese and usually include a link to fix it.

### Mic Button (signature)
A 112px Coach Blue circle with an icon and short label, glowing softly. While listening it turns Stop Red with a pulsing halo; while requesting permission or processing it goes Slate Muted. It always sits beside a live status line and an "answer by typing" fallback.

### Word Diff (signature)
The transcript-match line: each word is a small 6px-rounded chip, Heard Green tint for matched words and Missing Amber tint with a wavy underline for missing ones. It shows what the browser heard and never grades pronunciation.

### Chat Bubbles & Dialogue Lines
Partner bubbles are Paper with a hairline border, aligned left; learner bubbles are Coach Blue Mist, aligned right; 14px corners, max 85% width. New bubbles slide in from their own side. Dialogue lines stack speaker label, English line, and muted Vietnamese translation, with a play button on the right.

### Quạc (mascot, signature)
A 32×32 pixel sprite drawn as data in `src/components/mascot/sprites.ts`, rendered as an SVG sprite sheet at whole-pixel sizes (72px next to exercises, 96px on Home and result banners, 128px in lesson summaries). Moods and when they are used:
- **idle:** blinks and breathes by one sprite pixel. Waiting for the learner.
- **listen:** eyes closed, wing on the headset, three pixel sound bars. While the mic is requesting, listening or processing.
- **happy:** hop with squash and stretch plus three sparkles. Answer accepted, transcript match at least 90%, right tile.
- **confused:** dazed eyes, wing on head, a pixel "?" and a one-pixel shake. The app did not understand, match below 60%, wrong tile.
- **cheer:** both wings up, three hops. Lesson, quiz or vocabulary round passed (60% or more).
- **wave:** waves four times, then settles to idle. Greeting on Home, and the end of a lesson that did not pass.
Quạc is always `aria-hidden`; the bubble or result text beside it carries the meaning. Looping moods pause while Quạc is scrolled out of view.

### Coach Bubble
Quạc's speech bubble: Paper, 2px hairline border, 14px corners, a small tail pointing at Quạc. It holds the task ("Nhiệm vụ: …"), the turn prompt, or a one-line reaction in bold (Heard Green for praise, Missing Amber for "Quạc chưa hiểu ý bạn"). It pops in whenever the mood or answer changes.

### Lesson Bar
A 16px Heard Green pill with a light top band, at the top of every lesson and vocabulary round, with an optional "Câu 2/6" count. It fills as answers are accepted and never moves backwards, even when a conversation branch adds a turn.

### Celebration
At the end of a lesson: Quạc cheers, 28 pixel confetti squares in the mascot palette burst once (1.3s), the main number counts up, and a short fanfare plays after the partner's voice has finished. Below the pass mark Quạc waves instead and there is no confetti.

### Streak Flame
A two-frame pixel flame inside the streak pill. It flickers a few times when the streak is alive and is grey when the streak is 0.

## Motion & Sound

Motion answers the learner; it never decorates. One authored moment (the end-of-lesson celebration); everything else is fast feedback.

- **Feedback (100–300ms):** button press 90ms; coach bubble pop 280ms; chat bubbles 300ms; feedback panels rise 320ms; word chips pop one after another (45ms apart, capped); a "try again" panel or wrong tile shakes once (380ms).
- **Mascot:** sprite moves in whole sprite pixels with `steps()`; hops use squash and stretch over 640ms.
- **Continuity:** lesson and daily-goal bars grow from 0 on arrival and ease to new values (600ms).
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for arrivals, `cubic-bezier(0.3, 0.7, 0.4, 1)` for presses. No elastic curves.
- **Reduced motion:** every animation sits behind `prefers-reduced-motion: no-preference`. With reduced motion, moods still change (static frames), colours and text still change, and counters show their final value; nothing moves and there is no confetti.
- **Sound:** short 8-bit square-wave effects synthesised with Web Audio (`src/services/sound/sfx.ts`): "correct" (rising ting), "retry" (soft step down), "complete" (C-major arpeggio), "pop". On by default, switchable in Settings, and never played while any microphone session is open.

## Do's and Don'ts

### Do:
- **Do** use the CSS custom properties in `src/styles/global.css` (`--primary`, `--ok-soft`, `--radius`…) rather than raw hex, so dark mode keeps working.
- **Do** keep every tappable control at least 44px tall (36px for small buttons and chips).
- **Do** pair every semantic color with its `-soft` tint, as notices, pills and word chips already do.
- **Do** put a text fallback next to every voice interaction.
- **Do** gate motion behind `prefers-reduced-motion: no-preference`, as the mic pulse does.
- **Do** let Quạc react to what the machine understood, and put the meaning in the text beside it.
- **Do** keep celebration proportional: a sparkle for one right answer, confetti only when a lesson or round is passed.

### Don't:
- **Don't** introduce a second accent color or a second typeface.
- **Don't** use green/amber/red/violet decoratively; they always mean heard / missing / stop / AI.
- **Don't** give anything other than the mic a colored or heavy shadow.
- **Don't** style transcript match like a score or grade; it is not pronunciation assessment.
- **Don't** hard-code light-only colors (e.g. `#fff` text) on new surfaces without checking the dark theme.
- **Don't** use the mascot palette (duck yellow, orange, blush pink) for UI chrome, text or states.
- **Don't** play sound effects while the mic is listening or when the learner turned them off.
- **Don't** show a confused or sad Quạc as a judgement of the learner; it means the app did not understand.
