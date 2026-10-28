---
name: English Speaking Coach
description: The learner's own hand-drawn speaking handbook, in the owner's "Cẩm nang Dwell" world.
colors:
  matcha-desk: "#c5d7a7"
  desk-dots: "rgb(255 255 255 / 45%)"
  number-fill: "#bcd49a"
  soft-fill: "#e4eed3"
  desk-ink: "#33461f"
  ink: "#0b1533"
  ink-2: "#2e3a5c"
  ink-3: "#5a6788"
  klein: "#002fa7"
  on-klein: "#ffffff"
  act-yellow: "#ffe14d"
  heard-green: "#9be88b"
  missing-pink: "#ff8fb8"
  ai-lilac: "#d9c8ff"
  paper: "#ffffff"
  paper-tint: "#f5f9ee"
  paper-pink: "#fff0f6"
  paper-ok: "#ecfbe7"
  paper-me: "#e9efff"
  paper-sel: "#fff6c2"
  ok-text: "#0f6b33"
  error-crimson: "#b4124f"
  ai-violet: "#5b2bb5"
  ai-soft: "#f3eeff"
  tape-yellow: "rgb(255 225 77 / 78%)"
  tape-pink: "rgb(255 143 184 / 72%)"
  track: "rgb(11 21 51 / 12%)"
  hairline: "rgb(11 21 51 / 30%)"
  night-desk: "#0e1a3a"
  night-paper: "#17264d"
  chalk: "#edf6fb"
  night-klein: "#a5bdff"
  night-me: "#2f50c4"
typography:
  display:
    fontFamily: "Itim, 'Be Vietnam Pro', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 3.9rem)"
    fontWeight: 400
    lineHeight: 1.08
  headline:
    fontFamily: "Itim, 'Be Vietnam Pro', system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.4vw, 3.1rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Itim, 'Be Vietnam Pro', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.2
  subtitle:
    fontFamily: "Itim, 'Be Vietnam Pro', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
  control:
    fontFamily: "Itim, 'Be Vietnam Pro', system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.1
  numeral:
    fontFamily: "Itim, 'Be Vietnam Pro', system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  practice:
    fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 2.1
  small:
    fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sheet: "22px 14px 26px 12px / 14px 26px 12px 22px"
  piece: "14px 20px 12px 22px / 20px 12px 22px 14px"
  small: "10px 14px 9px 15px / 14px 9px 15px 10px"
  blob: "50% 46% 52% 48% / 48% 52% 46% 50%"
  note: "14px"
  bubble: "18px 18px 18px 6px"
  pill: "999px"
spacing:
  tight: "0.35rem"
  row: "0.5rem"
  actions: "0.65rem"
  section: "1.25rem"
  page: "1.35rem"
  sheet-x: "1.4rem"
  gutter: "1.75rem"
  gutter-phone: "1rem"
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.piece}"
    padding: "0.5rem 1.1rem"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.act-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.piece}"
    padding: "0.5rem 1.1rem"
    height: "44px"
  button-primary-disabled:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-active:
    backgroundColor: "{colors.paper-sel}"
  button-danger:
    backgroundColor: "{colors.missing-pink}"
    textColor: "{colors.ink}"
  button-danger-ghost:
    textColor: "{colors.error-crimson}"
  button-lg:
    padding: "0.65rem 1.5rem"
    height: "54px"
  button-sm:
    padding: "0.3rem 0.8rem"
    height: "38px"
  mic-button:
    backgroundColor: "{colors.act-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.blob}"
    size: "116px"
  mic-button-listening:
    backgroundColor: "{colors.missing-pink}"
  sheet:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sheet}"
    padding: "1.25rem 1.4rem"
  sheet-ok:
    backgroundColor: "{colors.paper-ok}"
  sheet-warn:
    backgroundColor: "{colors.paper-pink}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.piece}"
    padding: "0.5rem 0.8rem"
    height: "44px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.95rem"
    height: "38px"
  chip-active:
    backgroundColor: "{colors.act-yellow}"
    textColor: "{colors.ink}"
  pill:
    backgroundColor: "{colors.soft-fill}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.05rem 0.6rem"
  pill-ok:
    backgroundColor: "{colors.heard-green}"
  pill-warn:
    backgroundColor: "{colors.missing-pink}"
  pill-ai:
    backgroundColor: "{colors.ai-lilac}"
  route-stop:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.piece}"
    padding: "7px 10px 7px 9px"
  route-stop-current:
    backgroundColor: "{colors.act-yellow}"
    textColor: "{colors.ink}"
  number-circle:
    backgroundColor: "{colors.soft-fill}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.blob}"
    size: "64px"
  number-circle-done:
    backgroundColor: "{colors.heard-green}"
  quiz-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.piece}"
    padding: "0.5rem 0.85rem"
  quiz-option-checked:
    backgroundColor: "{colors.paper-sel}"
  quiz-option-answer:
    backgroundColor: "{colors.paper-ok}"
  quiz-option-picked-wrong:
    backgroundColor: "{colors.paper-pink}"
  bubble-partner:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "0.6rem 0.95rem"
  bubble-learner:
    backgroundColor: "{colors.klein}"
    textColor: "{colors.on-klein}"
    padding: "0.6rem 0.95rem"
  notice:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "0.75rem 1rem"
  notice-warn:
    backgroundColor: "{colors.paper-pink}"
  notice-ai:
    backgroundColor: "{colors.ai-soft}"
