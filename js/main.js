/* ═══════════════════════════════════════════════════════════════
   MatterLab – main.js
   App State Manager | Language Toggle | UI Generation

   VERSION HISTORY:
   ──────────────────────────────────────────────────────
   v1.0 (2026-09-28 03:41 IST)
     - Initial build
     - App state management (language, tab, substance, temperature)
     - Language toggle: Hinglish ↔ English
     - Fullscreen toggle for classroom/projector
     - Tab switching (States, Diffusion, Solution)
     - Slider event listeners (temperature, pressure, diffusion)
     - AHA box: 3 substances × 3 states = 9 messages
     - Barrier toggle for diffusion tab
     - Laser toggle for Tyndall effect

   v2.0 (2026-09-28 04:03 IST)
     - MAJOR: Static 3-button substance grid → Dynamic 50-card picker
     - buildSubstancePicker() — generates cards from MatterLab.SUBSTANCES
     - Filter tabs: All / Solids / Liquids / Gases
     - Per-card gradient color (from substance's liquid color)
     - Substance count badge (shows how many visible after filter)
     - AHA box: Expanded to cover all 50 substances (2 languages each)
     - updateSubCardNames() — language-aware name updates on toggle
     - Canvas substance name overlay (classroom visibility)
     - Toast notifications on substance select / state change

   v3.0 (2026-09-28 04:22 IST)
     - Documentation comments added throughout
     - Version history header added (this section)
   ──────────────────────────────────────────────────────
   See: CHANGELOG.md for full change details with old/new code
   See: docs/FILE_GUIDE.md for architecture overview
   ═══════════════════════════════════════════════════════════════ */

/* =========================================
   MatterLab v2.0 – main.js
   App State | Language | UI Generation
   Dynamic 50-Substance Picker
   ========================================= */

'use strict';

