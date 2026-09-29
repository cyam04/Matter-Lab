# 📖 MatterLab – CHANGELOG
### "Jo badlav hua, woh sab yahan hai" – Every change documented here

> **For:** Beginners learning to code with AI
> **Format:** Date → What changed → Why → Old code → New code
> **Language:** Hinglish + English

---

## HOW TO READ THIS FILE

```
[VERSION]  → Project ka version number (v1.0, v2.0, v3.0...)
[DATE]     → Kab badla
[FILE]     → Konsi file mein badlav hua
[WHY]      → Kyun badla (reason)
[OLD CODE] → Purana code kya tha (as comment, kaam nahi karta)
[NEW CODE] → Naya code kya hai (yeh kaam karta hai)
[LEARN]    → Is change se kya sikhne ko mila
```

---

## ═══════════════════════════════════
## VERSION 1.0 — "Foundation Build"
## Date: 2026-09-28 | Time: ~03:41 IST
## ═══════════════════════════════════

### What was built in v1.0?

Pehli baar poora project create kiya gaya:
- index.html — App ka structure (layout, tabs, controls)
- css/style.css — Design system (colors, fonts, animations)
- js/matter-lab.js — Particle physics engine (Canvas 2D)
- js/main.js — App logic (buttons, sliders, language toggle)

---

### CHANGE 1.1 — Project Folder Structure

**WHY:** Organized code → easier to find and fix things later

```
MatterLab/
├── index.html        ← Main page (sirf structure, koi logic nahi)
├── css/
│   └── style.css     ← Sirf design (colors, fonts, layout)
└── js/
    ├── matter-lab.js ← Sirf physics (particles ka movement)
    └── main.js       ← Sirf logic (buttons, sliders ka kaam)
```

LESSON: "Separation of Concerns"
  - Har file ka ek kaam hona chahiye
  - Isse debugging aasaan hoti hai
  - Example: Agar color change karna hai → sirf style.css open karo

---

### CHANGE 1.2 — HTML Canvas Particle System

**FILE:** js/matter-lab.js
**WHY:** Particles ko draw karne ka sabse fast tarika

OLD APPROACH (jo nahi kiya — div elements):
```
// BAD: 90 div elements banao, CSS se position karo
// Problem: Browser slow ho jaata, animation jaggy lagti
div.particle { position:absolute; left:100px; top:200px; }
```

NEW APPROACH (jo kiya — HTML5 Canvas):
```javascript
// GOOD: Ek canvas element, JavaScript se sab draw karo
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d'); // 2D drawing context

function drawParticle(p) {
  ctx.beginPath();                    // naya path start
  ctx.arc(p.x, p.y, p.r, 0, 6.28);  // circle draw karo
  ctx.fillStyle = p.color;            // color set karo
  ctx.fill();                         // fill karo
}

// requestAnimationFrame = smooth 60fps animation
function loop() {
  ctx.clearRect(0, 0, W, H);  // screen saaf karo
  particles.forEach(drawParticle);  // sab particles draw karo
  requestAnimationFrame(loop); // next frame schedule karo
}
```

LESSON: requestAnimationFrame (RAF)
  - Browser ke saath sync rahta hai
  - Automatic 60fps (har 16.67ms ek frame)
  - Tab hidden ho toh automatically pause ho jaata hai

---

### CHANGE 1.3 — 3 Substances System (v1.0)

**FILE:** js/matter-lab.js
**WHY:** Simple start ke liye sirf 3 substances

v1.0 CODE (3 substances):
```javascript
// OLD v1.0 — sirf 3 substances, 2 separate objects mein
const CFG = {
  colors: {
    water:   { solid: '#63b3ed', liquid: '#38bdf8', gas: '#7dd3fc' },
    iron:    { solid: '#94a3b8', liquid: '#f97316', gas: '#fb923c' },
    camphor: { solid: '#c4b5fd', liquid: '#a78bfa', gas: '#ddd6fe' },
  }
};

const PHASES = {
  water:   { melt: 0,   boil: 100 },
  iron:    { melt: 90,  boil: 170 },
  camphor: { melt: null, boil: 50 },  // null = no liquid phase
};
```

