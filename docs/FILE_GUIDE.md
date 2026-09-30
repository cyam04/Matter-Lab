# 🗺️ FILE GUIDE — MatterLab Project
### "Kaunsi file kya karti hai" — Quick Reference

---

## PROJECT STRUCTURE

```
d:\Moleqyn- Projects\
│
├── 📄 index.html              ← START HERE (main page)
├── 📄 CHANGELOG.md            ← Change history (READ THIS!)
│
├── 📁 css\
│   └── 📄 style.css           ← All visual design
│
├── 📁 js\
│   ├── 📄 matter-lab.js       ← Physics engine (Canvas)
│   └── 📄 main.js             ← App logic + UI
│
└── 📁 docs\
    ├── 📄 FILE_GUIDE.md       ← YEH FILE (file map)
    ├── 📄 CHANGELOG.md        ← (also at root)
    └── 📄 HOW_TO_ADD_CHANGES.md ← Future workflow
```

---

## FILE DETAILS

### 📄 index.html
**Purpose:** HTML structure / skeleton of the app
**Contains:**
- Header (brand + controls)
- Tab buttons (States, Diffusion, Solution)
- Canvas container (where particles are drawn)
- Right panel (controls, meters, aha box)
- Script tags (loads JS files at bottom)

**RULE:** Koi JavaScript logic nahi hona chahiye yahan
**RULE:** Koi CSS/style nahi hona chahiye (except small inline)

```html
<!-- Typical structure: -->
<header>  ← Top bar with brand + buttons
<main>
  <div class="module-tabs"> ← Tab buttons
  <div class="lab-layout">
    <section class="chamber-wrap"> ← Canvas (left 65%)
    <aside class="right-panel">   ← Controls (right 35%)
  </div>
  <div id="aha-box"> ← Educational explanation box
</main>
```

---

### 📄 css/style.css
**Purpose:** All visual styling — colors, fonts, layout, animations
**Contains:**
- CSS Variables (design tokens at top)
- Dark/Light mode themes
- Header styles
- Canvas container styles
- Substance card styles (v2.0+)
- Meter chip styles
- Slider styles
- AHA box styles
- Responsive (mobile/tablet) styles

**HOW TO FIND THINGS:**
```css
/* === HEADER === */        ← search "HEADER"
/* === CANVAS === */        ← search "CANVAS"
/* === SUBSTANCE PICKER */ ← search "SUBSTANCE PICKER"
/* === METERS === */        ← search "METERS"
/* === AHA BOX === */       ← search "AHA"
/* === RESPONSIVE === */    ← search "RESPONSIVE"
```

**KEY CSS Variables (at top of file):**
```css
:root {
  --bg-base: #0b0f1a;           /* main background */
  --bg-card: #1a2236;           /* card background */
  --accent-primary: #38bdf8;    /* sky blue — main brand color */
  --accent-secondary: #a78bfa;  /* purple — secondary */
  --accent-hot: #f97316;        /* orange — hot/fire color */
  --accent-cold: #22d3ee;       /* cyan — cold/ice color */
  --text-primary: #e2e8f0;      /* main text */
  --text-muted: #64748b;        /* subtle/dim text */
}
```

---

### 📄 js/matter-lab.js
**Purpose:** 2D Canvas particle physics engine
**Contains:**
- SUBSTANCES catalog (50 substances with data)
- Particle creation (makeParticle function)
- Physics update loops (updateTab1, updateTab2, updateTab3)
- Draw functions (drawParticle, drawBackground, drawBurner, etc.)
- Main animation loop (requestAnimationFrame)
- Public API (functions exposed to main.js)

**HOW IT WORKS:**
```
1. init(canvas) → canvas setup
2. start() → animation loop begins
3. loop() runs 60 times per second:
   a. update physics (move particles, check walls)
   b. draw everything on canvas
   c. send live data to main.js via onFrame callback
```

**PUBLIC API (functions called from main.js):**
```javascript
MatterLab.init(canvas)           // Setup karo
MatterLab.start()                // Animation start karo
MatterLab.setTab(1|2|3)         // Module tab switch karo
MatterLab.setSubstance('water') // Substance change karo
MatterLab.setTemperature(25)    // Temperature set karo (-50 to 200)
MatterLab.setPressure(0)        // Pressure set karo (0 to 50)
MatterLab.setBarrier(true)      // Diffusion barrier on/off
MatterLab.setDiffTemp(25)       // Diffusion temperature
MatterLab.setSoluteType('salt') // Solution tab ke liye
MatterLab.setLaser(true)        // Tyndall laser on/off
MatterLab.SUBSTANCES            // 50-substance catalog (read-only)
MatterLab.onFrame = (data) =>   // Callback: har frame par data milta hai
MatterLab.onStateChange = (ps)=>// Callback: jab solid/liquid/gas change ho
```

---

### 📄 js/main.js
**Purpose:** App logic, UI interactions, language, event listeners
**Contains:**
- App state object (current substance, temp, language, etc.)
- Language strings (Hinglish + English — L.hi and L.en)
- AHA box messages (educational explanations — AHA.hi and AHA.en)
- buildSubstancePicker() — creates 50 substance cards dynamically
- switchTab() — handles module tab switching
- applyLanguage() — updates all text when language changes
- updateMeters() — updates live readings display
- Event listeners (sliders, buttons, keyboard shortcuts)

**FLOW:**
```
1. Page loads → init() called
2. MatterLab.init(canvas) → physics engine ready
3. buildSubstancePicker() → 50 cards generated
4. MatterLab.start() → animation begins
5. User clicks/moves sliders → event listeners call MatterLab functions
6. MatterLab.onFrame callback → updateMeters() called every frame
7. AHA box updates every ~0.75 seconds
```

---

## HOW FILES TALK TO EACH OTHER

```
index.html
  │
  ├── loads → css/style.css (design)
  ├── loads → js/matter-lab.js (physics)
  └── loads → js/main.js (logic)

js/main.js ──calls──► js/matter-lab.js
  setSubstance('water')
  setTemperature(100)
  setTab(2)

js/matter-lab.js ──callbacks──► js/main.js
  onFrame(liveData)      ← har frame
  onStateChange('gas')   ← jab state badle
  onTyndall('visible')   ← laser effect
```

---

## QUICK DEBUGGING GUIDE

| Problem | Kahan Dekho |
|---|---|
| App nahi load ho rahi | index.html ka console check karo (F12) |
| Colors galat hain | css/style.css mein CSS variables |
| Particles nahi dikh rahe | js/matter-lab.js mein drawParticle() |
| Button kaam nahi kar raha | js/main.js mein event listeners |
| Language toggle broken | js/main.js mein applyLanguage() |
| Canvas blank hai | matter-lab.js mein init() ya resize() |

---

*MatterLab FILE_GUIDE.md | v3.0 | 2026-09-28*
