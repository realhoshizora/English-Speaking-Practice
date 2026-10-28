---
version: 1
slug: "src-app-app-tsx"
primary_target: "src/app/App.tsx"
related_targets: ["src/styles/global.css","src/features/dashboard/Dashboard.tsx"]
---

# Surface brief: app shell and every route

Scope: the whole app (Home, Speaking, Listening, Scenarios, Vocabulary, My Progress, Settings) on one shared shell. Mode: Operate.
Audience and job: Vietnamese A1–B1 students practising alone at home, phones and laptops equally. The job: rehearse a scenario out loud (listen, speak, see what the browser heard, retry) and come back daily.
Pinned by the user: the look and interface of their own handbook site "Cẩm nang Dwell" (https://cam-nang-dwell.onrender.com), "kiểu như này". Its CSS was read in full; tokens, fonts, frames and component treatments come from it. One later change by the user: the cyan desk glared ("hơi lóa mắt"), so they picked matcha latte #c5d7a7 from a side-by-side comparison.
Keep: every route and function, the honesty lines (scripted mode is "không phải AI"; transcript match is not a pronunciation score), a text fallback beside every voice action, 44px targets, light and dark themes (Dwell has no dark theme: ours is the same world at night), reduced motion, Quạc as pixel art (the owner chose it).
Unresolved: none blocking. Translations named here: Duolingo press lips become Dwell's lift-and-press with soft ink shadow; emoji nav icons are dropped (Dwell's nav is text).

## Direction contract

THESIS: The app becomes the learner's own hand-drawn speaking handbook: paper sheets taped onto a matcha-latte dotted desk, the ten scenarios as a numbered route, the one thing to do or remember marked with a highlighter. It refuses the white app with blue pill nav, grey hairline cards and a glowing blue mic that we shipped.

OWN-WORLD: Matcha latte #c5d7a7 ground with an 18px white dot grid (the owner swapped Dwell's #8edcf1 cyan for it because the cyan glared; number circles and tinted notes follow in matcha); ink #0b1533 outlines at 2–2.5px; white sheets in a hand-drawn SVG frame with yellow and pink washi tape; wobbly asymmetric radii and organic number circles; Itim for headings, buttons, numbers and nav, Be Vietnam Pro for reading; yellow #ffe14d = act here / you are here, Klein #002fa7 = links, focus, scribbles and "you" in chat; green #9be88b = heard / done; pink #ff8fb8 = missing / warning. Soft ink drop shadows and ±1° tilts. At night: navy ground, chalk ink, the same marks.

STORY: The learner sees where they are on the ten-stop route, takes the one yellow next step, speaks, and watches what the browser heard marked word by word; stops turn green as scenarios finish.

FIRST VIEWPORT: Sticky matcha top bar with a thick ink rule (not sticky on phones, where the nav wraps to two rows): tilted Quạc tile, "English Speaking Coach" in Itim with a subtitle, seven Itim text links (current page swiped yellow). Desktop adds a left rail "Lộ trình học n/10" with ten numbered stops (green done, yellow current). Home: Itim headline with a yellow highlighter on its key phrase, Quạc with a hand-drawn speech bubble, then the taped "today" sheet with the yellow "Bắt đầu luyện nói". Practice screens: numbered lesson head (ink circle, Itim title, Klein scribble), taped practice sheet, the mic as a large yellow ink circle. Signature interaction, the highlighter pass: heard words swipe green left to right one after another, missing words swipe pink with a wavy underline; it never reads as a grade.

FORM: User-pinned world (their own site) overrides the roll's assigned "Vở ghi theo Unit"; the assignment survives as topology (numbered scenario heads, the route) and state vocabulary (highlighter for heard words). Position: user pin, above my ordered list. seed:91369a220a97d962

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