PROBLEM: Data 2 alag objects mein tha (CFG.colors + PHASES)
         50 substances add karne ke liye 50 entries dono mein likhne padte

→ Fixed in v2.0 with single SUBSTANCES catalog (see CHANGE 2.1)

---

### CHANGE 1.4 — Particle Sizes (v1.0 — Small)

**FILE:** js/matter-lab.js
**WHY:** Default sizes rakhi thin

v1.0 SIZES (too small for classroom):
```javascript
// OLD v1.0 — Chote particles
// Ek circle ka radius:
// Solid:  r = 6px
// Liquid: r = 5.5px
// Gas:    r = 4px
// Problem: 1080p projector / Smart Board par dikh nahi rahe the!
```

→ Fixed in v2.0 (see CHANGE 2.3)

---

### CHANGE 1.5 — Tab Switching System

**FILE:** index.html, js/main.js
**WHY:** Teen modules ke liye teen tabs chahiye the

HOW IT WORKS:
```javascript
// HTML mein tabs:
// <button class="mod-tab" data-tab="1">States</button>
// <button class="mod-tab" data-tab="2">Diffusion</button>
// data-tab = custom attribute (apna data store karo HTML mein)

function switchTab(tabNum) {
  App.activeTab = tabNum;

  // Sab tabs deactivate karo
  document.querySelectorAll('.mod-tab').forEach(b =>
    b.classList.remove('active')
  );

  // Clicked tab activate karo
  document.querySelector(`[data-tab="${tabNum}"]`)
    .classList.add('active');

  // Physics engine ko bhi batao
  MatterLab.setTab(tabNum);
}

// Event listeners attach karo
document.querySelectorAll('.mod-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(parseInt(btn.dataset.tab));
    // btn.dataset.tab → HTML ke data-tab attribute ka value
  });
});
```

LESSON: data-* attributes
  - HTML elements par apna custom data store kar sakte hain
  - data-tab="1" → JavaScript mein btn.dataset.tab se access karo
  - data-key="water" → btn.dataset.key se access karo

---

### CHANGE 1.6 — Bilingual System (Hinglish + English)

**FILE:** js/main.js
**WHY:** Indian students ke liye Hinglish support

HOW IT WORKS:
```javascript
// Ek big object mein dono languages ka sab text
const LANG = {
  hinglish: {
    tab1: '🧊 States & Latent Heat',
    solid: 'Thaos (Solid)',
    liquid: 'Drava (Liquid)',
    meterState: 'Current State',
  },
  english: {
    tab1: '🧊 States & Latent Heat',
    solid: 'Solid',
    liquid: 'Liquid',
    meterState: 'Current State',
  }
};

// Helper function — ek shortcut
function t(key) {
  return LANG[App.lang][key] || key;
  // App.lang = 'hinglish' ya 'english'
  // || key = agar key nahi mili toh key khud return karo (fallback)
}

// Usage anywhere in code:
document.getElementById('meter-state').textContent = t('meterState');
// Automatic sahi language mein!
```

LESSON: Internationalization (i18n)
  - Ek t() function se poori app ki language change
  - Sab strings ek jagah — easy to update
  - || fallback pattern — error se bachata hai

---

### CHANGE 1.7 — AHA! Box Educational Messages

**FILE:** js/main.js
**WHY:** Real-time explanations for students

