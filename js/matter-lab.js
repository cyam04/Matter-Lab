/* ═══════════════════════════════════════════════════════════════
   MatterLab – matter-lab.js
   2D Canvas Particle Physics Engine (50 Substances)

   VERSION HISTORY:
   ──────────────────────────────────────────────────────
   v1.0 (2026-09-28 03:41 IST)
     - Initial build
     - 3 substances: water, iron, camphor
     - Small particles: solid=6px, liquid=5.5px, gas=4px
     - Basic flat circle particles
     - No trails
     - Static dark background

   v2.0 (2026-09-28 04:03 IST)
     - MAJOR: 3 → 50 substances (15 solid, 15 liquid, 20 gas)
     - Particle sizes increased: solid=9.5, liquid=7.5, gas=5.5
     - 3D sphere rendering (glow + gradient + specular highlight)
     - Gas particle trails (last 6 positions stored)
     - Temperature-tinted canvas background
     - Hexagonal solid particle packing
     - SUBSTANCES catalog exposed for main.js UI generation

   v3.0 (2026-09-28 04:22 IST)
     - Documentation comments added throughout
     - Version history header added (this section)
     - Inline change comments added at key points
   ──────────────────────────────────────────────────────
   See: CHANGELOG.md for full change details
   See: docs/FILE_GUIDE.md for architecture overview
   ═══════════════════════════════════════════════════════════════ */

/* =========================================
   MatterLab v2.0 – matter-lab.js
   50-Substance Particle Physics Engine
   Bigger particles, trails, vibrant visuals
   ========================================= */

'use strict';

