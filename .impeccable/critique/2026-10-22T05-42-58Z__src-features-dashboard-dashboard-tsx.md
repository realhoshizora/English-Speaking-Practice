---
target: dashboard
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\eng127\\Desktop\\Project English\\ESP (English Speaking Practice)\\src\\features\\dashboard\\Dashboard.tsx"
target_fingerprint: "sha256:05bb3b14b72758d68f7cc5fb1d8af7e74ae756eb9cd741d318a6dac66a1172dd"
target_path: "C:\\Users\\eng127\\Desktop\\Project English\\ESP (English Speaking Practice)\\src\\features\\dashboard\\Dashboard.tsx"
timestamp: 2026-10-22T05-42-58Z
slug: src-features-dashboard-dashboard-tsx
---
Method: dual-agent (A: design review · B: detector), source-only (no browser tool)

# Critique: Home dashboard (src/features/dashboard/Dashboard.tsx)

## Design Health Score: 25/40 (Acceptable)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | "hoạt động" undefined; 0/3 gives no next step |
| 2 | Match System / Real World | 2 | English card titles + jargon (scripted, Ollama, AI cục bộ) for A1 teens |
| 3 | User Control and Freedom | 3 | Mode notice not dismissible |
| 4 | Consistency and Standards | 2 | Two btn-primary (:46, :64) to different "start" routes; EN headings / VI buttons |
| 5 | Error Prevention | 3 | No secureContext/https warning |
| 6 | Recognition Rather Than Recall | 3 | "(A1)" unexplained |
| 7 | Flexibility and Efficiency | 2 | No resume; next = first incomplete in array order |
| 8 | Aesthetic and Minimalist Design | 2 | h1 repeats brand; ~7 equal-weight blocks; CTA is smallest button |
| 9 | Error Recovery | 3 | Link always "Kiểm tra micro" even when only TTS missing |
| 10 | Help and Documentation | 2 | Session flow and completion rule (speaking + listening pass) never explained |

## Design Specificity Verdict
LLM: mostly category-interchangeable (hero, notice, progress, 4 stats, 4 emoji cards). Only the "Tiếp tục với" line is product-specific, and it ignores titleVi and the Vietnamese scenario description. "The Practice Room" is not visible.
Detector: dashboard markup clean (0). global.css: 5 side-tab findings (feedback/result screens, not Home; `.sub` likely false positive); 10 off-scale font-size advisories. No browser overlay.

## Priority Issues
- [P1] Primary action is not the hero: next-scenario is an inline btn-sm (:43-49) under a brand h1 (:16). Fix: hero "today's scenario" card with title, titleVi, description, level pill, full primary CTA; fold DailyGoal in; task-oriented h1. → layout
- [P1] Two competing primaries / duplicate start paths (:46 scenario detail, :64 speaking hub). Fix: demote :64; compact secondary row for feature cards. → distill
- [P2] First-run wall of zeros (empty card + zero StatCards + 0/3 bar). Fix: when isNew, hide stats, show 3-step "how practice works" strip. → onboard
- [P2] Permanent jargon mode notice above CTA (:20-31). Fix: small pill on hero card, details in Settings; keep amber capability notice. → clarify
- [P3] Capability notice gaps: fixed link text (:37), no secureContext check, messages run together. → harden

## Persona Red Flags
- Jordan: six entry points, no "start here"; A1/scripted/hoạt động unexplained; h1 is brand.
- Casey (390px): wrapped nav, hero, 1–2 notices before a small inline CTA; no resume after interruption.
- Linh (shy teen alone): no early "nothing is recorded, mistakes are OK"; zeros feel like a report card; Listen and Repeat not offered as safe first step.

## Minor Observations
- h2 emoji (:62-83) and 🎉 not aria-hidden.
- "(A1)" should use .pill.
- All-complete state has no next step.
- "Số liệu bên dưới" is position-dependent copy.
- 10 off-scale font sizes in global.css.

## Questions to Consider
1. If the learner can do only one thing here, why offer six?
2. Who are the four stat tiles for?
3. Why isn't each scenario's Vietnamese story the first thing a shy student reads?