HOW IT WORKS:
```javascript
const AHA_MESSAGES = {
  hinglish: {
    // Key format: "state_substance"
    solid_water:  '❄️ Paani abhi Barf hai! Particles vibrate karte hain...',
    liquid_water: '💧 Paani Liquid mein hai. Particles freely move...',
    gas_water:    '♨️ Paani Bhap ban gaya! Particles fly rapidly...',
    gas_camphor:  '✨ Sublimation! Kapoor seedha solid se gas...',
    // ...
  }
};

function getAhaMessage() {
  const ps = App.lastLiveData.particleState; // 'solid'/'liquid'/'gas'
  const sub = App.currentSubstance;          // 'water'/'iron'/'camphor'

  const key = `${ps}_${sub}`;  // → 'solid_water', 'gas_camphor'
  // Template literal: backtick ` ke andar ${} se variable insert karo

  return AHA_MESSAGES[App.lang][key] || DEFAULT_MESSAGE;
}

// Every 45 frames (~0.75 seconds) update karo
App._ahaTick = (App._ahaTick || 0) + 1;
if (App._ahaTick % 45 === 0) updateAha();
```

LESSON: Dynamic object keys
  - JavaScript mein object[key] se dynamic key access kar sakte hain
  - `${var1}_${var2}` → string concatenation with template literal
  - % (modulo) operator → har N-th call pe kuch karo

---

## ═══════════════════════════════════
## VERSION 2.0 — "50 Substances + Big UI"
## Date: 2026-09-28 | Time: ~04:03 IST
## User Request: "more creativity, visibility, 50 substances"
## ═══════════════════════════════════

### CHANGE 2.1 — 3 → 50 Substances (Catalog System)

**FILE:** js/matter-lab.js
**WHY:** User feedback: "substance limited hai, 50 chahiye"

OLD v1.0 (2 separate objects, 3 substances):
```javascript
// OLD — Data scattered across 2 objects
const CFG = { colors: { water: {...}, iron: {...}, camphor: {...} } };
const PHASES = { water: {...}, iron: {...}, camphor: {...} };
// Problem: Add karne ke liye DONO jagah likhna padta tha
```

NEW v2.0 (1 catalog object, 50 substances):
```javascript
// NEW v2.0 — Single source of truth
const SUBSTANCES = {
  // 15 SOLIDS
  iron: {
    nameHi:'Loha', nameEn:'Iron', formula:'Fe', emoji:'⚙️',
    cs:'#94a3b8',    // colorSolid  (cs = short name)
    cl:'#f97316',    // colorLiquid
    cg:'#fbbf24',    // colorGas
    melt:90,         // melting point (demo scale, not real)
    boil:170,        // boiling point (demo scale)
    sp:null,         // special: null, 'sublime'
    cat:'solid'      // category: solid/liquid/gas
  },
  camphor: {
    nameHi:'Kapoor', nameEn:'Camphor', formula:'C₁₀H₁₆O', emoji:'🏔️',
    cs:'#e9d5ff', cl:'#a78bfa', cg:'#ddd6fe',
    melt:null,  // null = no melting (goes solid → gas directly)
    boil:50,    // sublime temperature
    sp:'sublime', cat:'solid'
  },
  water: {
    nameHi:'Paani', nameEn:'Water', formula:'H₂O', emoji:'💧',
    cs:'#bfdbfe', cl:'#38bdf8', cg:'#7dd3fc',
    melt:0, boil:100, sp:null, cat:'liquid'
  },
  // ... 47 more substances (iron → krypton)
};
```

WHAT CHANGED IN PHYSICS:
```javascript
// OLD v1.0 — Hardcoded substance check
function getCurrentState() {
  const t = state.temperature;
  if (state.substance === 'camphor') {
    return t >= 50 ? 'gas' : 'solid';
  }
  // etc...
}

