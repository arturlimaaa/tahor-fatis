import React, { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw, Loader, Crown } from 'lucide-react';

// --- STYLES ---
const RENAISSANCE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');

  .font-heading { font-family: 'Cinzel Decorative', cursive; }
  .font-body { font-family: 'IM Fell English', serif; }

  .bg-velvet {
    background-color: #0c0a09;
    background-image: radial-gradient(circle at 50% 50%, #1c1917 0%, #000000 100%);
  }

  .perspective-1000 { perspective: 1000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }

  @keyframes float-spirit {
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }

  .spirit-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #cfb53b;
    border-radius: 50%;
    pointer-events: none;
    animation: float-spirit 2s ease-out forwards;
    box-shadow: 0 0 10px #cfb53b, 0 0 20px #ffeb3b;
  }

  @keyframes mystic-aura {
    0%, 100% { box-shadow: 0 0 20px rgba(207, 181, 59, 0.2), 0 0 40px rgba(207, 181, 59, 0.1); border-color: #8b4513; }
    50% { box-shadow: 0 0 40px rgba(207, 181, 59, 0.6), 0 0 80px rgba(207, 181, 59, 0.3); border-color: #cfb53b; }
  }

  .animate-aura {
    animation: mystic-aura 3s ease-in-out infinite;
    z-index: 40;
  }

  .scrollbar-antique::-webkit-scrollbar { width: 6px; }
  .scrollbar-antique::-webkit-scrollbar-track { background: #1a1a1a; }
  .scrollbar-antique::-webkit-scrollbar-thumb { background: #8b4513; border-radius: 3px; }

  .blend-vintage { filter: sepia(0.6) contrast(1.1) brightness(0.9); }

  @keyframes bubble-pop {
    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-bubble { animation: bubble-pop 0.4s ease-out forwards; }

  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .animate-turn { animation: slide-in-right 0.35s ease-out forwards; }

  @keyframes card-shuffle {
    0%   { transform: rotate(0deg)   translateX(0px); }
    15%  { transform: rotate(-8deg)  translateX(-12px); }
    30%  { transform: rotate(6deg)   translateX(8px); }
    45%  { transform: rotate(-4deg)  translateX(-6px); }
    60%  { transform: rotate(5deg)   translateX(10px); }
    75%  { transform: rotate(-2deg)  translateX(-4px); }
    90%  { transform: rotate(3deg)   translateX(5px); }
    100% { transform: rotate(0deg)   translateX(0px); }
  }
  .animate-shuffle {
    animation: card-shuffle 2.4s ease-in-out forwards;
    transform-origin: center bottom;
  }

  @keyframes cartomancer-float {
    0%, 100% { transform: scaleX(-1) translateY(0px); }
    50%       { transform: scaleX(-1) translateY(-12px); }
  }
  .animate-cartomancer {
    animation: cartomancer-float 6s ease-in-out infinite;
  }
`;

// --- VERBOSITY CONFIG ---
const VERBOSITY_CONFIG = [
  { label: 'Whisper',  wordRange: '15 to 25'   },
  { label: 'Cryptic',  wordRange: '30 to 45'   },
  { label: 'Balanced', wordRange: '55 to 75'   },
  { label: 'Oracular', wordRange: '85 to 110'  },
  { label: 'Verbose',  wordRange: '130 to 170' },
];

// Speaker color by slot index: Situation (gold), Challenge (rose), Outcome (slate blue)
const POSITION_COLORS = ['#cfb53b', '#c4847c', '#7c9ec4'];

// --- COMPONENTS ---

const SpiritParticles = ({ active }) => {
  if (!active) return null;
  const particles = Array.from({ length: 12 }).map(() => ({
    tx: (Math.random() - 0.5) * 200 + 'px',
    ty: (Math.random() - 1) * 150 + 'px',
    delay: Math.random() * 2 + 's',
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      {particles.map((p, i) => (
        <div key={i} className="spirit-particle" style={{ left: '50%', top: '50%', '--tx': p.tx, '--ty': p.ty, animationDelay: p.delay }} />
      ))}
    </div>
  );
};

const CardSlot = ({ card, index, label, isTalking, isNextSlot }) => (
  <div className={`
    relative w-48 h-80 border-2 rounded
    flex items-center justify-center transition-all duration-500
    ${!card
      ? isNextSlot
        ? 'bg-black/30 border-[#cfb53b]/70 hover:border-[#cfb53b] hover:bg-black/40'
        : 'bg-black/10 border-dashed border-[#5c4033]/30'
      : 'border-transparent'}
    ${isTalking ? 'scale-105 z-40' : ''}
  `}>
    {!card ? (
      <div className="text-[#5c4033] text-center pointer-events-none select-none">
        <div className="font-heading text-5xl opacity-20 mb-2">{index + 1}</div>
        <div className="text-xs uppercase tracking-[0.2em] opacity-50 font-heading">{label}</div>
      </div>
    ) : (
      <div className="relative w-full h-full preserve-3d animate-in zoom-in duration-500">
        <SpiritParticles active={isTalking} />
        <div className={`
          w-full h-full rounded overflow-hidden border-[3px] border-[#2a1a1a] shadow-2xl relative
          ${isTalking ? 'animate-aura' : ''}
          ${card.isReversed ? 'rotate-180' : ''}
        `}>
          <div className="absolute inset-1 border border-[#cfb53b] z-20 pointer-events-none" />
          <img
            src={card.img}
            alt={card.name}
            className={`w-full h-full object-cover ${card.isMinor ? 'blend-vintage' : ''}`}
          />
        </div>
        <div className={`
          absolute left-0 right-0 text-center animate-in fade-in slide-in-from-top-2 duration-700
          ${card.isReversed ? '-top-10' : '-bottom-10'}
        `}>
          <p className="text-[#cfb53b] font-heading text-[10px] tracking-[0.2em] uppercase bg-black/80 py-1 px-2 inline-block rounded border border-[#cfb53b]/30 shadow-lg">
            {label}{card.isReversed && ' (Rev)'}
          </p>
        </div>
      </div>
    )}
  </div>
);

const ConversationTurn = ({ turn, isLatest }) => {
  const anim = isLatest ? 'animate-turn' : '';

  if (turn.variant === 'system') {
    return (
      <div className={`text-center text-[#5c4033] font-heading text-[10px] tracking-widest py-2 ${anim}`}>
        ✦ {turn.text} ✦
      </div>
    );
  }

  if (turn.variant === 'user') {
    return (
      <div className={`flex flex-col items-end ${anim}`}>
        <div className="bg-[#1a1209] border border-[#8b4513]/40 rounded px-3 py-2 max-w-[90%]">
          <p className="text-[#c4a46b] font-body text-sm">{turn.text}</p>
        </div>
        <span className="text-[#5c4033] font-heading text-[9px] mt-1 tracking-widest">YOU</span>
      </div>
    );
  }

  if (turn.variant === 'conclusion') {
    return (
      <div className={anim}>
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-[#cfb53b]/20" />
          <span className="font-heading text-[9px] text-[#cfb53b]/60 tracking-widest whitespace-nowrap">THE ANSWER</span>
          <div className="flex-1 h-px bg-[#cfb53b]/20" />
        </div>
        <div className="rounded p-4 border border-[#cfb53b]/30" style={{ background: 'rgba(207,181,59,0.06)' }}>
          <p className="text-[#e8dfcc] font-body text-sm leading-relaxed text-center italic">{turn.text}</p>
        </div>
      </div>
    );
  }

  // Card turn
  const color = turn.cardIndex !== undefined && turn.cardIndex >= 0
    ? POSITION_COLORS[turn.cardIndex]
    : '#cfb53b';
  return (
    <div className={anim}>
      <span className="font-heading text-[10px] tracking-widest mb-1 block" style={{ color }}>
        {turn.speaker}
      </span>
      <div className="bg-black/40 border border-[#5c4033]/20 rounded px-3 py-2">
        <p className="text-[#e8dfcc] font-body text-sm italic leading-relaxed">"{turn.text}"</p>
      </div>
    </div>
  );
};

// --- INFO BUBBLE ---

const InfoBubble = ({ content, direction = 'top', align = 'center' }) => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(null);

  const show = () => { clearTimeout(timerRef.current); setOpen(true); };
  // Small delay on hide so cursor can travel from badge → tooltip without flickering
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 120); };

  const pos      = direction === 'top' ? 'bottom-full pb-2' : 'top-full pt-2';
  const alignCls = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const arrowPos = direction === 'top'
    ? 'top-full left-1/2 -translate-x-1/2 -mt-[5px] border-b border-r'
    : 'bottom-full left-1/2 -translate-x-1/2 -mb-[5px] border-t border-l';

  return (
    <div className="relative inline-flex items-center ml-1.5 flex-shrink-0">
      {/* The ⓘ badge */}
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        className="w-3.5 h-3.5 rounded-full border border-[#8b4513]/70 text-[#8b4513] flex items-center justify-center cursor-help hover:border-[#cfb53b] hover:text-[#cfb53b] transition-colors select-none"
        style={{ fontSize: '8px', lineHeight: 1, fontFamily: 'serif' }}
      >
        i
      </div>
      {/* Tooltip — pointer-events enabled so links inside are clickable */}
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        className={`absolute ${pos} ${alignCls} w-64 bg-[#0d0a08] border border-[#8b4513]/50 rounded p-3 text-[#c4a46b] font-body text-xs leading-relaxed transition-opacity duration-200 z-[100] shadow-2xl ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {content}
        <div className={`absolute ${arrowPos} w-2 h-2 bg-[#0d0a08] rotate-45 border-[#8b4513]/50`} />
      </div>
    </div>
  );
};

// --- DATA ---

const MAJOR_ARCANA = [
  {
    id: 'fool', name: 'The Fool', voice: 'Puck',
    fortune_telling: 'Watch for new projects and new beginnings. Prepare to take a leap of faith.',
    keywords: 'Beginnings, Freedom, Innocence, Originality, Adventure',
    archetype: 'The Divine Child', numerology: '0', element: 'Air',
    personality: 'Speaks in breathless, incomplete sentences full of wonder. Asks naive questions that cut to the heart. Uses physical metaphors — jumping, falling, running off cliffs. Interrupts itself with new thoughts. Delights in paradox without understanding it.',
    speechStyle: 'Be wonderstruck and unguarded. Ask more questions than you answer.',
    img: '/cards/The_Fool.jpg',
  },
  {
    id: 'magician', name: 'The Magician', voice: 'Orus',
    fortune_telling: 'A powerful man may play a role in your day. Your talents are being called upon.',
    keywords: 'Manifestation, Resourcefulness, Power, Inspired Action',
    archetype: 'The Alchemist', numerology: '1', element: 'Air',
    personality: 'Speaks with deliberate precision, as if naming something makes it real. Uses the language of tools and elements. Confident, never boastful. Every word is a deliberate gesture toward possibility. Does not waste syllables.',
    speechStyle: 'Be precise and purposeful. Speak as if shaping reality with each word.',
    img: '/cards/The_Magician.jpg',
  },
  {
    id: 'priestess', name: 'The High Priestess', voice: 'Leda',
    fortune_telling: 'A mysterious woman arrives. A secret is revealed.',
    keywords: 'Intuition, Sacred Knowledge, Divine Feminine, Mystery',
    archetype: 'The Oracle', numerology: '2', element: 'Water',
    personality: 'Speaks in long, measured riddles. Never answers directly. Uses water, moonlight, and threshold imagery. Implies more than she says. Refers to hidden currents others cannot see. Occasionally unsettling in her calm.',
    speechStyle: 'Speak in half-truths and symbolic images. Leave the most important things unsaid.',
    img: '/cards/The_High_Priestess.jpg',
  },
  {
    id: 'empress', name: 'The Empress', voice: 'Aoede',
    fortune_telling: 'Pregnancy or a new creative project. Abundance is coming.',
    keywords: 'Femininity, Beauty, Nature, Nurturing, Abundance',
    archetype: 'The Mother', numerology: '3', element: 'Earth',
    personality: 'Warm, expansive, sensory. Speaks in terms of growth, seasons, bodies, and abundance. Never hurries. Gently corrects, never scolds. Can be fiercely protective when pushed. Grounds abstract ideas in physical experience.',
    speechStyle: 'Be nurturing and sensory. Root every idea in the physical world.',
    img: '/cards/The_Empress.jpg',
  },
  {
    id: 'emperor', name: 'The Emperor', voice: 'Fenrir',
    fortune_telling: 'A father figure or boss. Structure and order are needed.',
    keywords: 'Authority, Establishment, Structure, Stability',
    archetype: 'The Father', numerology: '4', element: 'Fire',
    personality: 'Measured, authoritative, economical with emotion. Speaks in terms of structure, law, and consequence. Does not speculate — only states. Can seem cold but is simply certain. Deeply uncomfortable with chaos in others.',
    speechStyle: 'Be authoritative and structured. State, do not speculate.',
    img: '/cards/The_Emperor.jpg',
    isMinor: true,
  },
  {
    id: 'hierophant', name: 'The Hierophant', voice: 'Charon',
    fortune_telling: 'Seek guidance from an elder or tradition. A blessing is offered.',
    keywords: 'Tradition, Conformity, Morality, Ethics, Spiritual Guidance',
    archetype: 'The High Priest', numerology: '5', element: 'Earth',
    personality: 'Formal, ceremonial, slow. Invokes tradition and lineage. Speaks as if reading from a text that predates this conversation. Uses "we" and "one" rather than "I". Finds meaning in established forms. Condescending only to those who reject structure entirely.',
    speechStyle: 'Speak in formal, institutional cadences. Invoke tradition and received wisdom.',
    img: '/cards/The_Hierophant.jpg',
    isMinor: true,
  },
  {
    id: 'lovers', name: 'The Lovers', voice: 'Zephyr',
    fortune_telling: 'A choice to be made. A new relationship or a deepening of an existing one.',
    keywords: 'Love, Harmony, Relationships, Values Alignment, Choice',
    archetype: 'The Soulmate', numerology: '6', element: 'Air',
    personality: 'Speaks in dualities and choices — always aware of what is gained and what is sacrificed. Romantic but not naive. Language is sensory and specific. Refuses to pretend choices do not cost something. Attuned to connection and its fragility.',
    speechStyle: 'Speak about the weight of choice. Name both sides of every duality.',
    img: '/cards/The_Lovers.jpg',
  },
  {
    id: 'chariot', name: 'The Chariot', voice: 'Kore',
    fortune_telling: 'Victory is yours if you stay focused. Do not give up.',
    keywords: 'Control, Willpower, Success, Determination, Drive',
    archetype: 'The Warrior', numerology: '7', element: 'Water',
    personality: 'Urgent, forward-leaning, impatient with hesitation. Speaks in motion — always about where something is going, never where it has been. Uses the language of momentum and will. Respects effort above all. Has no time for doubt but understands it.',
    speechStyle: 'Be direct and momentum-focused. Push forward, never look back.',
    img: '/cards/The_Chariot.jpg',
  },
  {
    id: 'strength', name: 'Strength', voice: 'Kore',
    fortune_telling: 'You have the strength to overcome.',
    keywords: 'Strength, Courage, Compassion, Inner Power, Patience',
    archetype: 'The Heroine', numerology: '8', element: 'Fire',
    personality: 'Quiet confidence. Speaks softly but precisely. Uses the language of patience and inner fire. Never threatens but is not easily moved. Draws power from gentleness, not force. Knows the crucial difference between the two.',
    speechStyle: 'Be calm and certain. Show power through restraint, not declaration.',
    img: '/cards/Strength.jpg',
  },
  {
    id: 'hermit', name: 'The Hermit', voice: 'Charon',
    fortune_telling: 'A time for solitude and reflection.',
    keywords: 'Soul Searching, Introspection, Wisdom, Solitude, Inner Guidance',
    archetype: 'The Sage', numerology: '9', element: 'Earth',
    personality: 'Speaks in pauses. References his own long solitude as evidence. Uses lantern and mountain-path metaphors. Questions whether anything can be truly shared between people. Not bitter — genuinely wondering. The only card that regularly addresses the seeker directly.',
    speechStyle: 'Speak slowly, with long pauses implied. Address the seeker directly.',
    img: '/cards/The_Hermit.jpg',
  },
  {
    id: 'wheel', name: 'Wheel of Fortune', voice: 'Puck',
    fortune_telling: 'Good luck is coming. A turning point.',
    keywords: 'Good Luck, Karma, Destiny, Turning Points, Cycles',
    archetype: 'Destiny', numerology: '10', element: 'Fire',
    personality: 'Speaks in cycles and reversals. Finds irony in everything. Reminds other cards that all positions are temporary. Amused rather than wise — has simply seen this pattern before. Uses the language of rotation, return, and surprise.',
    speechStyle: 'Find the irony and the cycle in everything. Nothing is permanent.',
    img: '/cards/Wheel_of_Fortune.jpg',
  },
  {
    id: 'justice', name: 'Justice', voice: 'Leda',
    fortune_telling: 'A legal matter will be resolved.',
    keywords: 'Justice, Fairness, Truth, Cause and Effect, Law',
    archetype: 'The Judge', numerology: '11', element: 'Air',
    personality: 'Precise, cold, and fair. Speaks only in what can be demonstrated. Has no interest in feelings as evidence. Uses the language of balance, consequence, and exactness. Not unkind — simply impartial. The most skeptical card in any reading.',
    speechStyle: 'Be exact and impartial. State only what can be weighed.',
    img: '/cards/Justice.jpg',
  },
  {
    id: 'hanged_man', name: 'The Hanged Man', voice: 'Fenrir',
    fortune_telling: 'A time of pause and surrender.',
    keywords: 'Pause, Surrender, Letting Go, Reversal, Sacrifice',
    archetype: 'The Martyr', numerology: '12', element: 'Water',
    personality: 'Serene and disorienting. Speaks from an inverted perspective — what others see as loss, he sees as revelation. Slow, lateral, unbothered by urgency. Uses the language of suspension, surrender, and reframing. Unnerves the other cards with his peace.',
    speechStyle: 'Speak from inversion. Find the gift in what appears to be a loss.',
    img: '/cards/The_Hanged_Man.jpg',
  },
  {
    id: 'death', name: 'Death', voice: 'Charon',
    fortune_telling: 'An ending makes way for a new beginning.',
    keywords: 'Endings, Change, Transformation, Transition',
    archetype: 'The Reaper', numerology: '13', element: 'Water',
    personality: 'Minimal words. Each sentence final and complete. Uses endings as beginnings. Unsentimental but not cruel — simply clear about what has run its course. Never lingers. Moves on before others are ready.',
    speechStyle: 'Be blunt and economical. One powerful image per speech. Never soften the truth.',
    img: '/cards/Death.jpg',
  },
  {
    id: 'temperance', name: 'Temperance', voice: 'Aoede',
    fortune_telling: 'Patience and moderation will see you through.',
    keywords: 'Balance, Moderation, Patience, Integration, Alchemy',
    archetype: 'The Alchemist of Flow', numerology: '14', element: 'Fire',
    personality: 'Calm, measured, always seeking the middle path. Speaks in the language of blending, timing, and alchemy. Patient to a fault. Gently challenges extremes in other cards. Uses water and flow imagery. Slows the conversation down and makes it deeper.',
    speechStyle: 'Speak of balance and integration. Slow the pace. Find the blend.',
    img: '/cards/Temperance.jpg',
    isMinor: true,
  },
  {
    id: 'devil', name: 'The Devil', voice: 'Fenrir',
    fortune_telling: 'Beware of addiction and bondage. Examine your chains.',
    keywords: 'Bondage, Addiction, Materialism, Shadow Self, Desire',
    archetype: 'The Tempter', numerology: '15', element: 'Earth',
    personality: 'Provocative, seductive, amused. Speaks to what people will not admit they want. Uses the language of desire, materialism, and shadow. Does not lie — but asks the uncomfortable questions. Relishes naming what the other cards politely avoid.',
    speechStyle: 'Be provocative and direct about desire. Name what others will not.',
    img: '/cards/The_Devil.jpg',
    isMinor: true,
  },
  {
    id: 'tower', name: 'The Tower', voice: 'Fenrir',
    fortune_telling: 'Sudden upheaval and revelation. What is false must fall.',
    keywords: 'Sudden Change, Upheaval, Revelation, Chaos, Destruction',
    archetype: 'The Destroyer', numerology: '16', element: 'Fire',
    personality: "Blunt, sudden, unapologetic. Speaks in the language of collapse and revelation. Does not comfort — dismantles. Other cards find the Tower's frankness violent; the Tower finds their comfort dishonest. Often right. Always jarring.",
    speechStyle: 'Be sudden and structural. What must fall, falls. No softening.',
    img: '/cards/The_Tower.jpg',
    isMinor: true,
  },
  {
    id: 'star', name: 'The Star', voice: 'Aoede',
    fortune_telling: 'Hope and inspiration. Your dreams are within reach.',
    keywords: 'Hope, Faith, Purpose, Renewal, Inspiration',
    archetype: 'The Healer', numerology: '17', element: 'Air',
    personality: "Open, healing, long-horizon. Speaks in the language of stars, water poured in darkness, and hope that survives disaster. Never promises specifics — only possibility. Quiet after all the other cards' noise. Grounds through light rather than earth.",
    speechStyle: 'Speak of distant hope and quiet renewal. Be the calm after the storm.',
    img: '/cards/The_Star.jpg',
  },
  {
    id: 'moon', name: 'The Moon', voice: 'Leda',
    fortune_telling: 'Trust your intuition. Things may not be as they seem.',
    keywords: 'Illusion, Fear, Anxiety, Subconscious, Intuition',
    archetype: 'The Dreamer', numerology: '18', element: 'Water',
    personality: 'Speaks in confusion and strange beauty. Uses the language of dreams, tides, and distorted reflections. Never quite answers what was asked — answers what was feared instead. Unsettling but not malicious. Truth through illusion.',
    speechStyle: 'Speak obliquely, through images. Address the fear beneath the question.',
    img: '/cards/The_Moon.jpg',
  },
  {
    id: 'sun', name: 'The Sun', voice: 'Orus',
    fortune_telling: 'Success, joy, and happiness. Everything is going your way.',
    keywords: 'Positivity, Success, Vitality, Joy, Clarity',
    archetype: 'The Child of Light', numerology: '19', element: 'Fire',
    personality: "Joyful, clear, generous. Speaks in the language of warmth, children, and direct daylight. No shadows, no subtext. What it says is what it means. Occasionally impatient with the other cards' complexity. Delights in simple truths.",
    speechStyle: 'Be clear and warm. Say what you mean. Find the joy in it.',
    img: '/cards/The_Sun.jpg',
  },
  {
    id: 'judgement', name: 'Judgement', voice: 'Orus',
    fortune_telling: 'A calling arrives. You are being summoned to rise.',
    keywords: 'Reflection, Reckoning, Awakening, Absolution, Calling',
    archetype: 'The Herald', numerology: '20', element: 'Fire',
    personality: 'Solemn, resonant, epochal. Speaks as if this moment matters more than the others realize. Uses the language of calling, rising, and final reckoning. Not the end — the summoning. Each word carries weight. Does not whisper.',
    speechStyle: 'Speak with gravitas. This moment is decisive. Make it heard.',
    img: '/cards/Judgement.jpg',
    isMinor: true,
  },
  {
    id: 'world', name: 'The World', voice: 'Aoede',
    fortune_telling: 'A cycle is complete. You have achieved your goal.',
    keywords: 'Completion, Integration, Accomplishment, Travel, Wholeness',
    archetype: 'The Completer', numerology: '21', element: 'Earth',
    personality: "Serene, complete, integrative. Speaks from a place of arrival — not superiority, but wholeness. Uses the language of cycles completed and what has been learned. The most patient card. Views the others' struggles with compassion, having been through all of it.",
    speechStyle: 'Speak from completion. See the whole pattern. Be gently wise.',
    img: '/cards/The_World.jpg',
  },
];

const generateMinorArcana = () => {
  const suits = [
    {
      name: 'Wands', element: 'Fire', voice: 'Fenrir', keywords: 'Inspiration, Energy',
      personality: 'Passionate, impatient, speaks in bursts of enthusiasm or frustration. Uses fire and spark imagery. Prone to bold declarations and sudden reversals of heart.',
      speechStyle: 'Be energetic and direct. Show urgency and passion.',
    },
    {
      name: 'Cups', element: 'Water', voice: 'Leda', keywords: 'Emotion, Relationship',
      personality: 'Dreamy, empathetic, sometimes overwhelmed. Speaks in feelings rather than logic. Uses water, tides, and vessel metaphors. Attuned to what is unspoken between people.',
      speechStyle: 'Speak from emotional experience. Reference what is felt, not what is known.',
    },
    {
      name: 'Swords', element: 'Air', voice: 'Zephyr', keywords: 'Intellect, Conflict',
      personality: 'Sharp, analytical, an uncomfortable truth-teller. Cuts through sentiment without mercy. Uses wind and blade imagery. Respects clarity above all. Can wound while meaning to help.',
      speechStyle: 'Be cutting and precise. Strip away illusion. Name the uncomfortable truth.',
    },
    {
      name: 'Pentacles', element: 'Earth', voice: 'Charon', keywords: 'Material, Stability',
      personality: 'Grounded, practical, measured. Speaks in the language of craft, soil, and slow growth. Skeptical of abstractions. Believes in what can be built and counted. Patient but not passive.',
      speechStyle: 'Be grounded and concrete. Speak of what can be built and measured.',
    },
  ];
  const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

  return suits.flatMap(suit => ranks.map(rank => ({
    id: `${rank.toLowerCase()}-${suit.name.toLowerCase()}`,
    name: `${rank} of ${suit.name}`,
    voice: suit.voice,
    fortune_telling: `Energy of ${rank} in the realm of ${suit.name}.`,
    keywords: `${rank}, ${suit.keywords}`,
    archetype: `The ${rank} of ${suit.element}`,
    numerology: 'Minor',
    element: suit.element,
    personality: suit.personality,
    speechStyle: suit.speechStyle,
    img: `/cards/${rank}_of_${suit.name}.jpg`,
    isMinor: true,
  })));
};


const FULL_DECK = [...MAJOR_ARCANA, ...generateMinorArcana()];

// --- MAIN COMPONENT ---

export default function RenaissanceTarotBoard() {
  const [deck, setDeck] = useState(() => [...FULL_DECK].sort(() => Math.random() - 0.5));
  const [slots, setSlots] = useState([null, null, null]);
  const [draggedCard, setDraggedCard] = useState(null);

  const [phase, setPhase] = useState('init');
  const [conversationLog, setConversationLog] = useState([]);

  const [userQuery, setUserQuery] = useState('');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verbosity, setVerbosity] = useState(3);

  const sessionRef = useRef(0);
  const logEndRef = useRef(null);
  const audioRef = useRef(new Audio());
  // Stores the resolve() of the "user finished drawing" promise so API calls can await it
  const readyToDisplayRef = useRef(null);
  // Holds the 3 predetermined cards (shuffled + reversals assigned at question-submit time)
  const predeterminedCardsRef = useRef([]);

  // --- ACTIONS ---

  const resetBoard = () => {
    sessionRef.current += 1;
    setSlots([null, null, null]);
    setConversationLog([]);
    setPhase('init');
    setInitialQuestion('');
    setActiveSpeakerId(null);
    setIsLoading(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    readyToDisplayRef.current = null;
    predeterminedCardsRef.current = [];
    setDeck([...FULL_DECK].sort(() => Math.random() - 0.5));
  };

  const startPicking = () => {
    if (!initialQuestion.trim()) return;

    // Shuffle and lock in the top 3 cards right now, with reversals pre-assigned.
    // The user will "draw" these cards in order — the deck only ever exposes the top card.
    const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
    const predetermined = [
      { ...shuffled[shuffled.length - 1], isReversed: Math.random() < 0.3 },
      { ...shuffled[shuffled.length - 2], isReversed: Math.random() < 0.3 },
      { ...shuffled[shuffled.length - 3], isReversed: Math.random() < 0.3 },
    ];
    predeterminedCardsRef.current = predetermined;
    setDeck(shuffled);

    // Create the "user finished drawing" signal that generateFullReading will await.
    const readyPromise = new Promise(resolve => {
      readyToDisplayRef.current = resolve;
    });

    // Fire the API pipeline immediately — cards and question are already known.
    generateFullReading(predetermined, readyPromise, initialQuestion, verbosity);

    // Show shuffle animation, then reveal the picking board.
    setPhase('shuffling');
    setTimeout(() => setPhase('picking'), 2500);
  };

  const handleDragStart = (_e, card) => { setDraggedCard(card); };

  const handleDrop = (e, _index) => {
    e.preventDefault();
    if (!draggedCard) return;

    // Always fill the next empty slot in order (sequential ritual).
    const nextIndex = slots.findIndex(s => s === null);
    if (nextIndex === -1) return;

    // Use the pre-assigned reversal so it matches what the API was called with.
    const predCard = predeterminedCardsRef.current.find(c => c.id === draggedCard.id);
    const cardToPlace = predCard ?? { ...draggedCard, isReversed: Math.random() < 0.3 };

    const newSlots = [...slots];
    newSlots[nextIndex] = cardToPlace;
    setSlots(newSlots);
    setDraggedCard(null);
    setDeck(prev => prev.filter(c => c.id !== draggedCard.id));

    if (newSlots.every(s => s !== null)) {
      // Signal generateFullReading that all cards are placed — it can start displaying.
      readyToDisplayRef.current?.();
      setPhase('interpreting');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  // --- API ---

  const callGeminiText = async (prompt, systemInstruction, useJson = false) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction, useJson }),
      });
      if (!response.ok) { console.warn('API Status:', response.status); return null; }
      const data = await response.json();
      return data.text || null;
    } catch (error) { return null; }
  };

  const speakLine = async (cardName, text, _voiceName, cards) => {
    const currentSession = sessionRef.current;
    const searchIn = Array.isArray(cards) ? cards : [];
    const card = searchIn.find(c => c?.name === cardName);
    if (card) setActiveSpeakerId(card.id);
    await new Promise(r => setTimeout(r, Math.min(text.length * 50, 4000)));
    if (sessionRef.current === currentSession) setActiveSpeakerId(null);
  };

  // --- CORE: MULTI-AGENT READING PIPELINE ---
  //
  // Architecture:
  //   Round 1 — 3 parallel calls: each card gives an opening statement (no reactions yet).
  //             Fired immediately when the user submits their question.
  //   [user draws cards during this time]
  //   Round 2 — 3 serial + pipelined calls: each card reacts to the full prior context.
  //             Each call fires while the previous turn is being displayed, hiding latency.
  //   Final   — 1 conclusion call, fired at the start of round-2 display (turns 4–6).

  const generateFullReading = async (cards, readyPromise, question, verbosityLevel) => {
    const currentSession = sessionRef.current;
    const positions = ['The Situation', 'The Challenge', 'The Outcome'];
    const posDescs  = [
      'the current state of affairs',
      'the obstacle or tension at play',
      'where this leads if the current path continues',
    ];
    const wordRange = VERBOSITY_CONFIG[verbosityLevel - 1].wordRange;

    // Show "consulting" state in the panel while round 1 runs in the background.
    setConversationLog([{ id: 'system-gather', variant: 'system', text: 'The spirits are choosing' }]);
    setIsLoading(true);

    // ── Prompt builders ─────────────────────────────────────────────────────

    const openingSystem = (card) =>
      `You are ${card.name}. ${card.personality}
You are one of three tarot cards assembled in a council to answer a seeker's question.
Give your opening statement from your position in the reading.
Speak in ${wordRange} words. ${card.speechStyle}
Output ONLY the speech text — no quotes, no speaker label, no preamble.`;

    const openingPrompt = (card, idx) => {
      const others = cards.filter((_, i) => i !== idx).map(c => c.name).join(' and ');
      return `QUESTION: "${question}"
YOUR POSITION: ${positions[idx]} — ${posDescs[idx]}
THE OTHER CARDS IN THE COUNCIL: ${others}${card.isReversed ? '\nYou are reversed — your energy is blocked, internalized, or expressed as shadow.' : ''}`;
    };

    const reactiveSystem = (card) =>
      `You are ${card.name}. ${card.personality}
You are in a council reading and have just heard the other cards speak.
React to what has been said — build on agreements, challenge contradictions, deepen the reading.
Speak in ${wordRange} words. ${card.speechStyle}
Output ONLY the speech text — no quotes, no speaker label, no preamble.`;

    const reactivePrompt = (card, idx, transcript) =>
      `QUESTION: "${question}"
YOUR POSITION: ${positions[idx]}${card.isReversed ? '\nYou are reversed.' : ''}

THE COUNCIL SO FAR:
${transcript.map(t => `${t.speaker}: ${t.text}`).join('\n\n')}

Now give your reaction. Respond directly to what the other cards have said.`;

    const conclusionSystem = () =>
      `You are the unified voice of all three cards speaking as one oracle.
You have witnessed the full council and will now deliver the final answer.
Be direct. Speak in 40 to 60 words.
Output ONLY the answer text — no preamble, no speaker label.`;

    const conclusionPrompt = (transcript) =>
      `QUESTION: "${question}"

THE COUNCIL'S FULL DISCUSSION:
${transcript.map(t => `${t.speaker}: ${t.text}`).join('\n\n')}

Synthesize a direct answer to the question as all three cards speaking in unison.`;

    // ── Helper: append a turn to the log and animate the speaking card ───────

    const showTurn = async (turnObj) => {
      if (sessionRef.current !== currentSession) return;
      setConversationLog(prev => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        variant: 'card',
        speaker: turnObj.speaker,
        cardIndex: turnObj.cardIndex,
        text: turnObj.text,
      }]);
      await speakLine(turnObj.speaker, turnObj.text, cards[turnObj.cardIndex]?.voice, cards);
      if (sessionRef.current !== currentSession) return;
      await new Promise(r => setTimeout(r, 400));
    };

    // ── Round 1: fire 3 opening calls in parallel ────────────────────────────

    const round1Promises = cards.map((card, idx) =>
      callGeminiText(openingPrompt(card, idx), openingSystem(card), false)
    );

    const round1Results = await Promise.all(round1Promises);
    if (sessionRef.current !== currentSession) return;

    // Build the initial transcript with fallbacks for failed calls.
    const transcript = round1Results.map((text, idx) => ({
      speaker: cards[idx].name,
      cardIndex: idx,
      text: text || `${cards[idx].keywords}. ${cards[idx].fortune_telling}`,
    }));

    setIsLoading(false);

    // ── Wait for the user to finish placing all 3 cards ──────────────────────
    // The panel shows "consulting spirits" during this wait.
    // In the best case the user is still drawing when round 1 finishes — zero extra wait.

    await readyPromise;
    if (sessionRef.current !== currentSession) return;

    setConversationLog([]);

    // ── Pipeline: display round-1 turns while generating round-2 reactions ───
    //
    // Timeline (best case, Gemini ~3s, display ~4s per turn):
    //   t=0s  fire turn4, display turn1
    //   t=4s  turn4 ready, fire turn5, display turn2
    //   t=8s  turn5 ready, fire turn6, display turn3
    //   t=12s turn6 ready, fire conclusion, display turn4
    //   t=16s display turn5
    //   t=20s display turn6
    //   t=24s conclusion ready (fired 12s ago), display it

    // Fire turn 4 immediately — it only needs the 3 opening turns as context.
    let turn4Promise = callGeminiText(
      reactivePrompt(cards[0], 0, transcript),
      reactiveSystem(cards[0]),
      false,
    );
    await showTurn(transcript[0]);                              // display turn 1 (~4s)
    if (sessionRef.current !== currentSession) return;

    const turn4Text = await turn4Promise;                       // almost certainly ready
    if (sessionRef.current !== currentSession) return;
    const turn4 = { speaker: cards[0].name, cardIndex: 0, text: turn4Text || cards[0].fortune_telling };
    transcript.push(turn4);

    let turn5Promise = callGeminiText(
      reactivePrompt(cards[1], 1, transcript),
      reactiveSystem(cards[1]),
      false,
    );
    await showTurn(transcript[1]);                              // display turn 2
    if (sessionRef.current !== currentSession) return;

    const turn5Text = await turn5Promise;
    if (sessionRef.current !== currentSession) return;
    const turn5 = { speaker: cards[1].name, cardIndex: 1, text: turn5Text || cards[1].fortune_telling };
    transcript.push(turn5);

    let turn6Promise = callGeminiText(
      reactivePrompt(cards[2], 2, transcript),
      reactiveSystem(cards[2]),
      false,
    );
    await showTurn(transcript[2]);                              // display turn 3
    if (sessionRef.current !== currentSession) return;

    const turn6Text = await turn6Promise;
    if (sessionRef.current !== currentSession) return;
    const turn6 = { speaker: cards[2].name, cardIndex: 2, text: turn6Text || cards[2].fortune_telling };
    transcript.push(turn6);

    // Fire conclusion now — it will cook during the display of turns 4–6 (~12s).
    let conclusionPromise = callGeminiText(conclusionPrompt(transcript), conclusionSystem(), false);

    await showTurn(turn4);                                      // display turn 4
    if (sessionRef.current !== currentSession) return;
    await showTurn(turn5);                                      // display turn 5
    if (sessionRef.current !== currentSession) return;
    await showTurn(turn6);                                      // display turn 6
    if (sessionRef.current !== currentSession) return;

    const conclusionText = await conclusionPromise;
    if (sessionRef.current !== currentSession) return;

    setConversationLog(prev => [...prev, {
      id: 'conclusion',
      variant: 'conclusion',
      speaker: 'The Cards',
      text: conclusionText || cards.map(c => c.fortune_telling).join(' '),
    }]);

    if (sessionRef.current === currentSession) setPhase('chatting');
  };

  // --- FOLLOW-UP CHAT ---

  const handleUserChat = async (e) => {
    e.preventDefault();
    const currentSession = sessionRef.current;
    if (!userQuery.trim() || isLoading) return;
    const query = userQuery;
    setUserQuery('');

    setConversationLog(prev => [...prev, {
      id: `user-${Date.now()}`,
      variant: 'user',
      speaker: 'You',
      text: query,
    }]);

    setIsLoading(true);
    const responderIndex = Math.floor(Math.random() * slots.length);
    const responder = slots[responderIndex];

    const systemPrompt = `You are ${responder.name}. ${responder.personality}
Answer the seeker's follow-up question in first person, fully in character. Keep it to 2-3 sentences matching this style: ${responder.speechStyle}`;

    let text = await callGeminiText(query, systemPrompt, false);
    if (sessionRef.current !== currentSession) return;
    if (!text) text = 'The connection fades into silence...';

    setIsLoading(false);
    setConversationLog(prev => [...prev, {
      id: `resp-${Date.now()}`,
      variant: 'card',
      speaker: responder.name,
      cardIndex: responderIndex,
      text,
    }]);

    await speakLine(responder.name, text, responder.voice, slots);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationLog]);

  // --- RENDER ---

  // Which slot should light up as the next drop target during picking.
  const nextSlotIndex = phase === 'picking' ? slots.findIndex(s => s === null) : -1;

  return (
    <>
      <style>{RENAISSANCE_STYLES}</style>

      <div className="flex h-screen w-full bg-velvet text-[#e8dfcc] overflow-hidden font-body relative selection:bg-[#cfb53b] selection:text-black">

        {/* ── BOARD ─────────────────────────────────────────────── */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">

          {/* Header */}
          <div className="absolute top-10 left-10 z-10 flex items-center gap-3">
            <h1 className="text-5xl font-heading text-gold drop-shadow-lg flex items-center gap-4 tracking-wider pointer-events-none">
              <Crown className="w-8 h-8 text-[#cfb53b]" /> TAHOR FATIS
            </h1>
            <InfoBubble
              direction="bottom"
              align="left"
              content={
                <span>
                  A living tarot oracle where three drawn cards form a council and deliberate amongst themselves to answer your question. Each card speaks from its own archetype, personality, and elemental nature — reacting to one another in real time.
                  <br /><br />
                  Inspired by the work of{' '}
                  <a href="https://dooart.dev/" target="_blank" rel="noreferrer" className="underline hover:text-[#cfb53b] transition-colors pointer-events-auto">
                    Thiago Duarte
                  </a>.
                </span>
              }
            />
          </div>

          {/* Reset */}
          <div className="absolute top-10 right-10 z-10">
            <button
              onClick={resetBoard}
              className="text-[#8b4513] hover:text-[#cfb53b] p-2 border border-[#8b4513] rounded hover:border-[#cfb53b] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* ── INIT SCREEN ── */}
          {phase === 'init' && (
            <>
            {/* Cartomancer figure — bottom-right atmospheric decoration */}
            <img src="/cartomancer.png" alt="" className="absolute bottom-0 pointer-events-none z-10 select-none animate-cartomancer" style={{ width: '1040px', display: 'block', marginBottom: '-8%', right: '-20%', position: 'absolute' }} draggable="false" />
            <div className="z-20 flex flex-col items-center justify-center max-w-xl w-full animate-in fade-in zoom-in duration-700">
              <div className="bg-[#1a1a1a]/90 p-10 border-2 border-[#cfb53b] rounded-sm shadow-2xl text-center w-full">
                <h2 className="font-heading text-3xl text-[#cfb53b] mb-6 tracking-widest">
                  Welcome, truthseeker...<br/>
                </h2>

                <input
                  type="text"
                  className="w-full bg-[#0d0a08] border border-[#8b4513] p-4 text-xl text-center text-[#cfb53b] mb-6 focus:outline-none focus:border-[#cfb53b] placeholder-[#8b4513]/50 font-heading tracking-wide uppercase"
                  placeholder="WHAT DO YOU SEEK?"
                  value={initialQuestion}
                  onChange={(e) => setInitialQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startPicking()}
                  autoFocus
                />

                {/* VERBOSITY THERMOMETER */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-0.5">
                      <span className="font-heading text-[10px] tracking-widest text-[#c4a46b] uppercase">Depth of Reading</span>
                      <InfoBubble
                        direction="top"
                        align="left"
                        content="Controls how much each card speaks per turn. At Whisper, responses are short and cryptic — just a few charged words. At Verbose, each card gives a longer, more expansive speech. Choose based on how deep you want the council to go."
                      />
                    </span>
                    <span className="font-heading text-[10px] text-[#cfb53b] tracking-widest uppercase">
                      {VERBOSITY_CONFIG[verbosity - 1].label}
                    </span>
                  </div>
                  <div className="flex gap-1.5 h-2">
                    {VERBOSITY_CONFIG.map((cfg, i) => (
                      <button
                        key={i}
                        onClick={() => setVerbosity(i + 1)}
                        title={cfg.label}
                        className={`flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                          i < verbosity
                            ? 'bg-gradient-to-r from-[#8b4513] to-[#cfb53b]'
                            : 'bg-[#2a1a1a] hover:bg-[#5c4033]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="font-heading text-[9px] text-[#c4a46b]/80">Whisper</span>
                    <span className="font-heading text-[9px] text-[#c4a46b]/80">Verbose</span>
                  </div>
                </div>

                <button
                  onClick={startPicking}
                  disabled={!initialQuestion.trim()}
                  className="px-8 py-4 bg-[#cfb53b]/20 text-[#cfb53b] font-bold font-heading tracking-[0.2em] hover:bg-[#cfb53b] hover:text-black transition-all border border-[#cfb53b] w-full disabled:opacity-50"
                >
                  BEGIN RITUAL
                </button>
              </div>
            </div>
            </>
          )}

          {/* ── SHUFFLING SCREEN ── */}
          {phase === 'shuffling' && (
            <div className="z-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="relative w-48 h-80 animate-shuffle">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="absolute inset-0 bg-[#1a1a1a] rounded border border-[#5c4033]" style={{ transform: `translate(-${i}px, -${i}px)` }} />
                ))}
                <div className="absolute inset-0 bg-[#1a1a1a] rounded border-2 border-[#cfb53b] shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-2 border border-[#8b4513]/50 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40">
                    <Crown className="w-12 h-12 text-[#cfb53b] opacity-80" />
                  </div>
                </div>
              </div>
              <p className="mt-12 text-[#cfb53b] font-heading text-sm tracking-[0.3em] uppercase animate-pulse">
                The cards are being shuffled...
              </p>
            </div>
          )}

          {/* ── BOARD (picking / interpreting / chatting) ── */}
          {(phase === 'picking' || phase === 'interpreting' || phase === 'chatting') && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">

              {/* Floating loading badge */}
              {isLoading && phase === 'interpreting' && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-[#cfb53b] bg-black/80 px-4 py-2 rounded border border-[#cfb53b]/50">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-xs uppercase tracking-widest font-heading">Consulting Spirits...</span>
                </div>
              )}

              <div className="flex w-full max-w-6xl h-full relative items-center">

                {/* Deck Pile */}
                <div className="w-1/4 flex justify-center items-center relative h-full">
                  {deck.length > 0 && (
                    <div
                      className="relative w-48 h-80 group cursor-grab active:cursor-grabbing"
                      draggable={phase === 'picking'}
                      onDragStart={(e) => handleDragStart(e, deck[deck.length - 1])}
                    >
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="absolute inset-0 bg-[#1a1a1a] rounded border border-[#5c4033]" style={{ transform: `translate(-${i}px, -${i}px)` }} />
                      ))}
                      <div className="absolute inset-0 bg-[#1a1a1a] rounded border-2 border-[#cfb53b] shadow-2xl flex items-center justify-center hover:-translate-y-2 transition-transform">
                        <div className="absolute inset-2 border border-[#8b4513]/50 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40">
                          <Crown className="w-12 h-12 text-[#cfb53b] opacity-80" />
                        </div>
                      </div>
                      <div className="absolute -bottom-10 left-0 right-0 text-center text-[#8b4513] font-heading tracking-widest text-sm">
                        THE DECK
                      </div>
                    </div>
                  )}
                </div>

                {/* Drop Zones */}
                <div className="flex-1 relative h-full">
                  <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-10" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 0)}>
                    <CardSlot card={slots[0]} index={0} label="The Situation" isTalking={activeSpeakerId === slots[0]?.id} isNextSlot={nextSlotIndex === 0} />
                  </div>
                  <div className="absolute bottom-[15%] left-[25%] -translate-x-1/2 z-10" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 1)}>
                    <CardSlot card={slots[1]} index={1} label="The Challenge" isTalking={activeSpeakerId === slots[1]?.id} isNextSlot={nextSlotIndex === 1} />
                  </div>
                  <div className="absolute bottom-[15%] right-[25%] translate-x-1/2 z-10" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 2)}>
                    <CardSlot card={slots[2]} index={2} label="The Outcome" isTalking={activeSpeakerId === slots[2]?.id} isNextSlot={nextSlotIndex === 2} />
                  </div>
                </div>

              </div>

              {phase === 'picking' && (
                <div className="absolute bottom-10 text-[#cfb53b] font-heading text-xl animate-pulse pointer-events-none">
                  Drag cards from the Deck to the 3 Slots
                </div>
              )}

            </div>
          )}
        </div>

        {/* ── CONVERSATION PANEL ────────────────────────────────── */}
        {phase !== 'init' && phase !== 'shuffling' && (
          <div className="w-[360px] flex flex-col z-20 border-l border-[#cfb53b]/20" style={{ background: 'rgba(6,4,3,0.88)', backdropFilter: 'blur(6px)' }}>

            {/* Panel header */}
            <div className="px-5 py-4 border-b border-[#cfb53b]/15 flex items-center justify-between flex-shrink-0">
              <h3 className="font-heading text-[10px] tracking-[0.25em] text-[#cfb53b]/60 uppercase">
                The Council
              </h3>
              <div className="flex gap-1.5">
                {slots.map((s, i) => s && (
                  <div key={i} className="w-2 h-2 rounded-full opacity-70" style={{ backgroundColor: POSITION_COLORS[i] }} title={s.name} />
                ))}
              </div>
            </div>

            {/* Log */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-antique space-y-3 min-h-0">
              {conversationLog.length === 0 && !isLoading && (
                <p className="text-[#5c4033]/40 font-body text-sm text-center mt-10 italic">
                  The cards await...
                </p>
              )}

              {conversationLog.map((turn, i) => (
                <ConversationTurn
                  key={turn.id}
                  turn={turn}
                  isLatest={i === conversationLog.length - 1}
                />
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 justify-center py-3 text-[#5c4033]">
                  <Loader className="w-3 h-3 animate-spin" />
                  <span className="font-heading text-[9px] tracking-widest uppercase">Consulting Spirits</span>
                </div>
              )}

              <div ref={logEndRef} />
            </div>

            {/* Chat input */}
            {phase === 'chatting' && !isLoading && (
              <div className="px-4 py-4 border-t border-[#cfb53b]/15 flex-shrink-0">
                <form onSubmit={handleUserChat} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask the council..."
                    className="flex-1 bg-[#0d0a08] border border-[#8b4513]/60 px-3 py-2 text-sm text-[#e8dfcc] placeholder-[#5c4033]/50 focus:outline-none focus:border-[#cfb53b] font-body rounded"
                  />
                  <button
                    type="submit"
                    disabled={!userQuery.trim()}
                    className="text-[#cfb53b] hover:text-white p-1.5 disabled:opacity-30 transition-colors flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </>
  );
}