---

# Design System: English Speaking Coach

## Overview

**Creative North Star: "Cẩm nang Dwell, the Speaking Handbook"**

The app is the learner's own hand-drawn speaking handbook, built in the owner's pinned world, their handbook site "Cẩm nang Dwell"; the owner swapped that handbook's cyan desk for matcha latte because the cyan glared. White paper sheets in an inked, slightly wobbly frame lie on a matcha-latte desk covered in a white dot grid. The working sheets carry yellow and pink washi tape. The ten scenarios are a numbered route of stops. When something matters (the next step, the page you are on, the words the browser heard), it gets a highlighter mark. Everything is outlined in one dark navy ink, so a screen reads like a page someone drew rather than a stack of grey cards.

Density is calm and generous. There is one reading column (max 1000px) beside a route rail on desktop, and every block is a separate sheet or a drawn row. Colour is never decoration: each of the four marker colours has one job, and the white paper and matcha desk carry everything else. Itim, a handwritten marker face, sets the voice for headings, buttons, navigation and numbers. Be Vietnam Pro carries all reading, so Vietnamese diacritics stay crisp at every size.

At night the same handbook sits on a navy desk. The ink becomes chalk, the paper becomes deep blue, and the marks keep their colours as opaque bands with ink text on top. The night theme is the day handbook seen in different light, not a separate world.

**Key Characteristics:**
- Matcha-latte dotted desk (18px white dot grid) under white sheets in a 9-slice hand-drawn SVG frame.
- One ink for every outline, at 2–2.5px.
- Wobbly asymmetric radii on every piece; organic blob circles for every number.
- Itim for voice (headings, controls, nav, numbers); Be Vietnam Pro for reading.
- Four marker colours with single jobs: yellow act/here, Klein link/focus/you, green heard/done, pink missing/warning.
- Soft ink drop shadows, ±1° tilts, lift on hover, press down on click.
- Signature: the highlighter pass over the words the browser heard.
- Quạc, an original pixel-art duck, who keeps the 8-bit voice of the app alongside short synthesized sounds.

## Colors

A calm, clean desk palette: matcha-latte ground, white paper, deep navy ink, and four saturated highlighter colours, each with exactly one meaning.

### Primary
- **Act-Here Yellow** (act-yellow): the only colour that means "act here" or "you are here". Used for the primary button, the mic at rest, the current or next route stop, the active chip and tab, the current dialogue line, a checked quiz option's letter circle, the lit streak, text selection, the skip link, and the nav highlighter swipe on the current page. A primary button that cannot act yet goes back to paper.
- **Klein Blue** (klein): links, the focus ring (3px outline, 3px offset), the caret, checkbox and range accents, the hover underline in nav, the scribble under lesson titles, the drawn arrows between mode panels, tip icons, and the learner's own chat bubbles ("you" in chat). At night it lightens to night-klein for text, and "you" bubbles use night-me.