// NEW v2.0 — Generic, works for ALL 50 substances
function getCurrentParticleState() {
  const sub = SUBSTANCES[state.substance]; // object se data lo
  const t = state.temperature;

  if (sub.sp === 'sublime') {
    return t >= sub.boil ? 'gas' : 'solid'; // skip liquid phase
  }
  if (t < sub.melt) return 'solid';
  if (t >= sub.boil) return 'gas';
  return 'liquid';
  // This one function works for ALL 50 substances!
}
```

LESSON: "Single Source of Truth" (Software Engineering Principle)
  - Ek jagah data rakho → ek jagah update karo
  - Generic code likho → har substance ke liye kaam karega

---

### CHANGE 2.2 — Static HTML → Dynamic JS-Generated Cards

**FILE:** index.html → deleted old grid; js/main.js → added buildSubstancePicker()
**WHY:** 50 substance buttons manually HTML mein likhna impossible tha

OLD v1.0 (manually written in HTML):
```html
<!-- OLD — 3 buttons manually typed in index.html -->
<div class="substance-grid">
  <button data-sub="water">💧 Paani H₂O</button>
  <button data-sub="iron">⚙️ Loha Fe</button>
  <button data-sub="camphor">🏔️ Kapoor</button>
  <!-- 50 ke liye 50 manually likhne padte! Bahut kaam! -->
</div>
```

NEW v2.0 (index.html mein sirf ek div):
```html
<!-- NEW — Sirf ek empty div, JS baaki karta hai -->
<div id="substance-picker"></div>
```

NEW v2.0 (main.js mein buildSubstancePicker function):
```javascript
function buildSubstancePicker() {
  const SUBS = MatterLab.SUBSTANCES;

  // Object.entries() → object ko [key, value] pairs ki array mein badlo
  // .map() → har element transform karo
  // .join('') → array ko ek badi string mein jodo
  const cards = Object.entries(SUBS).map(([key, sub]) => {
    return `
      <button class="sub-card" data-key="${key}" data-cat="${sub.cat}">
        <span class="sub-card-emoji">${sub.emoji}</span>
        <div class="sub-card-info">
          <span class="sub-card-name">${sub.nameHi}</span>
          <span class="sub-card-formula">${sub.formula}</span>
        </div>
        <span class="sub-card-badge ${sub.cat}">${sub.cat.substring(0,3)}</span>
      </button>
    `;
  }).join('');

  document.getElementById('substance-picker').innerHTML = cards;

  // Card click events dynamically attach karo
  document.querySelectorAll('.sub-card').forEach(btn => {
    btn.addEventListener('click', () => {
      App.currentSubstance = btn.dataset.key;
      MatterLab.setSubstance(App.currentSubstance);
    });
  });
}
```

ALSO ADDED — Filter tabs (All/Solid/Liquid/Gas):
```javascript
function filterSubstanceCards(filter) {
  document.querySelectorAll('.sub-card').forEach(card => {
    // show/hide based on category
    const show = filter === 'all' || card.dataset.cat === filter;
    card.style.display = show ? '' : 'none';
  });
}
```

LESSON: Dynamic DOM generation
  - JavaScript se HTML create karo → flexible!
  - Object.entries() + map() + join() → powerful combo
  - innerHTML = string → HTML elements ban jaate hain
  - Event delegation: dynamically created elements ke liye events

---

### CHANGE 2.3 — Bigger Particles for Classroom

**FILE:** js/matter-lab.js
**WHY:** User feedback: "bacho ko nahi dikhega" — classroom visibility

OLD v1.0 SIZES:
```javascript
// OLD — Too small for projector/Smart Board
// Radius in pixels:
// Solid:  6px
// Liquid: 5.5px
// Gas:    4px
```

NEW v2.0 SIZES:
```javascript
// NEW — 58% bigger for classroom/Smart Board visibility
const PSIZE = {
  solid:  9.5,   // OLD: 6   → +3.5px (+58%)
  liquid: 7.5,   // OLD: 5.5 → +2.0px (+36%)
  gas:    5.5    // OLD: 4   → +1.5px (+37%)
};

