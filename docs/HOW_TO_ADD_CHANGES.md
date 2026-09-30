# ➕ HOW TO ADD CHANGES — MatterLab
### "Agla change kaise document karein" — Step-by-step workflow

---

## RULE: Jab bhi koi badlav karo → document karo!

### STEP 1 — CHANGELOG.md update karo

File: `d:\Moleqyn- Projects\CHANGELOG.md`

Copy this template at the BOTTOM of the file:

```markdown
---

### CHANGE X.Y — [Ek line mein describe karo]

**DATE:** 2026-XX-XX HH:MM IST
**FILE:** [js/matter-lab.js ya css/style.css ya index.html]
**WHY:** [User ne kya maanga / kya problem thi]

OLD CODE (jo pehle tha — KAAM NAHI KARTA):
    // Purana code yahan comment mein likho
    // OLD: const size = 6;

NEW CODE (jo abhi kaam kar raha hai):
    // Naya code yahan likho
    // NEW: const size = 9.5;

LESSON: [Ek sentence mein kya sikhne ko mila]
```

---

## STEP 2 — JS File ke top par VERSION header update karo

File: `js/matter-lab.js` ke bilkul top par:

```javascript
/* ═══════════════════════════════════════════════════
   MatterLab – matter-lab.js
   2D Canvas Particle Physics Engine

   VERSION HISTORY:
   v1.0 (2026-09-28 03:41) – Initial build: 3 substances, basic particles
   v2.0 (2026-09-28 04:03) – 50 substances, bigger particles, trails, 3D glow
   v3.0 (2026-09-28 04:22) – Documentation system added
   vX.X (YYYY-MM-DD HH:MM) – [YAD ELI LIKHO]   ← NAYA VERSION YAHAN ADD KARO
   ═══════════════════════════════════════════════════ */
```

---

## STEP 3 — Changed code ke paas inline comment add karo

Jahan bhi code change kiya, uske upar ya side mein comment likho:

```javascript
// ─────────────────────────────────────────────────
// v2.0 CHANGE (2026-09-28): Particle sizes increased
//   WHY: Classroom Smart Board pe small particles dikh nahi rahe the
//   OLD: const PSIZE = { solid: 6, liquid: 5.5, gas: 4 };
// ─────────────────────────────────────────────────
const PSIZE = { solid: 9.5, liquid: 7.5, gas: 5.5 }; // CURRENT v2.0
```

---

## STEP 4 — CSS file mein bhi comment add karo (agar CSS change hai)

```css
/* ─────────────────────────────────────────────────
   v2.0 CHANGE (2026-09-28): Substance cards redesigned
   OLD: .substance-btn { display: flex; padding: 0.6rem; }
   NEW: .sub-card with gradient backgrounds + glow
   ─────────────────────────────────────────────────*/
.sub-card {
  /* current styles... */
}
```

---

## VERSION NUMBERING SYSTEM

```
vMAJOR.MINOR

MAJOR = big change (new feature, major redesign)
  Examples:
  v1.0 → v2.0: 3 substances se 50 substances (major!)
  v2.0 → v3.0: Documentation system (new feature)

MINOR = small fix or addition
  Examples:
  v1.0 → v1.1: Bug fix
  v2.0 → v2.1: New AHA message added
  v2.2 → v2.3: Color tweak
```

---

## AI PROMPT TEMPLATE (Future use ke liye)

Jab bhi AI se kuch change karwana ho, yeh prompt use karo:

```
Change: [kya karna hai]
File: [kaunsi file]
Current code: [paste karo jo abhi hai]
Why: [reason]

Please:
1. Make the change
2. Add inline comment showing old code
3. Update CHANGELOG.md with this format:
   ### CHANGE X.Y — [name]
   OLD: [old code]
   NEW: [new code]
   LESSON: [what concept was used]
```

---

## EXAMPLE — Complete workflow

**Example:** User ne kaha "Particle count 88 se 120 karo"

### Step 1: CHANGELOG.md mein add karo:
```markdown
### CHANGE 3.2 — Particle Count Increase

DATE: 2026-09-28 05:00 IST
FILE: js/matter-lab.js
WHY: More particles = denser, more realistic simulation

OLD CODE:
    const PCOUNT = 88; // v1.0 to v2.0

NEW CODE:
    const PCOUNT = 120; // v3.2

LESSON: Constants (const) → value ek baar set hoti hai, change nahi hoti.
        Ek jagah se change karo → poore code mein effect.
```

### Step 2: matter-lab.js ke version header mein add karo:
```javascript
// v3.2 (2026-09-28 05:00) – Particle count 88 → 120
```

### Step 3: Code ke paas comment add karo:
```javascript
// v3.2 CHANGE: Particle count increased for denser simulation
// OLD: const PCOUNT = 88;
const PCOUNT = 120; // CURRENT
const DIFF_COUNT = 55; // OLD: 44
```

---

## FILES CHECKLIST (jab bhi change karo):

```
☐ CHANGELOG.md mein naya section add kiya?
☐ Changed JS/CSS file ke top par version updated?
☐ Changed code ke paas inline comment add kiya?
☐ Old code comment mein rakha (delete nahi kiya)?
☐ Browser mein test karke dekha kaam kar raha hai?
```

---

*HOW_TO_ADD_CHANGES.md | v3.0 | 2026-09-28*