const MatterLab = (() => {
  let canvas, ctx, W = 0, H = 0, animId = null, lastTime = 0;

  /* ════════════════════════════════════════
     50-SUBSTANCE CATALOG
     15 Solids | 15 Liquids | 20 Gases
  ════════════════════════════════════════ */
  const SUBSTANCES = {
    // ══════ SOLIDS (15) ══════
    iron:        { nameHi:'Loha',       nameEn:'Iron',              formula:'Fe',          emoji:'⚙️',  cs:'#94a3b8', cl:'#f97316', cg:'#fbbf24', melt:90,   boil:170, sp:null,      cat:'solid'  },
    camphor:     { nameHi:'Kapoor',     nameEn:'Camphor',           formula:'C₁₀H₁₆O',    emoji:'🏔️', cs:'#e9d5ff', cl:'#a78bfa', cg:'#ddd6fe', melt:null, boil:50,  sp:'sublime', cat:'solid'  },
    wax:         { nameHi:'Mombatti',   nameEn:'Candle Wax',        formula:'C₂₅H₅₂',     emoji:'🕯️', cs:'#fef9c3', cl:'#fde68a', cg:'#fbbf24', melt:55,   boil:150, sp:null,      cat:'solid'  },
    sulfur:      { nameHi:'Gandhak',    nameEn:'Sulfur',            formula:'S₈',          emoji:'🟡', cs:'#fde047', cl:'#eab308', cg:'#fcd34d', melt:75,   boil:160, sp:null,      cat:'solid'  },
    iodine:      { nameHi:'Ayodeen',    nameEn:'Iodine',            formula:'I₂',          emoji:'💜', cs:'#7c3aed', cl:'#8b5cf6', cg:'#c4b5fd', melt:null, boil:60,  sp:'sublime', cat:'solid'  },
    salt_solid:  { nameHi:'Namak',      nameEn:'Salt (NaCl)',       formula:'NaCl',        emoji:'🧂', cs:'#f8fafc', cl:'#e2e8f0', cg:'#cbd5e1', melt:110,  boil:185, sp:null,      cat:'solid'  },
    gold:        { nameHi:'Sona',       nameEn:'Gold',              formula:'Au',          emoji:'🥇', cs:'#fbbf24', cl:'#f59e0b', cg:'#d97706', melt:120,  boil:190, sp:null,      cat:'solid'  },
    copper:      { nameHi:'Taamba',     nameEn:'Copper',            formula:'Cu',          emoji:'🪙', cs:'#f97316', cl:'#ef4444', cg:'#fca5a5', melt:115,  boil:185, sp:null,      cat:'solid'  },
    naphthalene: { nameHi:'Naftalin',   nameEn:'Naphthalene',       formula:'C₁₀H₈',      emoji:'⚪', cs:'#e2e8f0', cl:'#cbd5e1', cg:'#94a3b8', melt:null, boil:80,  sp:'sublime', cat:'solid'  },
    dryice:      { nameHi:'Dry Ice',    nameEn:'Dry Ice',           formula:'CO₂(s)',      emoji:'❄️', cs:'#bfdbfe', cl:'#93c5fd', cg:'#dbeafe', melt:null, boil:-30, sp:'sublime', cat:'solid'  },
    aluminum:    { nameHi:'Aluminium',  nameEn:'Aluminum',          formula:'Al',          emoji:'🔩', cs:'#d1d5db', cl:'#9ca3af', cg:'#6b7280', melt:125,  boil:195, sp:null,      cat:'solid'  },
    sugar:       { nameHi:'Cheeni',     nameEn:'Sugar',             formula:'C₁₂H₂₂O₁₁', emoji:'🍬', cs:'#fcd34d', cl:'#b45309', cg:'#92400e', melt:95,   boil:170, sp:null,      cat:'solid'  },
    phosphorus:  { nameHi:'Phosphoras', nameEn:'Phosphorus',        formula:'P₄',          emoji:'🔴', cs:'#ef4444', cl:'#dc2626', cg:'#fca5a5', melt:44,   boil:130, sp:null,      cat:'solid'  },
    chalk:       { nameHi:'Khadiyan',   nameEn:'Chalk',             formula:'CaCO₃',       emoji:'📝', cs:'#f1f5f9', cl:'#e2e8f0', cg:'#cbd5e1', melt:190,  boil:199, sp:null,      cat:'solid'  },
    silicon:     { nameHi:'Silicon',    nameEn:'Silicon',           formula:'Si',          emoji:'💎', cs:'#334155', cl:'#475569', cg:'#94a3b8', melt:185,  boil:199, sp:null,      cat:'solid'  },

    // ══════ LIQUIDS (15) ══════
    water:       { nameHi:'Paani',       nameEn:'Water',             formula:'H₂O',         emoji:'💧', cs:'#bfdbfe', cl:'#38bdf8', cg:'#7dd3fc', melt:0,    boil:100, sp:null,      cat:'liquid' },
    ethanol:     { nameHi:'Sharab',      nameEn:'Ethanol',           formula:'C₂H₅OH',      emoji:'🍾', cs:'#e0f2fe', cl:'#a5f3fc', cg:'#cffafe', melt:-30,  boil:78,  sp:null,      cat:'liquid' },
    mercury:     { nameHi:'Paara',       nameEn:'Mercury',           formula:'Hg',           emoji:'🌡️',cs:'#cbd5e1', cl:'#e2e8f0', cg:'#f1f5f9', melt:-20,  boil:170, sp:null,      cat:'liquid' },
    glycerol:    { nameHi:'Glisrin',     nameEn:'Glycerol',          formula:'C₃H₈O₃',      emoji:'🫙', cs:'#f0fdf4', cl:'#bbf7d0', cg:'#86efac', melt:-20,  boil:180, sp:null,      cat:'liquid' },
    acetone:     { nameHi:'Aseton',      nameEn:'Acetone',           formula:'CH₃COCH₃',    emoji:'🧴', cs:'#f3e8ff', cl:'#e9d5ff', cg:'#ddd6fe', melt:-40,  boil:56,  sp:null,      cat:'liquid' },
    oliveoil:    { nameHi:'Zaitoon Tel', nameEn:'Olive Oil',         formula:'Lipids',       emoji:'🫒', cs:'#d9f99d', cl:'#84cc16', cg:'#a3e635', melt:-5,   boil:180, sp:null,      cat:'liquid' },
    honey:       { nameHi:'Shahad',      nameEn:'Honey',             formula:'Fructose+',    emoji:'🍯', cs:'#fef3c7', cl:'#d97706', cg:'#fbbf24', melt:-20,  boil:160, sp:null,      cat:'liquid' },
    petrol:      { nameHi:'Petrol',      nameEn:'Petrol',            formula:'C₈H₁₈',       emoji:'⛽', cs:'#fef9c3', cl:'#f59e0b', cg:'#fbbf24', melt:-40,  boil:90,  sp:null,      cat:'liquid' },
    hcl_aq:      { nameHi:'HCl (aq)',    nameEn:'Hydrochloric Acid', formula:'HCl(aq)',      emoji:'⚗️', cs:'#fefce8', cl:'#fde68a', cg:'#fde047', melt:-30,  boil:80,  sp:null,      cat:'liquid' },
    h2so4:       { nameHi:'Tejab',       nameEn:'Sulfuric Acid',     formula:'H₂SO₄',       emoji:'🧪', cs:'#fef3c7', cl:'#fbbf24', cg:'#f59e0b', melt:-20,  boil:190, sp:null,      cat:'liquid' },
    aceticacid:  { nameHi:'Sirka',       nameEn:'Acetic Acid',       formula:'CH₃COOH',     emoji:'🍶', cs:'#f0fdf4', cl:'#6ee7b7', cg:'#a7f3d0', melt:17,   boil:118, sp:null,      cat:'liquid' },
    h2o2:        { nameHi:'H₂O₂',        nameEn:'Hydrogen Peroxide', formula:'H₂O₂',        emoji:'🫧', cs:'#e0f2fe', cl:'#7dd3fc', cg:'#bae6fd', melt:-10,  boil:150, sp:null,      cat:'liquid' },
    seawater:    { nameHi:'Samudra Jal', nameEn:'Seawater',          formula:'NaCl+H₂O',    emoji:'🌊', cs:'#bfdbfe', cl:'#0ea5e9', cg:'#38bdf8', melt:-2,   boil:103, sp:null,      cat:'liquid' },
    milk:        { nameHi:'Doodh',       nameEn:'Milk (Colloid)',     formula:'Colloid',      emoji:'🥛', cs:'#f0f9ff', cl:'#e0f2fe', cg:'#bae6fd', melt:-5,   boil:100, sp:null,      cat:'liquid' },

    // ══════ GASES (20) ══════
    oxygen:      { nameHi:'Oxygen',      nameEn:'Oxygen',            formula:'O₂',          emoji:'🫁', cs:'#bfdbfe', cl:'#93c5fd', cg:'#60a5fa', melt:-50,  boil:-20, sp:null,      cat:'gas'    },
    nitrogen:    { nameHi:'Nitrogen',    nameEn:'Nitrogen',          formula:'N₂',          emoji:'💨', cs:'#dbeafe', cl:'#bfdbfe', cg:'#93c5fd', melt:-50,  boil:-25, sp:null,      cat:'gas'    },
    co2_gas:     { nameHi:'CO₂ Gas',    nameEn:'Carbon Dioxide',    formula:'CO₂',         emoji:'🌿', cs:'#e2e8f0', cl:'#cbd5e1', cg:'#94a3b8', melt:-50,  boil:-15, sp:null,      cat:'gas'    },
    hydrogen:    { nameHi:'Hydrogen',   nameEn:'Hydrogen',          formula:'H₂',          emoji:'🔵', cs:'#eff6ff', cl:'#dbeafe', cg:'#bfdbfe', melt:-50,  boil:-35, sp:null,      cat:'gas'    },
    helium:      { nameHi:'Helium',     nameEn:'Helium',            formula:'He',          emoji:'🎈', cs:'#fef9c3', cl:'#fef08a', cg:'#fde047', melt:-50,  boil:-40, sp:null,      cat:'gas'    },
    argon:       { nameHi:'Argon',      nameEn:'Argon',             formula:'Ar',          emoji:'⚡', cs:'#ccfbf1', cl:'#99f6e4', cg:'#5eead4', melt:-50,  boil:-30, sp:null,      cat:'gas'    },
    methane:     { nameHi:'Methane',    nameEn:'Methane',           formula:'CH₄',         emoji:'🔥', cs:'#ffedd5', cl:'#fed7aa', cg:'#fdba74', melt:-50,  boil:-25, sp:null,      cat:'gas'    },
    ammonia:     { nameHi:'Ammonia',    nameEn:'Ammonia',           formula:'NH₃',         emoji:'🟡', cs:'#fef9c3', cl:'#fef08a', cg:'#bef264', melt:-50,  boil:-10, sp:null,      cat:'gas'    },
    chlorine:    { nameHi:'Chlorine',   nameEn:'Chlorine',          formula:'Cl₂',         emoji:'🟢', cs:'#d9f99d', cl:'#a3e635', cg:'#84cc16', melt:-50,  boil:-5,  sp:null,      cat:'gas'    },
    neon:        { nameHi:'Neon',       nameEn:'Neon',              formula:'Ne',          emoji:'💡', cs:'#fecdd3', cl:'#fda4af', cg:'#f43f5e', melt:-50,  boil:-40, sp:null,      cat:'gas'    },
    so2:         { nameHi:'SO₂ Gas',   nameEn:'Sulfur Dioxide',    formula:'SO₂',         emoji:'🏭', cs:'#fef9c3', cl:'#fde047', cg:'#ca8a04', melt:-50,  boil:-5,  sp:null,      cat:'gas'    },
    ozone:       { nameHi:'Ozone',      nameEn:'Ozone',             formula:'O₃',          emoji:'🌍', cs:'#ede9fe', cl:'#c4b5fd', cg:'#8b5cf6', melt:-50,  boil:-30, sp:null,      cat:'gas'    },
    propane:     { nameHi:'LPG / Propane',nameEn:'Propane/LPG',    formula:'C₃H₈',        emoji:'🫙', cs:'#fff7ed', cl:'#fed7aa', cg:'#fb923c', melt:-50,  boil:0,   sp:null,      cat:'gas'    },
    h2s:         { nameHi:'H₂S Gas',   nameEn:'Hydrogen Sulfide',  formula:'H₂S',         emoji:'🥚', cs:'#fefce8', cl:'#fef08a', cg:'#bef264', melt:-50,  boil:-15, sp:null,      cat:'gas'    },
    xenon:       { nameHi:'Xenon',      nameEn:'Xenon',             formula:'Xe',          emoji:'✨', cs:'#e0f2fe', cl:'#7dd3fc', cg:'#38bdf8', melt:-50,  boil:-30, sp:null,      cat:'gas'    },
    fluorine:    { nameHi:'Fluorine',   nameEn:'Fluorine',          formula:'F₂',          emoji:'⚠️', cs:'#fef9c3', cl:'#fde047', cg:'#facc15', melt:-50,  boil:-35, sp:null,      cat:'gas'    },
    no2:         { nameHi:'NO₂ Gas',   nameEn:'Nitrogen Dioxide',  formula:'NO₂',         emoji:'🏗️', cs:'#fef3c7', cl:'#fde68a', cg:'#f59e0b', melt:-50,  boil:5,   sp:null,      cat:'gas'    },
    hf:          { nameHi:'HF Gas',    nameEn:'Hydrogen Fluoride', formula:'HF',          emoji:'🔆', cs:'#dbeafe', cl:'#93c5fd', cg:'#60a5fa', melt:-50,  boil:15,  sp:null,      cat:'gas'    },
    acetylene:   { nameHi:'Acetylene',  nameEn:'Acetylene',         formula:'C₂H₂',        emoji:'🔦', cs:'#fff7ed', cl:'#fed7aa', cg:'#fb923c', melt:-50,  boil:-25, sp:null,      cat:'gas'    },
    krypton:     { nameHi:'Krypton',    nameEn:'Krypton',           formula:'Kr',          emoji:'💫', cs:'#eff6ff', cl:'#dbeafe', cg:'#a5b4fc', melt:-50,  boil:-35, sp:null,      cat:'gas'    },
  };

  /* ────────────────────────────────────────────────────────
     v2.0 CHANGE: Particle size increased for classroom/Smart Board visibility
     WHY: User feedback: "bacho ko nahi dikhega" — small particles on projectors
     OLD (v1.0): const PSIZE = { solid: 6,   liquid: 5.5, gas: 4   };
     NEW (v2.0): const PSIZE = { solid: 9.5, liquid: 7.5, gas: 5.5 }; (+58%)
     See CHANGELOG.md → CHANGE 2.3 for full details
  ──────────────────────────────────────────────────────── */
  const PSIZE = { solid: 9.5, liquid: 7.5, gas: 5.5 }; // v2.0
  const PCOUNT = 88;   // v1.0 WAS: 90 (reduced slightly because particles are bigger)
  const DIFF_COUNT = 44; // particles per side in diffusion tab

  /* ── App state ── */
  let state = {
    activeTab: 1,
    substance: 'water',
    temperature: 25,
    pressure: 0,
    particleState: 'liquid',
    barrierActive: true,
    diffTemp: 25,
    soluteType: 'salt',
    laserOn: false,
    soluteAmount: 40,
  };

  let particles = [], diffParticles = [], perfParticles = [], soluteParticles = [];

  /* ════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════ */
  function getSub() { return SUBSTANCES[state.substance] || SUBSTANCES.water; }

  function getCurrentParticleState() {
    const sub = getSub();
    const t   = state.temperature;
    if (sub.sp === 'sublime') {
      return t >= sub.boil ? 'gas' : 'solid';
    }
    if (t < sub.melt) return 'solid';
    if (t >= sub.boil) return 'gas';
    return 'liquid';
  }

  function getParticleColor(ps) {
    const sub = getSub();
    if (ps === 'solid')  return sub.cs;
    if (ps === 'liquid') return sub.cl;
    return sub.cg;
  }

  function getTargetSpeed() {
    const ps    = getCurrentParticleState();
    const base  = { solid: 0.55, liquid: 2.0, gas: 7.0 }[ps] || 2;
    const tNorm = (state.temperature + 50) / 250;
    const pMult = 1 - state.pressure * 0.008;
    return base * (0.4 + tNorm * 0.9) * pMult;
  }

  function makeParticle(x, y, vx, vy, r, color) {
    return { x, y, vx, vy, r, color, age: Math.random() * 100, trail: [], homeX: undefined, homeY: undefined };
  }

  /* ════════════════════════════════════════
     SPAWN PARTICLES
  ════════════════════════════════════════ */
  function spawnMainParticles() {
    particles = [];
    const ps  = getCurrentParticleState();
    const col = getParticleColor(ps);
    const r   = PSIZE[ps] || 7;
    const n   = PCOUNT;

    if (ps === 'solid') {
      // Hexagonal close packing at bottom
      const cols = Math.ceil(Math.sqrt(n * 1.6));
      const dx = r * 2.4, dy = r * 2.1;
      const totalW = cols * dx;
      const startX = (W - totalW) / 2 + r;
      let i = 0;
      let row = 0;
      while (i < n) {
        const rowCount = Math.min(cols, n - i);
        const offsetX = (row % 2 === 1) ? dx * 0.5 : 0;
        for (let c = 0; c < rowCount; c++) {
          const x = startX + c * dx + offsetX;
          const y = H - r * 1.5 - row * dy;
          if (y < r * 2) break;
          const ang = Math.random() * Math.PI * 2;
          const spd = 0.4;
          particles.push(makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, r, col));
          i++;
        }
        row++;
      }
    } else if (ps === 'liquid') {
      for (let i = 0; i < n; i++) {
        const x = r + Math.random() * (W - r * 2);
        const y = H * 0.30 + Math.random() * (H * 0.62);
        const ang = Math.random() * Math.PI * 2;
        const spd = getTargetSpeed() * (0.6 + Math.random() * 0.8);
        particles.push(makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, r, col));
      }
    } else {
      for (let i = 0; i < n; i++) {
        const x = r + Math.random() * (W - r * 2);
        const y = r + Math.random() * (H - r * 2);
        const ang = Math.random() * Math.PI * 2;
        const spd = getTargetSpeed() * (0.5 + Math.random() * 1.0);
        particles.push(makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, r, col));
      }
    }
  }

  function spawnDiffParticles() {
    diffParticles = [];
    perfParticles = [];
    const midX = W / 2;
    const n = DIFF_COUNT;
    for (let i = 0; i < n; i++) {
      const x = 10 + Math.random() * (midX - 20);
      const y = 10 + Math.random() * (H - 20);
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.8;
      const p = makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, 6.5, '#38bdf8');
      p.type = 'diff';
      diffParticles.push(p);
    }
    for (let i = 0; i < n; i++) {
      const x = midX + 10 + Math.random() * (midX - 20);
      const y = 10 + Math.random() * (H - 20);
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.8;
      const p = makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, 6.5, '#f472b6');
      p.type = 'perf';
      perfParticles.push(p);
    }
  }

  function spawnSoluteParticles() {
    soluteParticles = [];
    const n = state.soluteAmount;

    // 50 water bg molecules
    particles = [];
    for (let i = 0; i < 55; i++) {
      const x = 10 + Math.random() * (W - 20);
      const y = 10 + Math.random() * (H - 20);
      const ang = Math.random() * Math.PI * 2;
      const p = makeParticle(x, y, Math.cos(ang) * 1.2, Math.sin(ang) * 1.2, 5, '#38bdf8');
      p.bgWater = true;
      particles.push(p);
    }

    for (let i = 0; i < n; i++) {
      if (state.soluteType === 'salt') {
        const x = 15 + Math.random() * (W - 30);
        const y = H * 0.1 + Math.random() * (H * 0.8);
        const ang = Math.random() * Math.PI * 2;
        const spd = 0.7 + Math.random() * 0.5;
        const p = makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, 3.5, '#fbbf24');
        p.soluteType = 'salt';
        soluteParticles.push(p);
      } else if (state.soluteType === 'sand') {
        const x = 20 + Math.random() * (W - 40);
        const y = H - 25 - Math.random() * 50;
        const p = makeParticle(x, y, (Math.random() - 0.5) * 0.8, 0, 9 + Math.random() * 4, '#b45309');
        p.soluteType = 'sand';
        p.settled = false;
        soluteParticles.push(p);
      } else {
        // colloid
        const x = 20 + Math.random() * (W - 40);
        const y = H * 0.08 + Math.random() * (H * 0.82);
        const ang = Math.random() * Math.PI * 2;
        const spd = 0.4 + Math.random() * 0.7;
        const p = makeParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, 6.5, '#f0abfc');
        p.soluteType = 'colloid';
        soluteParticles.push(p);
      }
    }
  }

  function resetParticles() {
    if (state.activeTab === 1) spawnMainParticles();
    else if (state.activeTab === 2) spawnDiffParticles();
    else spawnSoluteParticles();
  }

  /* ════════════════════════════════════════
     PHYSICS UPDATES
  ════════════════════════════════════════ */
  function updateTab1(dt) {
    const ps       = getCurrentParticleState();
    const targetSpd = getTargetSpeed();
    const col      = getParticleColor(ps);
    const newR     = PSIZE[ps] || 7;

    if (ps !== state.particleState) {
      state.particleState = ps;
      particles.forEach(p => { p.color = col; p.r = newR; p.homeX = undefined; p.homeY = undefined; });
      if (ps === 'gas') {
        particles.forEach(p => {
          const ang = Math.random() * Math.PI * 2;
          p.vx = Math.cos(ang) * targetSpd * (0.5 + Math.random());
          p.vy = Math.sin(ang) * targetSpd * (0.5 + Math.random());
        });
      }
      MatterLab.onStateChange && MatterLab.onStateChange(ps);
    }

    const compTop    = H * (state.pressure / 100) * 0.42;
    const compBottom = H - 10;

    particles.forEach(p => {
      // Trail update
      if (ps === 'gas') {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();
      } else {
        p.trail = [];
      }

      // Speed smoothing
      const curSpd = Math.hypot(p.vx, p.vy);
      if (curSpd > 0.01) {
        const ratio = 1 + (targetSpd - curSpd) * 0.045 * dt;
        p.vx *= ratio;
        p.vy *= ratio;
      } else {
        const ang = Math.random() * Math.PI * 2;
        p.vx = Math.cos(ang) * targetSpd * 0.35;
        p.vy = Math.sin(ang) * targetSpd * 0.35;
      }

      // Gravity
      if (ps === 'solid')  p.vy += 0.08 * dt;
      else if (ps === 'liquid') p.vy += 0.04 * dt;

      // Solid: home spring
      if (ps === 'solid') {
        if (p.homeX !== undefined) {
          p.vx += (p.homeX - p.x) * 0.07 * dt;
          p.vy += (p.homeY - p.y) * 0.07 * dt;
        } else {
          p.homeX = p.x;
          p.homeY = p.y;
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.age += dt;

      // Boundary bounce
      const pad = p.r + 2;
      if (p.x < pad)    { p.x = pad;    p.vx = Math.abs(p.vx) * 0.9; }
      if (p.x > W - pad){ p.x = W - pad; p.vx = -Math.abs(p.vx) * 0.9; }
      if (p.y < compTop + pad) { p.y = compTop + pad; p.vy = Math.abs(p.vy) * 0.85; }
      if (p.y > compBottom - p.r) { p.y = compBottom - p.r; p.vy = -Math.abs(p.vy) * 0.82; }

      // Speed clamp
      const maxSpd = targetSpd * 3.5;
      const spd = Math.hypot(p.vx, p.vy);
      if (spd > maxSpd) { p.vx = (p.vx / spd) * maxSpd; p.vy = (p.vy / spd) * maxSpd; }
    });
  }

  function updateTab2(dt) {
    const spdMult = 0.6 + (state.diffTemp / 100) * 2.8;
    const midX = W / 2;

    const all = [...diffParticles, ...perfParticles];
    all.forEach(p => {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();

      p.x += p.vx * spdMult * dt;
      p.y += p.vy * spdMult * dt;
      p.age += dt;

      const pad = p.r + 2;
      if (p.x < pad)    { p.x = pad;    p.vx = Math.abs(p.vx); }
      if (p.x > W - pad){ p.x = W - pad; p.vx = -Math.abs(p.vx); }
      if (p.y < pad)    { p.y = pad;    p.vy = Math.abs(p.vy); }
      if (p.y > H - pad){ p.y = H - pad; p.vy = -Math.abs(p.vy); }

      if (state.barrierActive) {
        if (p.type === 'diff' && p.x + p.r > midX) { p.x = midX - p.r; p.vx = -Math.abs(p.vx); }
        if (p.type === 'perf' && p.x - p.r < midX) { p.x = midX + p.r; p.vx =  Math.abs(p.vx); }
      }
    });
  }

  function updateTab3(dt) {
    particles.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      const pad = p.r + 2;
      if (p.x < pad)    { p.x = pad;    p.vx = Math.abs(p.vx); }
      if (p.x > W - pad){ p.x = W - pad; p.vx = -Math.abs(p.vx); }
      if (p.y < pad)    { p.y = pad;    p.vy = Math.abs(p.vy); }
      if (p.y > H - pad){ p.y = H - pad; p.vy = -Math.abs(p.vy); }
    });

    soluteParticles.forEach(p => {
      if (p.soluteType === 'sand') {
        if (!p.settled) p.vy += 0.22 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y + p.r >= H - 18) {
          p.y = H - 18 - p.r;
          p.vy = 0; p.vx *= 0.80;
          if (Math.abs(p.vx) < 0.08) { p.vx = 0; p.settled = true; }
        }
        if (p.x < p.r + 2)     { p.x = p.r + 2;     p.vx = Math.abs(p.vx); }
        if (p.x > W - p.r - 2) { p.x = W - p.r - 2; p.vx = -Math.abs(p.vx); }
      } else if (p.soluteType === 'colloid') {
        p.vx += (Math.random() - 0.5) * 0.35;
        p.vy += (Math.random() - 0.5) * 0.35;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.4) { p.vx = (p.vx / spd) * 1.4; p.vy = (p.vy / spd) * 1.4; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        const pad = p.r + 2;
        if (p.x < pad)    { p.x = pad;    p.vx = Math.abs(p.vx); }
        if (p.x > W - pad){ p.x = W - pad; p.vx = -Math.abs(p.vx); }
        if (p.y < pad)    { p.y = pad;    p.vy = Math.abs(p.vy); }
        if (p.y > H - pad){ p.y = H - pad; p.vy = -Math.abs(p.vy); }
      } else {
        // salt dissolved
        p.vx += (Math.random() - 0.5) * 0.12;
        p.vy += (Math.random() - 0.5) * 0.12;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.2) { p.vx = (p.vx / spd) * 1.2; p.vy = (p.vy / spd) * 1.2; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 2)     p.x = 2;
        if (p.x > W - 2) p.x = W - 2;
        if (p.y < 2)     p.y = 2;
        if (p.y > H - 2) p.y = H - 2;
      }
    });
  }

  /* ════════════════════════════════════════
     DRAW HELPERS
  ════════════════════════════════════════ */
  function getTemperatureBgColor() {
    const t = state.temperature;
    const isDark = !document.body.classList.contains('light-mode');
    if (!isDark) return null; // light mode uses its own bg

    if (t <= 0) {
      // Cold: deep blue
      const f = (t + 50) / 50; // 0 at -50, 1 at 0
      return `hsl(${215 + f * 8}, ${55 - f * 15}%, ${5 + f * 3}%)`;
    } else if (t <= 100) {
      const f = t / 100;
      return `hsl(${220 - f * 35}, ${40 - f * 10}%, ${6 + f * 4}%)`;
    } else {
      const f = (t - 100) / 100;
      return `hsl(${185 - f * 160}, ${30 + f * 30}%, ${10 + f * 8}%)`;
    }
  }

  function drawBackground(tab) {
    const isDark = !document.body.classList.contains('light-mode');
    let bgColor = isDark ? '#0a0f1e' : '#dbeafe';

    if (tab === 1) {
      const c = getTemperatureBgColor();
      if (c) bgColor = c;
    } else if (tab === 2) {
      bgColor = isDark ? '#080f1c' : '#e0f2fe';
    } else {
      bgColor = isDark ? '#060e22' : '#e0f2fe';
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)';
    const step = 30;
    for (let gx = step; gx < W; gx += step) {
      for (let gy = step; gy < H; gy += step) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawParticle(p, forceColor) {
    const color = forceColor || p.color;
    ctx.save();

    // Trail (gas particles)
    if (p.trail && p.trail.length > 1) {
      p.trail.forEach((pt, i) => {
        ctx.globalAlpha = (i / p.trail.length) * 0.18;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Outer glow
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Core with gradient
    const coreGrd = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r);
    coreGrd.addColorStop(0, lightenColor(color, 40));
    coreGrd.addColorStop(0.6, color);
    coreGrd.addColorStop(1, darkenColor(color, 30));
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = coreGrd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(p.x - p.r * 0.32, p.y - p.r * 0.32, p.r * 0.34, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function lightenColor(hex, amt) {
    try {
      const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amt);
      const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amt);
      const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amt);
      return `rgb(${r},${g},${b})`;
    } catch(e) { return hex; }
  }

  function darkenColor(hex, amt) {
    try {
      const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amt);
      const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amt);
      const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amt);
      return `rgb(${r},${g},${b})`;
    } catch(e) { return hex; }
  }

  function drawSolidBonds() {
    const ps = getCurrentParticleState();
    if (ps !== 'solid') return;
    const col = getParticleColor('solid');
    ctx.save();
    const maxDist = PSIZE.solid * 3.2;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.55;
          ctx.globalAlpha = alpha;
          const g = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          g.addColorStop(0, col);
          g.addColorStop(0.5, lightenColor(col, 60));
          g.addColorStop(1, col);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function drawBurner() {
    const t = state.temperature;
    if (t <= 10) return;
    const intensity = Math.min((t - 10) / 190, 1);
    const numF = Math.floor(3 + intensity * 5);
    const ts   = Date.now() / 1000;

    ctx.save();
    for (let i = 0; i < numF; i++) {
      const fx = (W / (numF + 1)) * (i + 1);
      const fh = 22 + intensity * 42 + Math.sin(ts * 4.2 + i * 1.5) * 9;
      const fw = fh * 0.45;
      const flameGrd = ctx.createRadialGradient(fx, H, 2, fx, H - fh * 0.6, fh * 0.7);
      flameGrd.addColorStop(0, `rgba(255,255,100,${0.8 * intensity})`);
      flameGrd.addColorStop(0.35, `rgba(251,146,60,${0.65 * intensity})`);
      flameGrd.addColorStop(0.7, `rgba(220,38,38,${0.35 * intensity})`);
      flameGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrd;
      ctx.beginPath();
      ctx.ellipse(fx, H - fh * 0.4, fw, fh * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Floor glow
    const floorGrd = ctx.createLinearGradient(0, H - 8, 0, H);
    floorGrd.addColorStop(0, `rgba(251,146,60,${0.4 * intensity})`);
    floorGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = floorGrd;
    ctx.fillRect(0, H - 8, W, 8);
    ctx.restore();
  }

  function drawCooling() {
    const t = state.temperature;
    if (t >= 0) return;
    const intensity = Math.min(Math.abs(t) / 50, 1);
    ctx.save();
    const grd = ctx.createLinearGradient(0, 0, 0, H * 0.25);
    grd.addColorStop(0, `rgba(147,197,253,${0.28 * intensity})`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H * 0.25);

    const floorGrd = ctx.createLinearGradient(0, H - 14, 0, H);
    floorGrd.addColorStop(0, `rgba(34,211,238,${0.5 * intensity})`);
    floorGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = floorGrd;
    ctx.fillRect(0, H - 14, W, 14);

    // Ice crystals along bottom
    ctx.strokeStyle = `rgba(147,197,253,${0.45 * intensity})`;
    ctx.lineWidth = 1.2;
    const ts = Date.now() / 3000;
    for (let cx = 18; cx < W; cx += 32) {
      for (let arm = 0; arm < 6; arm++) {
        const angle = (arm / 6) * Math.PI * 2 + ts;
        const len = 9 + intensity * 6;
        ctx.save();
        ctx.translate(cx, H - 7);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawPiston() {
    if (state.pressure <= 0) return;
    const pistonH = H * (state.pressure / 100) * 0.44;
    ctx.save();
    const grd = ctx.createLinearGradient(0, 0, 0, pistonH);
    grd.addColorStop(0, 'rgba(167,139,250,0.28)');
    grd.addColorStop(1, 'rgba(167,139,250,0.04)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, pistonH);
    // Piston plate
    const plateGrd = ctx.createLinearGradient(0, pistonH - 7, 0, pistonH);
    plateGrd.addColorStop(0, 'rgba(196,181,253,0.9)');
    plateGrd.addColorStop(1, 'rgba(139,92,246,0.9)');
    ctx.fillStyle = plateGrd;
    ctx.fillRect(0, pistonH - 7, W, 7);
    // Bolts
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let bx = 22; bx < W; bx += 38) {
      ctx.beginPath();
      ctx.arc(bx, pistonH - 3.5, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ════════════════════════════════════════
     TAB DRAW ROUTINES
  ════════════════════════════════════════ */
  function drawTab1() {
    drawBackground(1);
    drawCooling();
    drawBurner();
    drawPiston();
    drawSolidBonds();
    particles.forEach(p => drawParticle(p));
  }

  function drawTab2() {
    drawBackground(2);

    const isDark = !document.body.classList.contains('light-mode');
    ctx.save();
    ctx.fillStyle = isDark ? 'rgba(56,189,248,0.05)' : 'rgba(56,189,248,0.08)';
    ctx.fillRect(0, 0, W / 2, H);
    ctx.fillStyle = isDark ? 'rgba(244,114,182,0.05)' : 'rgba(244,114,182,0.08)';
    ctx.fillRect(W / 2, 0, W / 2, H);
    ctx.restore();

    if (state.barrierActive) {
      ctx.save();
      const bx = W / 2;
      // Thick glowing barrier
      const bg = ctx.createLinearGradient(bx - 5, 0, bx + 5, 0);
      bg.addColorStop(0, 'rgba(249,115,22,0.1)');
      bg.addColorStop(0.5, 'rgba(249,115,22,1.0)');
      bg.addColorStop(1, 'rgba(249,115,22,0.1)');
      ctx.fillStyle = bg;
      ctx.fillRect(bx - 5, 0, 10, H);
      // Glow halo
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur  = 18;
      ctx.strokeStyle = 'rgba(249,115,22,0.85)';
      ctx.lineWidth   = 3;
      ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, H); ctx.stroke();
      ctx.restore();
    }

    // Heat flame for diffusion
    if (state.diffTemp > 20) {
      const intensity = (state.diffTemp - 20) / 80;
      const nf = Math.floor(2 + intensity * 5);
      for (let i = 0; i < nf; i++) {
        const fx = (W / (nf + 1)) * (i + 1);
        const fh = 14 + intensity * 28;
        const fg = ctx.createRadialGradient(fx, H, 0, fx, H - fh, fh * 0.6);
        fg.addColorStop(0, `rgba(251,191,36,${0.5 * intensity})`);
        fg.addColorStop(1, 'transparent');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.ellipse(fx, H - fh * 0.45, fh * 0.35, fh * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Labels
    ctx.save();
    ctx.font = 'bold 13px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(56,189,248,0.7)';
    ctx.fillText('GAS', W * 0.25, 26);
    ctx.fillStyle = 'rgba(244,114,182,0.7)';
    ctx.fillText('PERFUME / SMOKE', W * 0.75, 26);
    ctx.restore();

    diffParticles.forEach(p => drawParticle(p, '#38bdf8'));
    perfParticles.forEach(p => drawParticle(p, '#f472b6'));
  }

  function drawTab3() {
    drawBackground(3);

    const isDark = !document.body.classList.contains('light-mode');
    const wGrd = ctx.createLinearGradient(0, 0, 0, H);
    wGrd.addColorStop(0, isDark ? 'rgba(14,30,65,0.96)' : 'rgba(219,234,254,0.92)');
    wGrd.addColorStop(1, isDark ? 'rgba(8,18,45,0.99)' : 'rgba(186,230,253,0.96)');
    ctx.fillStyle = wGrd;
    ctx.fillRect(0, 0, W, H);

    // Tyndall beam
    if (state.laserOn) {
      const beamY = H * 0.44;
      const t = Date.now() / 900;
      if (state.soluteType === 'colloid') {
        // Vivid yellow laser
        const bGrd = ctx.createLinearGradient(0, beamY, W, beamY);
        bGrd.addColorStop(0,   'rgba(251,191,36,0)');
        bGrd.addColorStop(0.05,'rgba(251,191,36,1)');
        bGrd.addColorStop(0.5, `rgba(251,191,36,${0.75 + Math.sin(t) * 0.15})`);
        bGrd.addColorStop(0.95,'rgba(251,191,36,1)');
        bGrd.addColorStop(1,   'rgba(251,191,36,0)');
        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur  = 22;
        ctx.fillStyle = bGrd;
        ctx.fillRect(0, beamY - 5, W, 10);
        ctx.restore();

        // Scatter halos on colloid particles
        soluteParticles.forEach(p => {
          const dist = Math.abs(p.y - beamY);
          if (dist < 35) {
            const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26);
            halo.addColorStop(0, `rgba(251,191,36,${0.4 * (1 - dist / 35)})`);
            halo.addColorStop(1, 'transparent');
            ctx.save();
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        MatterLab.onTyndall && MatterLab.onTyndall('visible');
      } else {
        // Faint invisible beam
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0, beamY - 1, W, 2);
        ctx.restore();
        MatterLab.onTyndall && MatterLab.onTyndall('invisible');
      }
    }

    // Background water molecules (very faint)
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Solute particles
    soluteParticles.forEach(p => {
      if (p.soluteType === 'salt') {
        ctx.save();
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = '#fbbf24';
        const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.8);
        sg.addColorStop(0, '#fde68a');
        sg.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.soluteType === 'sand') {
        ctx.save();
        ctx.globalAlpha = 0.9;
        const sg = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 0.5, p.x, p.y, p.r);
        sg.addColorStop(0, '#d97706');
        sg.addColorStop(1, '#78350f');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(120,53,15,0.6)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      } else {
        // colloid – milky + glow
        ctx.save();
        const cg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        cg.addColorStop(0, 'rgba(240,171,252,0.8)');
        cg.addColorStop(1, 'rgba(240,171,252,0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f0abfc';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (state.soluteType === 'sand') {
      ctx.save();
      const sedGrd = ctx.createLinearGradient(0, H - 22, 0, H);
      sedGrd.addColorStop(0, 'rgba(180,83,9,0.5)');
      sedGrd.addColorStop(1, 'rgba(120,53,15,0.3)');
      ctx.fillStyle = sedGrd;
      ctx.fillRect(0, H - 22, W, 22);
      ctx.restore();
    }
  }

  /* ════════════════════════════════════════
     LIVE DATA
  ════════════════════════════════════════ */
  function getLiveData() {
    const ps    = getCurrentParticleState();
    const tNorm = (state.temperature + 50) / 250;

    const speedMap   = { solid:'Low / Vibrating', liquid:'Medium / Flowing', gas:'Very High / Random' };
    const spaceMap   = { solid:'Negligible', liquid:'Small', gas:'Very Large' };
    const attractMap = { solid:'Very Strong', liquid:'Moderate', gas:'Negligible' };
    const kePct      = {
      solid:  Math.min(10 + tNorm * 30, 40),
      liquid: Math.min(35 + tNorm * 38, 73),
      gas:    Math.min(72 + tNorm * 28, 100),
    };

    const sub = getSub();
    let isLatent = false;
    if (!sub.sp && sub.melt !== null) {
      if (Math.abs(state.temperature - sub.melt) <= 3 || Math.abs(state.temperature - sub.boil) <= 3) {
        isLatent = true;
      }
    }

    let diffPct = 0;
    if (state.activeTab === 2 && !state.barrierActive) {
      const midX = W / 2;
      let crossed = 0;
      diffParticles.forEach(p => { if (p.x > midX) crossed++; });
      perfParticles.forEach(p => { if (p.x < midX) crossed++; });
      const total = diffParticles.length + perfParticles.length;
      diffPct = total > 0 ? Math.round((crossed / total) * 100) : 0;
    }

    return {
      particleState: ps, particleSpeed: speedMap[ps],
      interparticleSpace: spaceMap[ps], attractionForce: attractMap[ps],
      kineticEnergy: Math.round(kePct[ps] || 50),
      isLatent, diffusionPercent: diffPct,
      substance: state.substance,
    };
  }

  /* ════════════════════════════════════════
     MAIN LOOP
  ════════════════════════════════════════ */
  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 16.67, 3.5);
    lastTime = ts;
    ctx.clearRect(0, 0, W, H);

    if      (state.activeTab === 1) { updateTab1(dt); drawTab1(); }
    else if (state.activeTab === 2) { updateTab2(dt); drawTab2(); }
    else                            { updateTab3(dt); drawTab3(); }

    MatterLab.onFrame && MatterLab.onFrame(getLiveData());
    animId = requestAnimationFrame(loop);
  }

  /* ════════════════════════════════════════
     INIT & RESIZE
  ════════════════════════════════════════ */
  function init(canvasEl) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d', { alpha: true });
    resize();
    window.addEventListener('resize', resize);
    return MatterLab;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = Math.floor(rect.width)  || 700;
    H = canvas.height = Math.floor(rect.height) || 420;
    resetParticles();
  }

  /* ════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════ */
  function start() {
    if (animId) cancelAnimationFrame(animId);
    lastTime = performance.now();
    animId   = requestAnimationFrame(loop);
  }

  function stop() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
  }

  function setTab(tab) {
    state.activeTab = tab;
    resetParticles();
  }

  function setSubstance(sub) {
    if (!SUBSTANCES[sub]) return;
    state.substance = sub;
    state.particleState = getCurrentParticleState();
    spawnMainParticles();
  }

  function setTemperature(val) { state.temperature = val; }
  function setPressure(val)    { state.pressure = val; }
  function setDiffTemp(val)    { state.diffTemp = val; }
  function setBarrier(active)  { state.barrierActive = active; }
  function setSoluteType(type) { state.soluteType = type; spawnSoluteParticles(); }
  function setSoluteAmount(n)  { state.soluteAmount = n; spawnSoluteParticles(); }
  function setLaser(on)        { state.laserOn = on; }
  function getState()          { return { ...state }; }

  return {
    init, start, stop,
    setTab, setSubstance, setTemperature, setPressure,
    setDiffTemp, setBarrier, setSoluteType, setSoluteAmount, setLaser,
    getState,
    SUBSTANCES, // exposed for UI generation
    onStateChange: null,
    onFrame:       null,
    onTyndall:     null,
  };
})();

window.MatterLab = MatterLab;