// Also increased particle COUNT:
// OLD: 90 particles
// NEW: 88 particles (slightly less because they're bigger)
const PCOUNT = 88;
```

---

### CHANGE 2.4 — Flat Circle → 3D Sphere Particle Rendering

**FILE:** js/matter-lab.js → drawParticle()
**WHY:** Better visual quality — premium look

OLD v1.0 drawParticle():
```javascript
// OLD — Simple flat circle (3 lines)
function drawParticle(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
}
```

NEW v2.0 drawParticle() — 3 layers:
```javascript
// NEW — 3-layer 3D sphere (~30 lines but much better!)
function drawParticle(p, forceColor) {
  const color = forceColor || p.color;
  ctx.save(); // save current canvas state

  // LAYER 1: Outer glow (aura/halo effect)
  const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
  grd.addColorStop(0, color);        // center = full color
  grd.addColorStop(1, 'transparent'); // edge = transparent
  ctx.globalAlpha = 0.22;             // 22% opacity (subtle)
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
  ctx.fill();

  // LAYER 2: Core with 3D gradient (light source at top-left)
  const coreGrd = ctx.createRadialGradient(
    p.x - p.r * 0.3, p.y - p.r * 0.3,  // light source = top-left
    p.r * 0.1,                           // inner radius (small)
    p.x, p.y, p.r                        // center, outer radius
  );
  coreGrd.addColorStop(0, lightenColor(color, 40)); // bright highlight
  coreGrd.addColorStop(0.6, color);                  // normal color
  coreGrd.addColorStop(1, darkenColor(color, 30));   // dark shadow
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = coreGrd;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();

  // LAYER 3: Specular highlight (white dot = glass/plastic shine)
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(p.x - p.r*0.32, p.y - p.r*0.32, p.r*0.34, 0, Math.PI*2);
  ctx.fill(); // small white circle at top-left = reflection

  ctx.restore(); // canvas state restore karo
}

// Helper functions:
function lightenColor(hex, amt) {
  // hex color (#38bdf8) ko parse karo → R,G,B nikalo → amt add karo
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amt);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amt);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amt);
  return `rgb(${r},${g},${b})`;
}
```

LESSON: RadialGradient = concentric circles ka gradient
  - createRadialGradient(x1,y1,r1, x2,y2,r2)
  - addColorStop(0, color) = center
  - addColorStop(1, color) = edge
  - ctx.save() / ctx.restore() = globalAlpha reset karo

---

### CHANGE 2.5 — Gas Particle Trails

**FILE:** js/matter-lab.js
**WHY:** Gas particles ki speed visually dikhni chahiye

OLD v1.0 — No trails:
```javascript
// OLD — Sirf current position draw hoti thi
// Speed "feel" nahi hoti thi visually
```

NEW v2.0 — Trail system using array as queue:
```javascript
// STEP 1: makeParticle mein trail array add kiya
function makeParticle(x, y, vx, vy, r, color) {
  return {
    x, y,           // current position
    vx, vy,         // velocity (speed direction)
    r, color,       // radius, color
    trail: []       // NEW: last 6 positions store karo
  };
}

// STEP 2: Update loop mein (gas state only)
if (particleState === 'gas') {
  p.trail.push({ x: p.x, y: p.y }); // current pos add karo
  if (p.trail.length > 6) {
    p.trail.shift(); // oldest position hata do
    // Result: hamesha sirf last 6 positions rehti hain
    // Array is behaving like a "queue" (FIFO)
  }
}