### Secondary
- **Heard Green** (heard-green): heard and done. It marks words the browser heard, finished route stops and number circles, the correct quiz answer, ok pills, and the hatched fill of every progress bar. Text that means "ok" uses the darker ok-text, never the marker itself.
- **Missing Pink** (missing-pink): missing, warning and error, all one family. It marks words the browser missed, the mic while listening, wrong picks, warn pills, and the danger button. Text in this family is Error Crimson (error-crimson); `--warn` is an alias of `--error`. Warning surfaces use paper-pink.

### Tertiary
- **Local-AI Lilac** (ai-lilac, with ai-violet text and ai-soft paper): used only for the note that a local AI model is answering (the AI pill and the AI notice). Nothing else uses it.

### Neutral
- **Matcha Desk** (matcha-desk): the page ground and the sticky top bar, under a dot grid of desk-dots at 18px.
- **Number Fill** (number-fill): the large number circles (mode panels, lesson steps).
- **Soft Fill** (soft-fill): resting fill of small number circles (rail stops, quiz questions), pills, table heads, and the mic while it requests access or processes.
- **Desk Ink** (desk-ink): secondary text that sits directly on the desk (brand subtitle, footer, route counts, route summaries).
- **Ink** (ink): every outline and all main text. Ink-2 is muted text; ink-3 is placeholders.
- **Paper** (paper) and its tints: paper-tint for notes, tips and sub-panels; paper-ok, paper-pink and paper-sel for green, pink and yellow states on a sheet; paper-me for the learner's lines in a dialogue.
- **Hairline** (hairline): dashed dividers inside sheets and the footer rule. **Track** (track): the empty part of progress bars, tinted so it never reads as an input.
- **Night** (night-desk, night-paper, chalk): the night desk, the night paper, and chalk replacing ink for outlines and text. On the navy desk the dots turn a faint matcha (15%) and desk ink lightens to #cfe2b4; number fill and soft fill keep their day values.

### Named Rules
**The One Job Rule.** Each marker colour has one meaning. Yellow is act/here, Klein is link/focus/you, green is heard/done, pink is missing/warning, lilac is local AI. Never use a marker colour as decoration.

**The Yellow Returns to Paper Rule.** If a yellow element cannot act (a disabled primary button), it becomes paper. Yellow on something inert is a lie.

**The Ink on Marks Rule.** Text on any yellow, green, pink or matcha fill is always ink (`--on-mark`), in both themes. At night the marks stay opaque and the text on them turns ink.

**The Pink Family Rule.** Warning and error are one family: pink marks, crimson text, pink paper. There is no amber or cream warning tone; the old warm paper was retired on purpose.

## Typography

**Display Font:** Itim (with Be Vietnam Pro, system-ui)
**Body Font:** Be Vietnam Pro (with system-ui, -apple-system, Segoe UI, Roboto)

**Character:** Itim is a friendly handwritten marker face, used at weight 400 only, that makes headings and controls feel written in the handbook. Be Vietnam Pro (400/500/600/700) is a clear humanist sans built for Vietnamese, used for everything a learner reads closely. Both are self-hosted with Vietnamese subsets.

### Hierarchy
- **Display** (Itim 400, clamp(2.4rem, 5.4vw, 3.9rem), 1.08): the Home headline only. Its key phrase carries a yellow highlighter. Other big moments use fluid clamps in the same face: today's scenario title clamp(2rem, 4.6vw, 2.75rem), flashcard word clamp(2.4rem, 6vw, 3.4rem), target sentence clamp(1.6rem, 3.6vw, 2.2rem).
- **Headline** (Itim 400, clamp(2.1rem, 4.4vw, 3.1rem), 1.1, -0.01em): page `h1`. On scenario pages it sits beside the lesson number with a Klein scribble under it.
- **Title** (Itim 400, clamp(1.5rem, 2.4vw, 1.75rem), 1.2): `h2`. Section titles use clamp(1.4rem, 2.3vw, 1.65rem); route titles, panel titles and the rail title use 1.5rem.
- **Subtitle** (Itim 400, 1.25rem): `h3`, step titles, the summary line, and large buttons.
- **Control** (Itim 400, 1.12rem, 1.1–1.2): buttons, nav links, tabs, the mic label, speech bubbles and quiz letters.
- **Numeral** (Itim 400, 2rem, 1): lesson numbers and stats; smaller number circles step down to 1.5 / 1.25 / 1.12 / 1rem. Counts use tabular figures.
- **Body** (Be Vietnam Pro 400, 1.0625rem, 1.65): all reading. Leads use 1.12rem at 1.6. Long text is capped at 50–66ch.
- **Practice** (Be Vietnam Pro 400, 1.25rem, 2.1): the highlighted transcript. The tall line height leaves room for the marker band and diacritics. Chat and dialogue lines use 1.12rem.
- **Small** (Be Vietnam Pro, 0.875rem) and **secondary** (0.94rem): meta lines, route summaries, history tables, back links.
- **Label** (Be Vietnam Pro 600, 0.8rem): pills, speaker names, role terms, the Vietnamese line under route stops. Labels are never uppercase.

