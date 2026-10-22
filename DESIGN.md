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
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.coach-blue}"
    textColor: "{colors.on-coach-blue}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "44px"
  button-small:
    rounded: "{rounded.md}"
    padding: "0.3rem 0.7rem"
    height: "36px"
  button-danger:
    backgroundColor: "{colors.stop-red}"
    textColor: "{colors.on-coach-blue}"
    rounded: "{rounded.md}"
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
---

# Design System: English Speaking Coach

## Overview

**Creative North Star: "The Practice Room"**

A quiet, well-lit room where a student rehearses alone and nobody is judging. The surfaces are calm and pale, so the English sentence, the microphone, and the feedback are the only things that ask for attention. Warmth comes from the tone and the softness, not from decoration: rounded cards, gentle shadows, friendly pill shapes, and encouraging Vietnamese guidance next to the English being practiced.

The system is a single-column-first web app (max 1040px), comfortable on a phone and a laptop alike. Density is moderate: generous 44px touch targets, 1rem gaps, cards that hold one idea each. Color carries meaning before mood: blue is "your turn / the coach", green is "the browser heard this", amber is "missing / try again", red is "stop / listening / danger", violet is "AI is active". Light and dark themes are both first-class and switch with the OS.

**Key Characteristics:**
- One accent (Coach Blue) for action and current state; semantic colors for everything else.
- System font stack: native, fast, renders Vietnamese diacritics everywhere.
- Soft, approachable components: 10–14px corners, pill navigation and chips, whisper-light shadows.
- The microphone is the hero object of any speaking screen.
- Every voice action has a visible text fallback next to it.

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

### Named Rules
**The Only-The-Mic-Glows Rule.** Strong, colored shadows belong to the microphone alone. Other components stay at paper lift or flat.

## Shapes

Soft and approachable. Corners scale with size: 6px for inline word highlights, 8px for inputs, hints and small boxes, 10px for buttons, notices and dialogue lines, 14px for cards and chat bubbles, full pill (999px) for nav links, chips, pills and progress bars, and a full circle for the mic. Borders are always 1px hairline; emphasis uses a 3–5px colored left border (feedback, result banners) or a 3px bottom border (active tab), never a heavier outline.

## Components

### Buttons
Friendly, solid, never shouty.
- **Shape:** gently rounded (10px), minimum 44px tall (36px for small).
- **Default:** Paper background, hairline border, Ink text, weight 600.
- **Primary:** Coach Blue fill and border, white text.
- **Hover / Focus:** hover shifts the border to Coach Blue; focus shows a 3px Coach Blue outline offset 2px. Disabled drops to 55% opacity.
- **Ghost / Danger / Link:** ghost is transparent; danger is Stop Red fill (or red text when ghost); link is an underlined blue text button.

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
Partner bubbles are Paper with a hairline border, aligned left; learner bubbles are Coach Blue Mist, aligned right; 14px corners, max 85% width. Dialogue lines stack speaker label, English line, and muted Vietnamese translation, with a play button on the right.

## Do's and Don'ts

### Do:
- **Do** use the CSS custom properties in `src/styles/global.css` (`--primary`, `--ok-soft`, `--radius`…) rather than raw hex, so dark mode keeps working.
- **Do** keep every tappable control at least 44px tall (36px for small buttons and chips).
- **Do** pair every semantic color with its `-soft` tint, as notices, pills and word chips already do.
- **Do** put a text fallback next to every voice interaction.
- **Do** gate motion behind `prefers-reduced-motion: no-preference`, as the mic pulse does.

### Don't:
- **Don't** introduce a second accent color or a second typeface.
- **Don't** use green/amber/red/violet decoratively; they always mean heard / missing / stop / AI.
- **Don't** give anything other than the mic a colored or heavy shadow.
- **Don't** style transcript match like a score or grade; it is not pronunciation assessment.
- **Don't** hard-code light-only colors (e.g. `#fff` text) on new surfaces without checking the dark theme.