// STEP 3: Draw loop mein
p.trail.forEach((pt, i) => {
  const opacity = (i / p.trail.length) * 0.18;
  // i=0 (oldest) → opacity 0% (invisible)
  // i=5 (newest) → opacity 18% (most visible)
  ctx.globalAlpha = opacity;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, p.r * 0.7, 0, Math.PI * 2); // smaller circle
  ctx.fill();
});
```

LESSON: Array as Queue (FIFO — First In, First Out)
  - push() → end mein add karo (new item)
  - shift() → start se hata do (oldest item)
  - Result: fixed size array with rolling window

---

### CHANGE 2.6 — Temperature-Tinted Canvas Background

**FILE:** js/matter-lab.js → drawBackground()
**WHY:** Temperature feel visually convey karna tha

OLD v1.0:
```javascript
// OLD — Always same dark background
ctx.fillStyle = '#0a0f1e'; // always dark blue
ctx.fillRect(0, 0, W, H);
```

NEW v2.0:
```javascript
// NEW — Background color changes with temperature
function getTemperatureBgColor() {
  const t = state.temperature; // -50 to 200

  if (t <= 0) {
    // Cold: Deep dark blue
    // (t+50)/50 → 0 when t=-50, 1 when t=0 (normalizing)
    const f = (t + 50) / 50;
    return `hsl(${215 + f * 8}, ${55 - f * 15}%, ${5 + f * 3}%)`;
    //           Blue hue          Saturation          Lightness
  } else if (t <= 100) {
    // Normal: Neutral dark (slight shift)
    const f = t / 100;
    return `hsl(${220 - f * 35}, 40%, ${6 + f * 4}%)`;
  } else {
    // Hot: Dark orange-red
    const f = (t - 100) / 100;
    return `hsl(${185 - f * 160}, ${30 + f * 30}%, ${10 + f * 8}%)`;
    //           Hue shifts orange-red  More saturated    Brighter
  }
}
```

LESSON: HSL color space
  - H (Hue): 0=red, 120=green, 240=blue (color ka type)
  - S (Saturation): 0%=grey, 100%=vivid (color ki "intensity")
  - L (Lightness): 0%=black, 50%=normal, 100%=white
  - Normalization: (value - min) / (max - min) → 0 to 1 range

---

## ═══════════════════════════════════
## VERSION 3.0 — "Documentation System"
## Date: 2026-09-28 | Time: ~04:22 IST
## User Request: "har change save karo as comment"
## ═══════════════════════════════════

### CHANGE 3.1 — Documentation System Created

**FILES Created:**
```
docs/
├── CHANGELOG.md          ← YEH FILE (main history log)
├── PROJECT_JOURNAL.md    ← Learning journal
├── FILE_GUIDE.md         ← Kaunsi file kya karti hai
└── HOW_TO_ADD_CHANGES.md ← Future changes document karne ka tarika
```

**Also added inside each JS file:**
```javascript
/* ═══════════════════════════════════════════
   VERSION HISTORY HEADER (top of each file)
   
   v1.0 (2026-09-28) – Initial build
   v2.0 (2026-09-28) – 50 substances, bigger particles
   v3.0 (2026-09-28) – Documentation system added
   ═══════════════════════════════════════════ */
```

**And inline change comments:**
```javascript
// v2.0 CHANGE: Particle size increased for classroom visibility
const PSIZE = { solid: 9.5, liquid: 7.5, gas: 5.5 };
// v1.0 WAS: const PSIZE = { solid: 6, liquid: 5.5, gas: 4 };
```

---

## HOW TO ADD FUTURE CHANGES (Template)

Copy paste karo har baar:

```markdown
### CHANGE X.Y — [Kya badla ek line mein]

**DATE:** 2026-XX-XX
**FILE:** [filename]
**WHY:** [User ne kya maanga, ya kya problem thi]

OLD CODE:
```javascript
// Purana code yahan likho
```

NEW CODE:
```javascript
// Naya code yahan likho
```

LESSON: [Is change se kya sikhne ko mila]
```

---

## ═══════════════════════════════════
## VERSION 4.0 — "Multipage Platform Architecture"
## Date: 2026-09-28 | Time: ~11:15 IST
## User Request: "es poore projects ko mujhe multipage banana hai"
## ═══════════════════════════════════

### CHANGE 4.1 — Global Navbar & Home Page Created

**DATE:** 2026-09-28 11:15 IST
**FILE:** index.html, simulator.html, css/style.css
**WHY:** App ko single-page simulator se multipage educational platform me convert karna.

OLD CODE:
```html
    <!-- Pura simulator index.html me tha -->
    <!-- Header me sirf simulator controls the -->
    <header id="app-header">...</header>