The full rem ramp is 0.8 / 0.875 / 0.94 / 1 / 1.0625 / 1.12 / 1.25 / 1.4 / 1.5 / 2, plus the fluid display clamps above. Don't add new steps.

### Named Rules
**The Two Voices Rule.** Itim speaks (headings, buttons, nav, numbers, bubbles); Be Vietnam Pro explains (body, labels, inputs, meta). Never set a paragraph in Itim, and never set a button in the body face.

**The Single Weight Marker Rule.** Itim only ever appears at 400. Emphasis comes from size and highlighter marks, not weight.

## Layout

The shell is a sticky matcha top bar (76px, thick ink bottom rule) above a centred grid, max 1380px wide with padding 2rem 1.75rem 3rem. From 1024px the grid gains a left route rail (262px, 290px from 1240px). The rail sticks under the top bar and scrolls on its own. The stage column is max 1000px wide and starts at the left edge next to the rail.

Pages are a single grid with a 1.35rem gap; two-column groups auto-fit at minmax(280px, 1fr) with a 1.25rem gap. Inside sheets, rows use 0.35–0.5rem gaps and action rows use 0.65rem. The Home hero puts the headline beside Quạc and his speech bubble. The three mode panels sit in three columns joined by drawn arrows; below 860px they stack, and each arrow turns to point down.

Below 1100px the nav moves to its own row and scrolls sideways, with a fade at the right edge, and the current page is scrolled into view. At 720px and below the nav wraps to two rows of 44px targets, the bar stops being sticky (it scrolls away), the brand subtitle hides, the shell padding drops to 1.4rem 1rem, and the hero stacks with Quạc first. Sticky action bars inside practice pages sit on a 92% desk tint with a dashed top rule.

## Elevation & Depth