(function () {

  /* ══════════════════════════════════
     APP STATE
  ══════════════════════════════════ */
  const App = {
    lang: 'hinglish',
    activeTab: 1,
    currentSubstance: 'water',
    temperature: 25,
    pressure: 0,
    diffTemp: 25,
    barrierActive: true,
    soluteType: 'salt',
    laserOn: false,
    lastLiveData: {},
    tyndallState: 'none',
    subFilter: 'all',
  };

  /* ══════════════════════════════════
     LANGUAGE STRINGS
  ══════════════════════════════════ */
  const L = {
    hi: {
      tab1: '🧊 States & Latent Heat', tab2: '💨 Diffusion Race', tab3: '🔬 Solution vs Colloid',
      substanceTitle: '🧪 Padarth Chuniye', controlsTitle: '⚙️ Controls', metersTitle: '📊 Live Readings',
      diffCtrlTitle: '💨 Diffusion Controls', solutionTitle: '🫧 Solution Type', torchTitle: '🔦 Tyndall Test',
      tempSlider: 'Temperature (Tapman)', pressSlider: 'Piston Pressure (Dabaav)', diffTempSlider: 'Temperature – Diffusion Speed',
      meterState: 'Current State', meterSpeed: 'Particle Speed', meterSpace: 'Inter-Particle Space',
      meterAttract: 'Attraction Force', meterKinetic: 'Kinetic Energy', meterDiff: 'Diffusion %',
      btnBarrierOn: '🚧 Barrier Hatao', btnBarrierOff: '🔄 Reset Karen',
      btnAddSolute: '➕ Aur Daalo', btnReset: '↺ Reset',
      barrierOn: '🚧 BARRIER: ON', barrierOff: '✅ BARRIER: HATA DIYA',
      tyndallOn: '🔦 Beam Dikh Rahi Hai! (Colloid!)', tyndallOff_inv: '✅ Beam Dikh Nahi Rahi (True Solution)',
      tyndallOff_laser: '⬛ Laser Band Hai',
      filterAll: 'Sab', filterSolid: '🧊 Thaos', filterLiquid: '💧 Drava', filterGas: '💨 Gas',
      phaseSolid: 'SOLID', phaseLiquid: 'LIQUID', phaseGas: 'GAS',
      salt: 'Namak (Salt)', sand: 'Baalu (Sand)', colloid: 'Doodh / Fog (Colloid)',
      ahaTitle: 'Bacho ka Doubt', ahaSub: '(Aha! Concept Box)',
      langToastHi: '🇮🇳 Hinglish Mode On!', langToastEn: '🇬🇧 English Mode On!',
    },
    en: {
      tab1: '🧊 States & Latent Heat', tab2: '💨 Diffusion Race', tab3: '🔬 Solution vs Colloid',
      substanceTitle: '🧪 Select Substance', controlsTitle: '⚙️ Controls', metersTitle: '📊 Live Readings',
      diffCtrlTitle: '💨 Diffusion Controls', solutionTitle: '🫧 Solution Type', torchTitle: '🔦 Tyndall Test',
      tempSlider: 'Temperature', pressSlider: 'Piston Pressure', diffTempSlider: 'Temperature – Diffusion Speed',
      meterState: 'Current State', meterSpeed: 'Particle Speed', meterSpace: 'Inter-Particle Space',
      meterAttract: 'Attraction Force', meterKinetic: 'Kinetic Energy', meterDiff: 'Diffusion %',
      btnBarrierOn: '🚧 Remove Barrier', btnBarrierOff: '🔄 Reset Chamber',
      btnAddSolute: '➕ Add More', btnReset: '↺ Reset',
      barrierOn: '🚧 BARRIER: ON', barrierOff: '✅ BARRIER: REMOVED',
      tyndallOn: '🔦 Beam Visible! (Colloid!)', tyndallOff_inv: '✅ Beam Invisible (True Solution)',
      tyndallOff_laser: '⬛ Laser Off',
      filterAll: 'All', filterSolid: '🧊 Solids', filterLiquid: '💧 Liquids', filterGas: '💨 Gases',
      phaseSolid: 'SOLID', phaseLiquid: 'LIQUID', phaseGas: 'GAS',
      salt: 'Salt (Dissolved)', sand: 'Sand (Suspension)', colloid: 'Milk / Fog (Colloid)',
      ahaTitle: 'Aha! Concept Box', ahaSub: '(Live Explanation)',
      langToastHi: '🇮🇳 Hinglish Mode On!', langToastEn: '🇬🇧 English Mode On!',
    },
  };
  const t = k => (L[App.lang === 'hinglish' ? 'hi' : 'en'][k]) || k;

  /* ══════════════════════════════════
     AHA BOX MESSAGES
  ══════════════════════════════════ */
  const AHA = {
    hi: {
      solid_water:     '❄️ Paani abhi <em>Barf (Ice)</em> hai! Particles <strong>ek jaga vibrate karte hain</strong> aur bohot close hain. Shape fixed hoti hai kyunki attraction force bahut strong hai!',
      liquid_water:    '💧 Paani <em>Liquid</em> state mein hai. Particles freely move karte hain par close rehte hain. Volume fix, shape container jaisi.',
      gas_water:       '♨️ Paani <em>Bhap (Steam)</em> ban gaya! Particles <strong>tezi se udte hain</strong>. Attraction negligible – gas poore chamber mein fail jaata hai.',
      solid_iron:      '⚙️ <em>Loha (Iron)</em> bohot strong metal hai. Particles closely packed aur tightly bonded hain. Bahut high temperature chahiye isko pighalane ke liye!',
      liquid_iron:     '🔥 <em>Molten Iron</em>! Yeh wahi state hai jisme casting aur molding ki jaati hai. Bohot hot hai!',
      gas_iron:        '🌋 Iron Vapour! Extreme temperatures par hi hota hai – industrial furnaces mein.',
      solid_camphor:   '🏔️ <em>Kapoor (Camphor)</em> Solid hai. Dhyan do – yeh seedha Gas ban jaayega, Liquid nahi! Ise <strong>Sublimation</strong> kehte hain!',
      gas_camphor:     '✨ <strong>Sublimation!</strong> Kapoor solid se seedha gas ban gaya – beech mein koi liquid nahi! Isiliye kapoor balls shrink hoti hain aur gayab ho jaati hain.',
      solid_wax:       '🕯️ Mombatti (Wax) ek solid hai. Garm karo toh pighal jaayegi – yahi wajah hai ki jalti mombatti pehle liquid banti hai!',
      liquid_wax:      '🕯️ Pigha hua <em>Wax</em>! Yahi liquid wax hai jo candle mein flow karta hai. Thanda karo toh fir solid ban jaayega.',
      solid_sulfur:    '🟡 <em>Gandhak (Sulfur)</em> – ek bright yellow solid. Factories mein use hota hai. Garm karo aur orange liquid dekho!',
      liquid_sulfur:   '🟡 Pigha hua Gandhak! Notice karo rang change ho raha hai – temperature ke saath sulfur ka color bhi badalta hai.',
      solid_iodine:    '💜 <em>Ayodeen (Iodine)</em> ek dark purple solid hai. Aur interesting baat – yeh bhi <strong>Sublime</strong> karta hai Camphor ki tarah!',
      gas_iodine:      '💜 Iodine ka purple vapour! Yeh seedha solid se gas ban gaya – Sublimation! Lab mein iodine crystals ko garam karo toh aisa hi dikhta hai.',
      solid_gold:      '🥇 <em>Sona (Gold)</em> – ek noble metal. Particles tight lattice mein hain. Bahut high temp chahiye pighalane ke liye! Jewelry aur electronics mein use hota hai.',
      liquid_gold:     '🥇 Pigla hua Sona! Liquid gold, jewelry making mein aise hi molds mein daala jaata hai.',
      solid_copper:    '🪙 <em>Taamba (Copper)</em> – electric wires aur coins mein use hota hai. Solid state mein electrons freely move karte hain – isliye yeh conductor hai!',
      solid_naphthalene: '⚪ <em>Naftalin (Naphthalene)</em> – mothballs mein use hota hai! Camphor ki tarah yeh bhi Sublime karta hai. Isiliye mothballs dhire-dhire chhote ho jaate hain!',
      gas_naphthalene: '⚪ Naftalin ka gas! Yahi vapour insects ko dur rakhta hai. Solid se seedha gas – <strong>Sublimation</strong>!',
      solid_dryice:    '❄️ <em>Dry Ice</em> – CO₂ ka frozen solid form! Yeh -30°C se neeche bhi sublime karta hai. Isko touch karne par burns hote hain – bahut cold!',
      gas_dryice:      '❄️ Dry Ice ka <strong>CO₂ gas</strong>! Yeh seedha solid se gas ban gaya – isiliye dry ice se smoke nikalta hai, water nahi. Real sublimation!',
      solid_sugar:     '🍬 <em>Cheeni (Sugar)</em> – ek sweet solid. Garam karo toh pehle melt hoga, phir brown ho jaayega (caramelization!).',
      liquid_sugar:    '🍬 <em>Pighi Cheeni</em> – yahi caramel hai! Chocolate, toffee, candy – sab isi liquid sugar se bante hain.',
      solid_phosphorus:'🔴 <em>Phosphorus</em> – ek reactive solid. Match sticks mein use hota hai! Bahut careful – easily ignite ho jaata hai.',
      solid_aluminum:  '🔩 <em>Aluminium</em> – lightweight strong metal. Aircrafts, cans, foil – sabmein use hota hai. Solid state mein metallic luster dikhta hai.',
      solid_chalk:     '📝 <em>Khadiyan (Chalk)</em> – CaCO₃, ek ionic solid. Blackboard par likhte hain – particles layer-by-layer transfer hote hain!',
      solid_silicon:   '💎 <em>Silicon</em> – computers ki duniya ka "sand"! Microchips isi se bante hain. Semiconductor – bahut important material!',
      liquid_ethanol:  '🍾 <em>Ethanol</em> – ek organic liquid. Sanitizers, antiseptics, aur beverages mein use hota hai. Low boiling point – easily evaporate ho jaata hai!',
      liquid_mercury:  '🌡️ <em>Paara (Mercury)</em> – ek liquid metal! Room temperature par liquid rehta hai. Thermometers mein use hota tha – ab safer options hain.',
      liquid_acetone:  '🧴 <em>Aseton (Acetone)</em> – nail polish remover! Bahut aasaani se evaporate ho jaata hai – isliye nails par lagane ke baad jaldi sukh jaata hai.',
      liquid_petrol:   '⛽ <em>Petrol</em> – hydrocarbon mixture. Cars mein fuel hai. Yeh easily evaporate hota hai – isliye petrol smell aati hai!',
      liquid_honey:    '🍯 <em>Shahad (Honey)</em> – ek thick viscous liquid. High viscosity kyunki fructose-glucose concentration bahut zyada hai. Kabhi expire nahi hota!',
      liquid_seawater: '🌊 <em>Samudra Jal (Seawater)</em> – NaCl dissolved in water. Freezing point thoda neeche hai isliye sea winter mein bhi thoda jaldi nahi jamdta.',
      liquid_milk:     '🥛 <em>Doodh (Milk)</em> ek Colloid hai! Liquid state mein hai par iske andar fat droplets suspended hain. Tab 3 mein Tyndall Effect test karo!',
      gas_oxygen:      '🫁 <em>Oxygen (O₂)</em> – jo hum breathe karte hain! -183°C par liquid hoti hai (demo mein -20°C). Hospitals mein liquid O₂ store ki jaati hai.',
      gas_nitrogen:    '💨 <em>Nitrogen (N₂)</em> – atmosphere ka 78%! -196°C par liquid hoti hai. Liquid Nitrogen se food flash-freeze kiya jaata hai.',
      gas_co2_gas:     '🌿 <em>CO₂ Gas</em> – hum exhale karte hain! Plants photosynthesis mein use karti hain. Soft drinks mein fizz CO₂ gas se aati hai.',
      gas_hydrogen:    '🔵 <em>Hydrogen (H₂)</em> – universe ka sabse common element! Future fuel hai – sirf water produce karta hai burning mein.',
      gas_helium:      '🎈 <em>Helium (He)</em> – balloons mein! Bohot light hai aur noble gas hai – kisi se react nahi karta. Voice ko squeaky bana deta hai!',
      gas_neon:        '💡 <em>Neon (Ne)</em> – neon signs ki red-orange glow! Noble gas – chemically inert hai. Beautiful glow discharge deta hai.',
      gas_argon:       '⚡ <em>Argon (Ar)</em> – welding mein shielding gas! Light bulbs mein bhi hota hai. Noble gas – stable aur inert.',
      gas_methane:     '🔥 <em>Methane (CH₄)</em> – natural gas! Kitchen stove mein fuel. Cows bhi methane produce karti hain! Powerful greenhouse gas.',
      gas_propane:     '🫙 <em>LPG (Propane)</em> – ghar ke cylinders mein! Pressure mein liquid store hoti hai – isliye cylinder shake karte hain toh liquid sunai deta hai.',
      gas_ammonia:     '🟡 <em>Ammonia (NH₃)</em> – fertilizers mein! Pungent smell hoti hai. Ek baar smell karo – yaad rahega! Refrigeration mein bhi use hota hai.',
      gas_chlorine:    '🟢 <em>Chlorine (Cl₂)</em> – swimming pools mein disinfectant! Pale yellow-green gas hai. WW1 mein unfortunately weapon ki tarah use hua tha.',
      gas_ozone:       '🌍 <em>Ozone (O₃)</em> – atmosphere ki protective layer! UV rays block karta hai. Blue-purple tint hoti hai. Strong smell – photocopiers ke paas aati hai.',
      latent_melt:     '🌡️ <strong>Latent Heat of Fusion!</strong> Dekho – temperature ruk gayi hai! Energy <em>bonds todne</em> mein lag rahi hai – temperature badhane mein nahi. Yahi hota hai heating curve ka "plateau"!',
      latent_boil:     '💨 <strong>Latent Heat of Vaporization!</strong> Temperature phir ruk gayi! Bonds completely todte hain tab liquid → gas hota hai. Ye <em>chupi hoi (latent) energy</em> hai!',
      high_pressure:   '🏋️ Pressure se particles <em>pass-pass compress</em> ho jaate hain. LPG cylinders mein gases ko isi pressure se liquid rakha jaata hai!',
      default1:        '💡 Temperature slider hilao aur dekho particles kaise phase change karte hain! Substance ke naam par click karke alag padarth choose karo.',
      barrier_on:      '🚧 Barrier dono gases ko alag rakh raha hai. <strong>"Barrier Hatao"</strong> dabao aur diffusion dekho! Temperature badhaoge toh aur tezi se milenge.',
      barrier_off:     '💨 <em>Diffusion</em> shuru! Dono gases <strong>high → low concentration</strong> ki taraf move kar rahe hain. Temperature badhaao – mixing tezi hogi!',
      diff_hot:        '🔥 High temperature pe particles bahut fast hain – diffusion super fast! Yeh <em>Graham\'s Law</em> hai.',
      sol_salt:        '🧂 Namak paani mein <em>ghul gaya</em> – yeh <strong>True Solution</strong> hai! Na particles dikhenge, na settle honge, na Tyndall Effect aayega. Level bhi zyada nahi badhega!',
      sol_sand:        '🏖️ Baalu paani mein nahi ghulta – <strong>Suspension</strong> hai! Bade particles settle ho rahe hain – bottom par baith jaayenge.',
      sol_colloid:     '🥛 <strong>Colloid</strong>! Particles medium size – na ghulte hain, na settle hote hain. Laser chalao aur <em>Tyndall Effect</em> dekho!',
      tyndall_yes:     '🔦 <strong>Tyndall Effect!</strong> Beam colloid particles se <em>scatter</em> ho rahi hai – clearly dikh raha hai! Yeh proof hai – colloid hai! Doodh, Fog, Smoke – sab mein.',
      tyndall_no:      '✅ Beam <em>through ho gayi</em> bina scatter hue! True solution mein particles too small to scatter light. Tyndall Effect <strong>sirf Colloids mein</strong> hota hai!',
      default3:        '🔬 Solute type choose karo – Namak (True Solution), Baalu (Suspension), ya Doodh (Colloid). Phir Laser beam test karo!',
    },
    en: {
      solid_water:   '❄️ Water is in its <em>Solid (Ice)</em> state! Particles are <strong>tightly packed</strong> in a crystal lattice, vibrating in fixed positions. Strong intermolecular forces hold them – fixed shape!',
      liquid_water:  '💧 Water is in <em>Liquid</em> state. Particles move freely but stay close. Fixed volume, adapts to container shape.',
      gas_water:     '♨️ Water has become <em>Steam!</em> Particles fly rapidly in all directions. Negligible forces – gas fills the entire chamber!',
      solid_iron:    '⚙️ <em>Iron (Fe)</em> is a very strong metal. Particles in a rigid lattice. Requires extremely high temperature to melt!',
      liquid_iron:   '🔥 <em>Molten Iron!</em> This is the state used in casting and metallurgy – metal flows and fills molds.',
      gas_iron:      '🌋 Iron vapour! Only achievable in industrial smelting furnaces at extreme temperatures.',
      solid_camphor: '🏔️ <em>Camphor</em> is Solid. Notice – it will go directly to Gas, skipping Liquid! This is called <strong>Sublimation</strong>!',
      gas_camphor:   '✨ <strong>Sublimation!</strong> Camphor went solid → gas with no liquid stage. That\'s why camphor balls shrink and disappear without leaving moisture!',
      solid_wax:     '🕯️ <em>Candle Wax</em> is a solid. Heat it and it melts – that\'s the liquid wax that flows down a burning candle!',
      liquid_wax:    '🕯️ <em>Liquid Wax!</em> This is what flows down a burning candle. Cool it and it solidifies again.',
      solid_sulfur:  '🟡 <em>Sulfur (S₈)</em> – bright yellow solid. Used in sulfuric acid production. Heat it and watch it turn orange liquid!',
      liquid_sulfur: '🟡 Molten Sulfur! Notice the color change – sulfur\'s color changes with temperature in fascinating ways.',
      solid_iodine:  '💜 <em>Iodine (I₂)</em> – dark purple crystals that <strong>Sublime</strong>! Just like camphor, it goes solid → gas directly.',
      gas_iodine:    '💜 Iodine vapour! It went directly from solid to gas – Sublimation! You can observe this by gently heating iodine crystals in a lab.',
      solid_gold:    '🥇 <em>Gold (Au)</em> – a noble metal with a face-centered cubic lattice. Requires ~1064°C to melt in real life! Used in jewelry and electronics.',
      liquid_gold:   '🥇 Liquid Gold! Used in jewelry casting – poured into molds in this state.',
      solid_copper:  '🪙 <em>Copper (Cu)</em> – used in electric wires! In solid state, electrons move freely through the lattice – that\'s why copper conducts electricity!',
      solid_naphthalene: '⚪ <em>Naphthalene</em> – the mothball compound! Like camphor, it sublimates. That\'s why mothballs slowly shrink without leaving moisture.',
      gas_naphthalene: '⚪ Naphthalene vapour! This gas repels insects. Classic sublimation example!',
      solid_dryice:  '❄️ <em>Dry Ice</em> – frozen CO₂! It sublimates at -78°C (demo: -30°C). Creates spectacular fog effects because CO₂ gas is cold.',
      gas_dryice:    '❄️ <em>CO₂ gas</em> from Dry Ice! It went directly from solid to gas – pure sublimation! The "smoke" from dry ice is actually condensed water vapor from the air.',
      solid_sugar:   '🍬 <em>Sugar (Sucrose)</em> – a sweet organic solid. Heat it and it melts, then browns (caramelization!) – the basis of candy making.',
      liquid_sugar:  '🍬 <em>Liquid Sugar / Caramel!</em> This is how candy, toffee, and chocolate confections are made.',
      solid_phosphorus: '🔴 <em>Phosphorus (P₄)</em> – used in match heads! Very reactive. White phosphorus is dangerously flammable – handle with extreme care.',
      solid_aluminum: '🔩 <em>Aluminum (Al)</em> – lightweight strong metal used in aircraft, cans, and foil. Has a metallic luster in solid state.',
      solid_chalk:   '📝 <em>Chalk (CaCO₃)</em> – an ionic solid. When you write, particles transfer layer by layer from solid to the surface!',
      solid_silicon: '💎 <em>Silicon (Si)</em> – the "sand" of the computer world! All microchips are made from purified silicon. Semiconductor material.',
      liquid_ethanol:'🍾 <em>Ethanol (C₂H₅OH)</em> – used in sanitizers, antiseptics. Low boiling point means it evaporates quickly, which is why it feels cool on skin.',
      liquid_mercury:'🌡️ <em>Mercury (Hg)</em> – a liquid metal at room temperature! Was used in thermometers (now replaced by safer alternatives).',
      liquid_acetone:'🧴 <em>Acetone</em> – nail polish remover! Evaporates very quickly due to low boiling point.',
      liquid_petrol: '⛽ <em>Petrol</em> – a hydrocarbon mixture. Evaporates easily (low boiling point), which is why you can smell petrol.',
      liquid_honey:  '🍯 <em>Honey</em> – an extremely viscous liquid! High concentration of fructose/glucose. Never expires due to low water activity.',
      liquid_seawater:'🌊 <em>Seawater</em> – NaCl dissolved in water. Lower freezing point than pure water – that\'s why the sea doesn\'t freeze as easily as lakes.',
      liquid_milk:   '🥛 <em>Milk</em> is a Colloid! It\'s liquid, but fat droplets are suspended in it. Go to Tab 3 to test the Tyndall Effect!',
      gas_oxygen:    '🫁 <em>Oxygen (O₂)</em> – what we breathe! Liquefies at -183°C. Liquid O₂ is stored in hospitals for medical use.',
      gas_nitrogen:  '💨 <em>Nitrogen (N₂)</em> – 78% of our atmosphere! Liquid N₂ (-196°C) is used to flash-freeze food and in cryogenics.',
      gas_co2_gas:   '🌿 <em>Carbon Dioxide (CO₂)</em> – we exhale this! Plants use it in photosynthesis. The fizz in soft drinks is dissolved CO₂.',
      gas_hydrogen:  '🔵 <em>Hydrogen (H₂)</em> – the most abundant element in the universe! Future fuel – produces only water when burned.',
      gas_helium:    '🎈 <em>Helium (He)</em> – the balloon gas! Lighter than air, noble gas. Makes voices squeaky because sound travels faster through it.',
      gas_neon:      '💡 <em>Neon (Ne)</em> – the bright red-orange glow in neon signs! Noble gas, chemically inert. Beautiful plasma glow discharge.',
      gas_argon:     '⚡ <em>Argon (Ar)</em> – used as a shielding gas in welding! Also inside light bulbs. Noble and inert.',
      gas_methane:   '🔥 <em>Methane (CH₄)</em> – natural gas, kitchen fuel! Also a powerful greenhouse gas. Produced by decomposing organic matter.',
      gas_propane:   '🫙 <em>Propane / LPG</em> – stored as liquid under pressure in cylinders! That\'s why shaking a cylinder lets you hear liquid inside.',
      gas_ammonia:   '🟡 <em>Ammonia (NH₃)</em> – critical for fertilizers (Haber process)! Pungent smell. Also used in refrigeration.',
      gas_chlorine:  '🟢 <em>Chlorine (Cl₂)</em> – disinfects swimming pools! Pale yellow-green gas. Strong oxidizer.',
      gas_ozone:     '🌍 <em>Ozone (O₃)</em> – the protective atmospheric layer! Absorbs UV radiation. Slight blue tint. Smell it near photocopiers!',
      latent_melt:   '🌡️ <strong>Latent Heat of Fusion!</strong> Temperature has plateaued! Energy is being used to <em>break intermolecular bonds</em>, not raise temperature. The famous heating curve plateau!',
      latent_boil:   '💨 <strong>Latent Heat of Vaporization!</strong> Temperature stops rising again! All energy goes into breaking remaining bonds to convert liquid to gas.',
      high_pressure: '🏋️ Increased pressure compresses particles closer. This is how LPG gases are stored as liquids inside cylinders!',
      default1:      '💡 Move the temperature slider to watch phase changes! Click any substance to explore it. Special Latent Heat effects appear at melt/boil points.',
      barrier_on:    '🚧 The barrier separates two gases. Click <strong>"Remove Barrier"</strong> to observe diffusion. Higher temperature = faster mixing!',
      barrier_off:   '💨 <em>Diffusion</em> in action! Particles move from <strong>high → low concentration</strong>. Raise temperature to accelerate the process!',
      diff_hot:      '🔥 High temperature makes particles move faster – rapid diffusion! This is <em>Graham\'s Law</em> of diffusion.',
      sol_salt:      '🧂 Salt <em>dissolves</em> in water – forming a <strong>True Solution</strong>! No visible particles, no settling, no Tyndall Effect.',
      sol_sand:      '🏖️ Sand does <em>not dissolve</em> – this is a <strong>Suspension</strong>! Large particles settle at the bottom given time.',
      sol_colloid:   '🥛 This is a <strong>Colloid!</strong> Medium-sized particles that neither dissolve nor settle. Toggle the laser to observe the Tyndall Effect!',
      tyndall_yes:   '🔦 <strong>Tyndall Effect!</strong> Laser beam is <em>scattered by colloidal particles</em> – beam is clearly visible! This proves it\'s a colloid. Milk, fog, smoke – all show this!',
      tyndall_no:    '✅ Beam passed through <em>without scattering</em>! In true solutions, particles are too small to scatter light. Tyndall Effect is <strong>only in Colloids!</strong>',
      default3:      '🔬 Select a solute type – Salt (True Solution), Sand (Suspension), or Milk (Colloid). Then toggle the laser to test the Tyndall Effect!',
    },
  };

  function getAhaMsg() {
    const lang   = App.lang === 'hinglish' ? 'hi' : 'en';
    const msgs   = AHA[lang];
    const sub    = App.currentSubstance;
    const ld     = App.lastLiveData;
    const tab    = App.activeTab;
    const ps     = ld.particleState || 'liquid';

    if (tab === 1) {
      if (ld.isLatent) {
        return ps === 'solid' ? msgs.latent_melt : msgs.latent_boil;
      }
      if (App.pressure > 20) return msgs.high_pressure;
      const key = `${ps}_${sub}`;
      const fallback = `${ps}_water`;
      return msgs[key] || msgs[fallback] || msgs.default1;
    }
    if (tab === 2) {
      if (App.barrierActive) return msgs.barrier_on;
      if (App.diffTemp > 55) return msgs.diff_hot;
      return msgs.barrier_off;
    }
    if (tab === 3) {
      if (App.laserOn) return App.soluteType === 'colloid' ? msgs.tyndall_yes : msgs.tyndall_no;
      const k = `sol_${App.soluteType}`;
      return msgs[k] || msgs.default3;
    }
    return msgs.default1;
  }

  /* ══════════════════════════════════
     DOM HELPERS
  ══════════════════════════════════ */
  const $ = id => document.getElementById(id);
  const $$ = s => document.querySelectorAll(s);

  function showToast(msg, dur = 2600) {
    let toast = document.querySelector('.toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), dur);
  }

  function sv(id, val) { const el = $(id); if (el) el.textContent = val; }

  /* ══════════════════════════════════
     SUBSTANCE PICKER – DYNAMIC BUILD
  ══════════════════════════════════ */
  function hexToRgba(hex, a) {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    } catch(e) { return `rgba(56,189,248,${a})`; }
  }

  function buildSubstancePicker() {
    const container = $('substance-picker');
    if (!container || !window.MatterLab) return;

    const SUBS = window.MatterLab.SUBSTANCES;
    const lang = App.lang === 'hinglish' ? 'hi' : 'en';

    // Filter tabs
    const filterHtml = `
      <div class="sub-filter-tabs" id="sub-filter-tabs">
        <button class="sub-filter-btn active" data-filter="all" id="flt-all">${t('filterAll')}</button>
        <button class="sub-filter-btn" data-filter="solid" id="flt-solid">${t('filterSolid')}</button>
        <button class="sub-filter-btn" data-filter="liquid" id="flt-liquid">${t('filterLiquid')}</button>
        <button class="sub-filter-btn" data-filter="gas" id="flt-gas">${t('filterGas')}</button>
      </div>
      <div class="sub-count-badge" id="sub-count-badge">50 substances</div>
    `;

    // Cards
    const cards = Object.entries(SUBS).map(([key, sub]) => {
      const name    = lang === 'hi' ? sub.nameHi : sub.nameEn;
      const color   = sub.cl;
      const bgRgba  = hexToRgba(color, 0.12);
      const bordRgba = hexToRgba(color, 0.0);
      const specialBadge = sub.sp === 'sublime'
        ? `<span class="sub-card-special">SUB</span>` : '';

      return `<button class="sub-card${key === 'water' ? ' active-sub' : ''}" data-key="${key}" data-cat="${sub.cat}"
        style="--sub-bg:${bgRgba};--sub-brd:${hexToRgba(color,0.25)};--sub-clr:${color};--sub-glow:${hexToRgba(color,0.35)}"
        title="${sub.nameEn} (${sub.formula}) – ${sub.cat}"
        aria-label="${sub.nameEn}">
        <span class="sub-card-emoji">${sub.emoji}</span>
        <div class="sub-card-info">
          <span class="sub-card-name" data-name-key="${key}">${name}</span>
          <span class="sub-card-formula">${sub.formula}</span>
        </div>
        <div class="sub-card-right">
          ${specialBadge}
          <span class="sub-card-badge ${sub.cat}">${sub.cat.substring(0,3).toUpperCase()}</span>
        </div>
      </button>`;
    }).join('');

    container.innerHTML = filterHtml + `<div class="sub-scroll-grid" id="sub-scroll-grid">${cards}</div>`;

    // Filter buttons
    $$('.sub-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        App.subFilter = btn.dataset.filter;
        $$('.sub-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterSubstanceCards(App.subFilter);
      });
    });

    // Card click
    $$('.sub-card').forEach(btn => {
      btn.addEventListener('click', () => {
        App.currentSubstance = btn.dataset.key;
        $$('.sub-card').forEach(b => b.classList.remove('active-sub'));
        btn.classList.add('active-sub');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        window.MatterLab.setSubstance(App.currentSubstance);
        // Reset temp to 25°C default
        const tSlider = $('temp-slider');
        if (tSlider) {
          tSlider.value = '25';
          App.temperature = 25;
          window.MatterLab.setTemperature(25);
          updateTempDisplay(25);
          sv('temp-val', '25°C');
        }
        updateAha();
        showToast(`${window.MatterLab.SUBSTANCES[App.currentSubstance].emoji} ${btn.querySelector('.sub-card-name').textContent} selected!`);
      });
    });

    updateSubCardNames();
  }

  function filterSubstanceCards(filter) {
    const cards = $$('.sub-card');
    let visible = 0;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const badge = $('sub-count-badge');
    if (badge) badge.textContent = `${visible} substance${visible !== 1 ? 's' : ''}`;
  }

  function updateSubCardNames() {
    const lang = App.lang === 'hinglish' ? 'hi' : 'en';
    const SUBS = window.MatterLab ? window.MatterLab.SUBSTANCES : {};
    $$('.sub-card-name[data-name-key]').forEach(el => {
      const key = el.dataset.nameKey;
      if (SUBS[key]) el.textContent = lang === 'hi' ? SUBS[key].nameHi : SUBS[key].nameEn;
    });
  }

  function rebuildFilterTabs() {
    const tabs = ['flt-all', 'flt-solid', 'flt-liquid', 'flt-gas'];
    const keys = ['filterAll', 'filterSolid', 'filterLiquid', 'filterGas'];
    tabs.forEach((id, i) => { const el = $(id); if (el) el.textContent = t(keys[i]); });
  }

  /* ══════════════════════════════════
     LIVE METERS
  ══════════════════════════════════ */
  function updateMeters(data) {
    App.lastLiveData = data;
    const ps = data.particleState || 'liquid';
    const stateNames = {
      hi: { solid: 'Thaos (Solid)', liquid: 'Drava (Liquid)', gas: 'Gas' },
      en: { solid: 'Solid', liquid: 'Liquid', gas: 'Gas' },
    };
    const lang  = App.lang === 'hinglish' ? 'hi' : 'en';
    const sName = stateNames[lang][ps] || ps;

    // Canvas badge
    const badge = $('canvas-state-badge');
    if (badge) { badge.textContent = sName; badge.className = `state-overlay-badge ${ps}`; }

    // Substance name on canvas
    const subNameEl = $('canvas-sub-name');
    if (subNameEl && window.MatterLab) {
      const sub = window.MatterLab.SUBSTANCES[App.currentSubstance];
      if (sub) subNameEl.textContent = `${sub.emoji} ${sub.nameHi || sub.nameEn} (${sub.formula})`;
    }

    sv('meter-state-val',   sName);
    sv('meter-speed-val',   data.particleSpeed || '–');
    sv('meter-space-val',   data.interparticleSpace || '–');
    sv('meter-attract-val', data.attractionForce || '–');

    const ke = data.kineticEnergy || 0;
    sv('meter-kinetic-val', `${ke}%`);
    const kBar = $('meter-kinetic-bar');
    if (kBar) {
      kBar.style.width = `${ke}%`;
      kBar.style.background = ke > 72
        ? 'linear-gradient(90deg,#f97316,#ef4444)'
        : ke > 42
          ? 'linear-gradient(90deg,#fbbf24,#f97316)'
          : 'linear-gradient(90deg,#38bdf8,#22d3ee)';
    }

    // Tab 2 diff%
    const dp = data.diffusionPercent || 0;
    sv('meter-diff-val', `${dp}%`);
    const dBar = $('meter-diff-bar');
    if (dBar) dBar.style.width = `${dp}%`;

    // Latent
    const la = $('latent-alert');
    if (la) la.classList.toggle('visible', !!data.isLatent);

    // Phase track
    $$('.phase-seg').forEach(seg => {
      seg.classList.remove('active-phase');
      if ((ps === 'solid' && seg.classList.contains('seg-solid')) ||
          (ps === 'liquid' && seg.classList.contains('seg-liquid')) ||
          (ps === 'gas'    && seg.classList.contains('seg-gas'))) {
        seg.classList.add('active-phase');
      }
    });

    // Tab 2 extra meters
    const dspeed = $('diff-speed-val');
    const dbarr  = $('diff-barrier-val');
    if (dspeed && window.MatterLab) {
      const spd = window.MatterLab.getState().diffTemp;
      dspeed.textContent = spd > 65 ? 'Very Fast' : spd > 35 ? 'Fast' : spd > 15 ? 'Medium' : 'Slow';
      dspeed.style.color = spd > 65 ? 'var(--accent-hot)' : spd > 35 ? 'var(--accent-amber)' : 'var(--accent-primary)';
    }
    if (dbarr && window.MatterLab) {
      const on = window.MatterLab.getState().barrierActive;
      dbarr.textContent = on ? 'Active' : 'Removed';
      dbarr.style.color = on ? 'var(--accent-hot)' : 'var(--accent-green)';
    }

    // Aha throttle
    App._ahaTick = (App._ahaTick || 0) + 1;
    if (App._ahaTick % 45 === 0) updateAha();
  }

  function updateTempDisplay(temp) {
    const el = $('temp-display');
    const ic = $('burner-icon');
    if (!el) return;
    el.textContent = `${temp}°C`;
    if (temp > 100)      { el.className = 'temp-display hot';  if (ic) ic.textContent = '🔥'; }
    else if (temp > 30)  { el.className = 'temp-display mid';  if (ic) ic.textContent = '🕯️'; }
    else if (temp < 0)   { el.className = 'temp-display cold'; if (ic) ic.textContent = '❄️'; }
    else                 { el.className = 'temp-display';       if (ic) ic.textContent = '🌡️'; }
  }

  function updateAha() {
    const el = $('aha-text');
    if (!el) return;
    const msg = getAhaMsg();
    el.style.opacity = 0;
    setTimeout(() => { el.innerHTML = msg; el.style.opacity = 1; }, 200);
  }

  function updateBarrierStatus() {
    const el  = $('barrier-status');
    const btn = $('btn-remove-barrier');
    if (el) {
      el.textContent = App.barrierActive ? t('barrierOn') : t('barrierOff');
      el.className   = `barrier-status ${App.barrierActive ? 'on' : 'off'}`;
    }
    if (btn) btn.innerHTML = App.barrierActive ? t('btnBarrierOn') : t('btnBarrierOff');
  }

  function updateTyndallStatus() {
    const el = $('tyndall-status-text');
    const ind = $('beam-indicator');
    if (!el || !ind) return;
    if (!App.laserOn) {
      el.textContent = t('tyndallOff_laser'); ind.className = 'beam-indicator';
    } else if (App.soluteType === 'colloid') {
      el.textContent = t('tyndallOn'); ind.className = 'beam-indicator visible';
    } else {
      el.textContent = t('tyndallOff_inv'); ind.className = 'beam-indicator invisible';
    }
  }

  /* ══════════════════════════════════
     LANGUAGE APPLICATION
  ══════════════════════════════════ */
  function applyLanguage() {
    // Tabs
    $$('.mod-tab').forEach(btn => {
      const n = btn.dataset.tab;
      const span = btn.querySelector('.tab-text');
      if (span && n) span.textContent = t(`tab${n}`);
    });
    // Panel titles
    sv('substance-title',  t('substanceTitle'));
    sv('controls-title',   t('controlsTitle'));
    sv('meters-title',     t('metersTitle'));
    sv('diff-ctrl-title',  t('diffCtrlTitle'));
    sv('solution-title',   t('solutionTitle'));
    sv('torch-title',      t('torchTitle'));
    // Slider labels
    sv('temp-slider-label',  t('tempSlider'));
    sv('press-slider-label', t('pressSlider'));
    sv('diff-temp-label',    t('diffTempSlider'));
    // Meter labels
    sv('meter-state-label',   t('meterState'));
    sv('meter-speed-label',   t('meterSpeed'));
    sv('meter-space-label',   t('meterSpace'));
    sv('meter-attract-label', t('meterAttract'));
    sv('meter-kinetic-label', t('meterKinetic'));
    sv('meter-diff-label',    t('meterDiff'));
    // Aha box
    sv('aha-title',    t('ahaTitle'));
    sv('aha-subtitle', t('ahaSub'));
    // Phase labels
    sv('phase-solid-lbl',  t('phaseSolid'));
    sv('phase-liquid-lbl', t('phaseLiquid'));
    sv('phase-gas-lbl',    t('phaseGas'));
    // Solute buttons
    const solMap = { salt: t('salt'), sand: t('sand'), colloid: t('colloid') };
    $$('.solute-btn').forEach(btn => {
      const sol = btn.dataset.sol;
      if (sol) { const n = btn.querySelector('.sol-name'); if (n) n.textContent = solMap[sol] || sol; }
    });
    // Rebuild filter tab labels
    rebuildFilterTabs();
    // Update substance card names
    updateSubCardNames();
    // Status updates
    updateTyndallStatus();
    updateBarrierStatus();
    updateAha();
  }

  /* ══════════════════════════════════
     TAB SWITCHING
  ══════════════════════════════════ */
  function switchTab(tabNum) {
    App.activeTab = tabNum;
    $$('.mod-tab').forEach(b => b.classList.toggle('active', parseInt(b.dataset.tab) === tabNum));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', parseInt(p.dataset.tabPanel) === tabNum));

    window.MatterLab && window.MatterLab.setTab(tabNum);

    const chamberLabels = {
      1: '⚗️ Particle Chamber – Phase Transitions',
      2: '💨 Diffusion Chamber – Gas Mixing',
      3: '🫧 Beaker – Solution / Colloid Test',
    };
    sv('chamber-label', chamberLabels[tabNum] || '');

    // Heat bar controls
    const tempSlider  = $('temp-slider');
    const tempVal     = $('temp-val');
    const diffSlider  = $('diff-temp-slider');
    const diffVal     = $('diff-temp-val');
    const diffBurner  = $('diff-burner-icon');
    const mainBurner  = $('burner-icon');
    const tempDisplay = $('temp-display');

    if (tabNum === 1) {
      [tempSlider, tempVal, mainBurner, tempDisplay].forEach(e => e && (e.style.display = ''));
      [diffSlider, diffVal, diffBurner].forEach(e => e && (e.style.display = 'none'));
    } else if (tabNum === 2) {
      [diffSlider, diffVal, diffBurner].forEach(e => e && (e.style.display = ''));
      [tempSlider, tempVal, mainBurner, tempDisplay].forEach(e => e && (e.style.display = 'none'));
    } else {
      [tempSlider, tempVal, diffSlider, diffVal, diffBurner, mainBurner, tempDisplay]
        .forEach(e => e && (e.style.display = 'none'));
    }

    setTimeout(updateAha, 120);
  }

  /* ══════════════════════════════════
     FULLSCREEN
  ══════════════════════════════════ */
  function toggleFullscreen() {
    const btnFs = $('btn-fullscreen');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      document.body.classList.add('fullscreen-mode');
      if (btnFs) btnFs.innerHTML = '⛶ <span>Exit Full</span>';
    } else {
      document.exitFullscreen().catch(() => {});
      document.body.classList.remove('fullscreen-mode');
      if (btnFs) btnFs.innerHTML = '⛶ <span>Fullscreen</span>';
    }
  }
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove('fullscreen-mode');
      const btnFs = $('btn-fullscreen');
      if (btnFs) btnFs.innerHTML = '⛶ <span>Fullscreen</span>';
    }
  });

  /* ══════════════════════════════════
     INIT
  ══════════════════════════════════ */
  function init() {
    const canvas = $('particle-canvas');
    if (!canvas || !window.MatterLab) return;

    window.MatterLab.init(canvas);
    window.MatterLab.onFrame = updateMeters;
    window.MatterLab.onStateChange = (newState) => {
      const msgs = {
        solid:  { hi: '🧊 Solid State!',  en: '🧊 Solid State!'  },
        liquid: { hi: '💧 Liquid State!', en: '💧 Liquid State!' },
        gas:    { hi: '♨️ Gas State!',    en: '♨️ Gas State!'    },
      };
      const lang = App.lang === 'hinglish' ? 'hi' : 'en';
      const m = msgs[newState];
      if (m) showToast(m[lang]);
    };
    window.MatterLab.onTyndall = (vis) => {
      if (vis !== App.tyndallState) { App.tyndallState = vis; updateTyndallStatus(); }
    };

    // Build substance picker AFTER MatterLab is ready
    buildSubstancePicker();

    window.MatterLab.start();

    /* ── Language toggle ── */
    $$('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        App.lang = btn.dataset.lang;
        $$('.lang-option').forEach(b => b.classList.toggle('active-lang', b.dataset.lang === App.lang));
        applyLanguage();
        showToast(App.lang === 'hinglish' ? t('langToastHi') : t('langToastEn'));
      });
    });

    /* ── Theme ── */
    const btnTheme = $('btn-theme');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        btnTheme.innerHTML = isLight ? '🌙 <span>Dark</span>' : '☀️ <span>Light</span>';
        showToast(isLight ? '☀️ Light Mode' : '🌙 Dark Mode');
      });
    }

    /* ── Fullscreen ── */
    const btnFs = $('btn-fullscreen');
    if (btnFs) btnFs.addEventListener('click', toggleFullscreen);

    /* ── Module tabs ── */
    $$('.mod-tab').forEach(btn => btn.addEventListener('click', () => switchTab(parseInt(btn.dataset.tab))));

    /* ── Tab 1: Temperature ── */
    const tSlider = $('temp-slider');
    if (tSlider) {
      tSlider.addEventListener('input', () => {
        App.temperature = parseInt(tSlider.value);
        window.MatterLab.setTemperature(App.temperature);
        sv('temp-val', `${App.temperature}°C`);
        updateTempDisplay(App.temperature);
      });
      tSlider.value = '25';
    }

    /* ── Tab 1: Pressure ── */
    const pSlider = $('pressure-slider');
    if (pSlider) {
      pSlider.addEventListener('input', () => {
        App.pressure = parseInt(pSlider.value);
        window.MatterLab.setPressure(App.pressure);
        sv('pressure-val', `${App.pressure}%`);
        const pBar = $('piston-bar');
        if (pBar) pBar.style.width = `${App.pressure * 2}%`;
      });
    }

    /* ── Tab 2: Diffusion Temp ── */
    const dSlider = $('diff-temp-slider');
    if (dSlider) {
      dSlider.addEventListener('input', () => {
        App.diffTemp = parseInt(dSlider.value);
        window.MatterLab.setDiffTemp(App.diffTemp);
        sv('diff-temp-val', `${App.diffTemp}°C`);
        const ic = $('diff-burner-icon');
        if (ic) ic.textContent = App.diffTemp > 60 ? '🔥' : App.diffTemp > 30 ? '🕯️' : '🌡️';
      });
    }

    /* ── Tab 2: Barrier ── */
    const btnBarrier = $('btn-remove-barrier');
    if (btnBarrier) {
      btnBarrier.addEventListener('click', () => {
        App.barrierActive = !App.barrierActive;
        window.MatterLab.setBarrier(App.barrierActive);
        updateBarrierStatus();
        if (!App.barrierActive) {
          showToast(App.lang === 'hinglish' ? '🚀 Barrier hata diya! Diffusion shuru!' : '🚀 Barrier removed! Diffusion begins!');
        } else {
          window.MatterLab.setTab(2);
          showToast(App.lang === 'hinglish' ? '🔄 Reset ho gaya!' : '🔄 Chamber reset!');
        }
        updateAha();
      });
    }

    /* ── Tab 3: Solute type ── */
    $$('.solute-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        App.soluteType = btn.dataset.sol;
        $$('.solute-btn').forEach(b => b.classList.remove('active-sol'));
        btn.classList.add('active-sol');
        window.MatterLab.setSoluteType(App.soluteType);
        App.tyndallState = 'none';
        updateTyndallStatus();
        updateAha();
      });
    });

    /* ── Tab 3: Laser ── */
    const laserToggle = $('laser-toggle');
    if (laserToggle) {
      laserToggle.addEventListener('change', () => {
        App.laserOn = laserToggle.checked;
        window.MatterLab.setLaser(App.laserOn);
        updateTyndallStatus();
        updateAha();
        if (App.laserOn) showToast(App.lang === 'hinglish' ? '🔦 Laser beam ON!' : '🔦 Laser beam activated!');
      });
    }

    /* ── Reset ── */
    const btnReset = $('btn-reset-chamber');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        window.MatterLab.setTab(App.activeTab);
        showToast(App.lang === 'hinglish' ? '🔄 Chamber reset ho gaya!' : '🔄 Chamber reset!');
      });
    }

    /* ── Add solute ── */
    const btnAddSolute = $('btn-add-solute');
    if (btnAddSolute) {
      btnAddSolute.addEventListener('click', () => {
        window.MatterLab.setSoluteAmount(70);
        showToast(App.lang === 'hinglish' ? '➕ Aur solute daala!' : '➕ More solute added!');
        setTimeout(() => window.MatterLab.setSoluteAmount(40), 2500);
      });
    }

    /* ── Keyboard shortcuts ── */
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === '1') switchTab(1);
      if (e.key === '2') switchTab(2);
      if (e.key === '3') switchTab(3);
      if (e.key === 'l' || e.key === 'L') {
        App.lang = App.lang === 'hinglish' ? 'english' : 'hinglish';
        $$('.lang-option').forEach(b => b.classList.toggle('active-lang', b.dataset.lang === App.lang));
        applyLanguage();
      }
    });

    /* ── Canvas ResizeObserver ── */
    const canvasWrap = document.querySelector('.canvas-container');
    if (canvasWrap && window.ResizeObserver) {
      new ResizeObserver(() => window.dispatchEvent(new Event('resize'))).observe(canvasWrap);
    }

    /* ── Initial state ── */
    switchTab(1);
    applyLanguage();

    setTimeout(() => {
      showToast(App.lang === 'hinglish'
        ? '🎉 MatterLab v2.0 – 50 substances! Explore karo!'
        : '🎉 MatterLab v2.0 – 50 Substances! Start exploring!', 3800);
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