```

NEW CODE:
```html
    <!-- 1. index.html ab ek landing/home page ban gaya hai hero section ke sath. -->
    <!-- 2. Simulator ab simulator.html me move ho gaya hai. -->
    <!-- 3. Ek global navbar add kiya hai jisse har page pe navigation possible ho. -->
    <nav class="global-navbar">...</nav>
```

LESSON: Multipage Architecture
  - Jab app badi ho jati hai, alag-alag functionalities ko different HTML files me split karna better hota hai.
  - Global navigation bar ensures seamless user experience across all pages.

---

## CONCEPTS LEARNED (By Version)

| Concept               | Version | Where Used              |
|-----------------------|---------|-------------------------|
| HTML Canvas 2D API    | v1.0    | Particle drawing        |
| requestAnimationFrame | v1.0    | 60fps animation loop    |
| Separation of Concerns| v1.0    | 3 separate files        |
| data-* attributes     | v1.0    | Tab/substance system    |
| CSS Custom Properties | v1.0    | Design tokens           |
| Template literals     | v1.0    | Dynamic HTML strings    |
| Object literals       | v1.0    | LANG, PHASES config     |
| Single Source of Truth| v2.0    | SUBSTANCES catalog      |
| Object.entries()+map()| v2.0    | Dynamic card generation |
| RadialGradient        | v2.0    | 3D sphere effect        |
| HSL color model       | v2.0    | Temperature background  |
| Array as Queue        | v2.0    | Particle trails         |
| ResizeObserver API    | v2.0    | Responsive canvas       |
| ctx.save()/restore()  | v2.0    | globalAlpha isolation   |
| ARIA attributes       | v1.0    | Accessibility           |
| Markdown documentation| v3.0    | This file!              |

---

*MatterLab CHANGELOG | Last Updated: v3.0 | 2026-09-28*

---

## CHANGE 4.2 - Full 7-Page Platform Completed (2026-09-29)

**DATE:** 2026-09-29 12:30 IST
**FILES:** index.html, learn.html, experiments.html, quiz.html, dashboard.html, about.html, css/pages.css, js/shared-nav.js
**WHY:** User request: 'es poore projects ko mujhe multipage banana hai' + 'pura kr do'

PAGES BUILT:
- index.html - Hero landing page with animated particle canvas, stats bar, 6 feature cards, CTA
- learn.html - 11 NCERT-aligned topic cards (Class 6-10) with class filter chips, glossary (12 terms)
- experiments.html - 10 full step-by-step virtual experiments with procedures, observation tables
- quiz.html - Interactive MCQ quiz with 40+ questions, instant feedback, animated score ring, 6 topic modes
- dashboard.html - Student progress with 4 stat cards, topic bars, 8 achievement badges (localStorage)
- about.html - Project info, curriculum mapping table, teacher guide, full NCERT disclaimer

NEW FILES:
- css/pages.css - 350+ lines of page-specific styles
- js/shared-nav.js - Theme persistence, mobile hamburger, MLProgress localStorage helpers

QA RESULTS:
- All 7 pages: have correct file sizes (8KB to 31KB)
- All 7 pages: all 7 nav links present in every page
- All 7 pages: style.css + pages.css + shared-nav.js loaded correctly

LESSONS LEARNED:
- localStorage API: browser me data save karo without server
- CSS Custom Properties (var(--)) for consistent design tokens
- Accordion UI: click se expand/collapse (classList.toggle)
- SVG stroke-dashoffset animation for score ring
- Object.values() + concat() for combining quiz pools