Depth comes from paper lying on a desk: one soft ink drop shadow that falls downward under sheets and lifted pieces, plus small tilts. Nothing glows and nothing uses a hard offset shadow. Shadows answer state: pieces lift on hover, press down on click, and the mic sits on the highest shadow because it is the main action.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 16px 28px -20px rgb(11 21 51 / 60%)`): sheets, buttons, speech bubbles, step cards, current route stop, current dialogue line.
- **Lift** (`box-shadow: 0 22px 34px -18px rgb(11 21 51 / 60%)`): hover on buttons and match tiles; the mic at rest.
- **Press** (`box-shadow: 0 6px 12px -10px rgb(11 21 51 / 70%)`): the 90ms active state.
- **Logo** (`box-shadow: 0 10px 16px -10px rgb(0 47 167 / 85%)`): the tilted Quạc tile in the brand only.
- At night the same shadows turn to pure black at 75–85%.

### Named Rules
**The Lift-and-Press Rule.** Controls lift on hover (translateY(-3px) rotate(-1deg) with the Lift shadow, hover-capable devices only) and press down on click (translateY(1px) with the Press shadow). This replaces the old Duolingo press lips; never bring back a solid bottom lip.

**The Small Tilt Rule.** Tilts stay within about ±1.5° for pieces and sheets (current stop -1.2°, the today sheet -0.3°, the second and third panels +0.8° and -0.6°). Only number circles (-5° to -6°) and the logo tile (-4°) lean further.

## Shapes

Every shape looks hand-drawn. Sheets use a 9-slice SVG frame (`border-image: var(--frame) 30 fill / 30px`, 24px on phones) with the fill baked into the drawing. Because of that, no square corner shows outside the line. The frame comes in four fills: white, matcha-tint, pink and green, with night versions in navy and chalk. Under forced colours the drawing drops to a plain system border.

Pieces that are not sheets (buttons, inputs, quiz options, dialogue lines, route stops) use a 2–2.5px ink border with wobbly asymmetric radii: sheet (22/14/26/12), piece (14/20/12/22) and small (10/14/9/15). Numbers always sit in organic blob circles. Notes, tips and explanations use a dashed ink border on a 12–14px radius, and pills and chips are full capsules. Speech bubbles have one tight corner (6px) toward the speaker plus a drawn tail. Washi tape is a clipped, rotated strip: yellow at -4° on the left and pink at +5° on the right, on the working sheets (today, turn, target, flashcard, summary). Phones keep only the yellow strip.

Icons are one drawn stroke family: a 24px grid, 2.1px round strokes in the current text colour, always `aria-hidden` next to a text label.

## Components

### Buttons
Drawn and tactile: they lift when you hover and press down when you click.
- **Shape:** wobbly piece radius, 2.5px ink border, min height 44px (38px small, 54px large).
- **Default:** paper with ink Itim text at 1.12rem, padding 0.5rem 1.1rem, Rest shadow.
- **Primary:** Act-Here Yellow with ink text. When disabled it returns to paper; every disabled button drops its shadow and fades to 55%.
- **Hover / Active / Focus:** Lift-and-Press Rule; the global Klein focus ring.
- **Ghost:** transparent with no shadow, turning paper on hover. **Danger:** pink. **Danger ghost:** crimson text, pink paper on hover. **Link button:** Klein text in the body face with a 40% Klein underline that goes solid on hover.

### Mic Button (signature control)
A 116px blob circle in yellow with a 38px mic icon and an Itim label, resting on the Lift shadow. On hover it tilts -4° and scales to 1.03; on press it scales to 0.95. While listening it turns pink and a dashed ink ring circles it (7s rotation, motion permitting). While requesting or processing it uses soft fill. There is always a text-answer field beside it.

### Chips and Pills
- **Chips** (filters): paper capsule, 2px ink, body face at 600 / 0.875rem, 38px tall. Hover lifts with a -1.5° tilt; the active chip is yellow.
- **Pills** (status labels): soft-fill capsule, 1.5px ink, 600 / 0.8rem. Ok is green, warn is pink, AI is lilac, quiet is paper. A link pill turns yellow on hover.
- **Listening chips:** before the learner submits, transcript lines collapse into numbered play chips (capsules with an Itim speaker label and a play button). This keeps the words hidden.

### Cards / Containers (sheets)
- **Corner Style:** the drawn 9-slice frame (sheet radius as fallback).
- **Background:** baked into the frame: white, or green for ok, pink for warn.
- **Shadow Strategy:** Rest.
- **Internal Padding:** 1.25rem 1.4rem (1.1rem 1.05rem on phones).
- **Tape:** only on the sheets the learner works on.

### Inputs / Fields
- **Style:** paper, 2px ink border, piece radius, body face at 500 / 1rem, min height 44px, ink-3 placeholder, Klein caret.
- **Focus:** the global 3px Klein outline.
- Fields stack with a 0.35rem label gap and a max width of 420px.

### Navigation
- **Top bar:** a -4° tilted Quạc tile on paper, "English Speaking Coach" in Itim at 1.5rem with a desk-ink subtitle, then seven Itim text links at 1.12rem. A Klein underline draws in from the left on hover. The current page gets a yellow highlighter band that swipes in. There are no icons in the nav.
- **Route rail (desktop):** "Lộ trình học n/10", then ten stops. Each stop is a paper piece with a blob number, the English title, and the Vietnamese line under it. Finished stops have a green number and a green check. Exactly one stop is yellow (tilted -1.2°): the scenario on screen, or else the one Home recommends next. Hover nudges a stop 4px right.
- **Phone:** the nav wraps to two rows and scrolls away with the page.

### Lesson Head
A 64px blob number (50px on phones), tilted -5°, next to the Itim `h1`. A Klein hand-drawn scribble sits under the title (up to 340px wide), followed by a meta line in 600 / 0.94rem muted text.

### Route List and Mode Panels
Scenario lists are route stops: 52px blob numbers connected by a 3px dashed ink line, with an Itim 1.5rem title linked in ink (Klein underline on hover) and a desk-ink summary. Done stops turn green. The three practice modes are panels with 46px number-fill circles, joined by Klein drawn arrows.

### Quiz Options
Each option is a drawn row: a paper piece with a 30px lettered blob circle (letters come from a CSS counter, so the label text is just the answer). The real radio input stays in the row, visually hidden, for keyboards and screen readers. The row shows the focus ring when its radio has focus. Hover slides the row 5px right. The checked option gets yellow paper and a yellow letter tilted -6°. Once graded, the correct answer gets green paper and a green letter, and a wrong pick gets pink paper and a pink letter. Question numbers sit in a 32px soft-fill blob beside the question.

### Chat and Dialogue
The partner writes on paper (bubble with a tight bottom-left corner). The learner writes in Klein (white text, tight bottom-right corner). Bubbles slide in from their own side. Dialogue lines are paper pieces; the learner's lines use paper-me, and the line currently playing turns yellow with a -0.6° tilt.

### The Highlighter Pass (signature)
Transcript words at 1.25rem / 2.1. Heard words get a green marker band (38–90% of the line height); missing words get a pink band plus a 1.5px wavy crimson underline. The bands swipe in left to right, one word after another, 70ms apart (capped at 12 steps), each in 520ms. At night each band covers the full glyph height, the text turns ink, and the underline turns ink, so Vietnamese diacritics never land on navy. The same yellow band marks a headline's key phrase (`.hl`) and the current nav link. The match is never shown as a grade: the percentage appears only as plain text inside the honesty line, which says it is a transcript match and not a pronunciation score.

### Progress Bars and Streak
Bars are 16px capsule tracks (2px ink border, tinted track) filled with green and fine diagonal ink hatching, with an ink edge at the fill end. They grow in over 800ms. The streak is a paper capsule with an Itim count and a pixel flame; once lit it turns yellow and tilts.

### Quạc (mascot)
Quạc is an original pixel-art duck drawn from sprite sheets. Movement snaps to whole sprite pixels, so the art stays crisp. Its moods are idle (blink and bob), listen (bob and Klein sound bars), happy (hop), cheer (three hops), confused (shake and a question mark) and wave. Sparkles and confetti appear only at the end-of-lesson moment. Quạc is always `aria-hidden`; the speech bubble or text beside him carries the meaning, tinted green or pink with the same jobs as everywhere else.

### Sound and Motion
Sounds are short 8-bit square-wave effects synthesized with Web Audio (correct, retry, complete, pop), at a low volume and with no audio files. They are on by default, can be turned off in Settings, and never play while a microphone session is open. Motion answers the learner and never decorates. Everything uses `--ease-out` (cubic-bezier(0.16, 1, 0.3, 1)) at 280–900ms, and all of it sits behind `prefers-reduced-motion: no-preference`. A global reduce rule also cuts transitions to near zero.

## Do's and Don'ts

### Do:
- **Do** put every sheet in the drawn frame and every number in a blob circle; outline pieces in ink at 2–2.5px.
- **Do** keep each marker colour to its one job, and put ink text on every marker fill in both themes.
- **Do** keep exactly one yellow stop on the route, and return a disabled primary to paper.
- **Do** use Itim for headings, buttons, nav and numbers, and Be Vietnam Pro for everything read.
- **Do** keep a text fallback beside every voice action and 44px minimum targets.
- **Do** let marks at night cover the full glyph height so diacritics stay readable.
- **Do** keep every animation behind `prefers-reduced-motion` and keep Quạc `aria-hidden` next to meaningful text.

### Don't:
- **Don't** present a transcript match as a grade, badge or score; it is plain text inside the honesty line.
- **Don't** bring back Duolingo-style press lips, glowing blue mics, blue pill nav or grey hairline cards.
- **Don't** add an amber or cream warning tone; warning is pink with crimson text.
- **Don't** use lilac for anything except the local-AI note.
- **Don't** use emoji or glyph icons; icons are the drawn stroke family, `aria-hidden`, beside a label.
- **Don't** add uppercase eyebrow or kicker labels above headings.
- **Don't** play sounds while the microphone is listening.
