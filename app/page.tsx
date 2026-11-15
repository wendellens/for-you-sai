'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Heart, Sparkles, LockKeyhole, MailOpen, ArrowDown, Music2, VolumeX, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

type Memory = { src: string; title: string; note: string; date: string };

const memories: Memory[] = [
  { src: '/images/memory-02.jpg', title: 'Under one umbrella', note: 'A little sunshine, a little adventure, and good company.', date: 'A day to remember' },
  { src: '/images/memory-03.jpg', title: 'The three of us', note: 'Some memories are even sweeter when shared.', date: 'Together is a lovely place' },
  { src: '/images/memory-04.jpg', title: 'School-day smiles', note: 'A snapshot of the days we will always remember.', date: 'Little moments' },
  { src: '/images/memory-05.jpg', title: 'Mirror moments', note: 'A candid little moment worth keeping close.', date: 'Just being us' },
  { src: '/images/memory-06.jpg', title: 'The laugh we remember', note: 'Even blurry moments can hold the clearest happiness.', date: 'The silly ones' },
  { src: '/images/memory-07.jpg', title: 'Bestie energy', note: 'Different personalities, one lovely friendship.', date: 'A friendship to treasure' },
  { src: '/images/memory-08.jpg', title: 'Movie-day memories', note: 'A little movie, a lot of laughter, and people who make ordinary days special.', date: 'A night out together' },
  { src: '/images/memory-09.jpg', title: 'A favorite selfie', note: 'A simple photo, a lovely day, and a memory worth keeping.', date: 'A little moment together' },
];

// The greeting ("Hi, Sai!") is the heading above the letter, so the body starts after it.
// Wording is unchanged from the original; it is only split into paragraphs.
const letterParagraphs = [
  `This is the first time na mag susulat ako ng letter para sayo hahahah, pero love you, teh! HAPPY BIRTHDAY, Sai!`,
  `Thank you for being a good sister and best friend sakin. I'm rooting for your success and happiness. Make sure ingatan mo puso mo, and dahil sa kabutihan ng kalooban mo napapasaya mo yong mga tao nasa paligid mo, sa kabutihan ng iyong puso nakakatulong ka din sa iba.`,
  `Sana hindi mo makalimutan na lahat ng challenges na nararanasan mo ngayon are big breakthroughs for your future.`,
];
const letterLength = letterParagraphs.reduce((n, p) => n + p.length, 0);
const UNLOCK_KEY = 'for-sai-unlocked';

export default function Home() {
  const [birthday, setBirthday] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [bloomed, setBloomed] = useState(false);
  const [letterPhase, setLetterPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [typedCount, setTypedCount] = useState(0);
  const [letterH, setLetterH] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const paperRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const activeMemory = activeIndex === null ? null : memories[activeIndex];
  const lightboxOpen = activeIndex !== null;

  // Remember the unlock for this browser tab so a refresh doesn't send her back to the gate.
  useEffect(() => {
    try { if (sessionStorage.getItem(UNLOCK_KEY) === '1') setUnlocked(true); } catch { /* storage unavailable */ }
    setHydrated(true);
  }, []);

  // Sequence the physical paper movement: flap first, then the letter slides out
  // and unfolds. Closing reverses the sequence before the envelope is reset.
  useEffect(() => {
    if (letterPhase !== 'opening' && letterPhase !== 'closing') return;
    const timer = window.setTimeout(() => {
      if (letterPhase === 'opening') setLetterPhase('open');
      if (letterPhase === 'closing') {
        setLetterPhase('closed');
        setTypedCount(0);
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [letterPhase]);

  // Type the letter out (instantly if she prefers reduced motion).
  useEffect(() => {
    if (letterPhase !== 'open' || typedCount >= letterLength) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedCount(letterLength);
      return;
    }
    const timer = window.setTimeout(() => setTypedCount(c => Math.min(c + 2, letterLength)), 22);
    return () => window.clearTimeout(timer);
  }, [letterPhase, typedCount]);

  // The paper's final height drives the wrapper height (via --letter-h), so the layout never
  // overlaps the next section whatever the screen width. Measured after the unfold finishes.
  useEffect(() => {
    if (letterPhase !== 'open') { setLetterH(null); return; }
    const el = paperRef.current;
    if (!el) return;
    let observer: ResizeObserver | undefined;
    const timer = window.setTimeout(() => {
      setLetterH(el.offsetHeight);
      observer = new ResizeObserver(() => setLetterH(el.offsetHeight));
      observer.observe(el);
    }, 950);
    return () => { window.clearTimeout(timer); observer?.disconnect(); };
  }, [letterPhase]);

  // Lightbox: Escape / arrow keys, scroll lock, focus handling.
  const closeMemory = useCallback(() => {
    setActiveIndex(null);
    lastFocusRef.current?.focus();
  }, []);
  const stepMemory = useCallback((delta: number) => {
    setActiveIndex(i => (i === null ? i : (i + delta + memories.length) % memories.length));
  }, []);
  function openMemory(i: number) {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveIndex(i);
  }
  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMemory();
      else if (e.key === 'ArrowLeft') stepMemory(-1);
      else if (e.key === 'ArrowRight') stepMemory(1);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, closeMemory, stepMemory]);

  function startMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.28;
    void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
  }

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (birthday === '2004-11-16') {
      setUnlocked(true);
      setError('');
      try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch { /* storage unavailable */ }
      startMusic();
    } else {
      setError('Hmm, not quite! Try the birthday date again. ♡');
    }
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      startMusic();
    }
  }

  let remaining = typedCount;
  const shownParagraphs = letterParagraphs.map(p => {
    const shown = p.slice(0, Math.max(0, remaining));
    remaining -= p.length;
    return shown;
  });
  const typingIndex = shownParagraphs.findIndex((shown, i) => shown.length < letterParagraphs[i].length);
  const showCaret = letterPhase === 'open' && typedCount < letterLength;

  return <main>
    <audio ref={audioRef} src="/audio/soft-piano-original.mp3" loop preload="none" />
    <div className="petal-field" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 9) * -1.9}s`, animationDuration: `${13 + (i % 7) * 2}s`, opacity: 0.22 + (i % 4) * 0.09, transform: `scale(${0.65 + (i % 4) * 0.18})` }} />)}
    </div>

    <AnimatePresence mode="wait">
      {!hydrated ? null : !unlocked ? <motion.section className="gate" key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.035 }}>
        <div className="gate-glow" />
        <motion.div className="gate-flower" initial={{ opacity: 0, y: 35, scale: .92, rotate: -5 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} transition={{ duration: 1.25, ease: 'easeOut' }}>
          <Image src="/images/rose-bouquet.webp" alt="A realistic bouquet of pink roses" width={1214} height={1295} priority className="bouquet-art bouquet-art-gate" />
          <span className="gate-flower-glint">✧</span>
        </motion.div>
        <motion.div className="gate-card" initial={{ y: 35, opacity: 0, filter: 'blur(5px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} transition={{ delay: .35, duration: .85 }}>
          <span className="eyebrow"><Sparkles size={14}/> A LITTLE BIRTHDAY SURPRISE</span>
          <h1>For you,<br/><em>Sai.</em></h1>
          <p className="gate-copy">A tiny garden of memories, flowers, and words from someone who loves you.</p>
          <form onSubmit={unlock} className="birthday-form">
            <label htmlFor="birthday">WHEN IS YOUR BIRTHDATE?</label>
            <div className="date-input"><LockKeyhole size={17}/><input id="birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} required /></div>
            <button className="primary-btn gate-submit" type="submit">Open your surprise <Heart size={16} fill="currentColor"/></button>
            {error && <p className="error" role="alert">{error}</p>}
          </form>
          <small className="gate-foot">made with love, just for you ♡</small>
        </motion.div>
        <div className="gate-bottom">A LITTLE GARDEN MADE JUST FOR YOU <span>✧</span></div>
      </motion.section> : <motion.div key="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9 }}>
        <header className="topbar"><a href="#top" className="brand"><Flower2 size={20}/> for you, sai</a><span>♡ NOVEMBER 16, 2026 ♡</span><button className="music-toggle" onClick={toggleMusic} aria-label={musicOn ? 'Turn music off' : 'Turn music on'}>{musicOn ? <Music2 size={15}/> : <VolumeX size={15}/>}<span>{musicOn ? 'MUSIC ON' : 'MUSIC OFF'}</span></button></header>
        <section className="hero section-wrap" id="top">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14}/> TODAY IS ALL ABOUT YOU</span>
            <h1>Happy Birthday,<br/><em>beautiful Sai.</em></h1>
            <p>May your days bloom with the same kindness and happiness you bring into everyone else’s lives.</p>
            <a className="text-link" href="#letter">A little note for you <ArrowDown size={16}/></a>
            <div className="hero-stamp"><span>16</span><small>NOV<br/>2004</small></div>
          </div>
          <div className="hero-visual">
            <div className="portrait-backdrop" />
            <motion.div className="main-photo" initial={{ rotate: -5, y: 30, opacity: 0 }} animate={{ rotate: -2, y: 0, opacity: 1 }} transition={{ delay: .25, duration: .85 }}>
              <Image src="/images/sai-main.jpg" alt="Sai, the birthday girl, in her birthday portrait" fill priority sizes="(max-width: 700px) 80vw, 420px" />
              <span className="photo-caption">our birthday girl ♡</span>
            </motion.div>
            <motion.div className="second-photo" initial={{ rotate: 8, x: 30, opacity: 0 }} animate={{ rotate: 5, x: 0, opacity: 1 }} transition={{ delay: .5 }}>
              <Image src="/images/memory-01.jpg" alt="A happy memory with friends" fill sizes="180px" />
            </motion.div>
            <motion.div className="hero-flower" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .75, duration: .9 }}><Image src="/images/rose-bouquet.webp" alt="A bouquet of pink roses for Sai" width={1214} height={1295} className="bouquet-art bouquet-art-hero" /></motion.div>
            <span className="doodle-heart">♡</span>
          </div>
        </section>

        <section className="bouquet-section section-wrap">
          <div className="bouquet-card">
            <div className="bouquet-text"><span className="eyebrow">A FLOWER FOR YOU</span><h2>Because you deserve<br/><em>all the flowers.</em></h2><p>A little bouquet that never fades. Just a reminder that you are appreciated, loved, and celebrated.</p><button className="outline-btn" onClick={() => setBloomed(v => !v)}><Flower2 size={17}/>{bloomed ? 'Let the flowers rest' : 'Make the flowers bloom'}</button></div>
            <motion.div className={`bouquet-large ${bloomed ? 'bloomed' : ''}`} animate={bloomed ? { scale: [1, 1.07, 1.035], rotate: [0, 2, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 1.1 }}>
              <Image src="/images/rose-bouquet.webp" alt="A pink rose bouquet with a satin ribbon" width={1214} height={1295} className="bouquet-art bouquet-art-large" />
              {bloomed && <div className="bloom-burst" aria-hidden="true">{Array.from({length: 12}).map((_,i)=><i key={i} style={{'--angle':`${i*30}deg`} as React.CSSProperties}>✿</i>)}</div>}
              <span className="bouquet-ribbon">for you ♡</span>
            </motion.div>
            {bloomed && <motion.div className="bloom-message" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>A whole garden, just for you! ✿</motion.div>}
          </div>
        </section>

        <section className="memories-section section-wrap" id="memories">
          <div className="section-heading"><span className="eyebrow">LITTLE MOMENTS, BIG MEMORIES</span><h2>A scrapbook of <em>us.</em></h2><p>Tap any photograph to see the memory a little closer.</p></div>
          <div className="memory-grid">{memories.map((m, i) => <motion.article className={`memory-card memory-${i + 1}`} key={m.src} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: (i % 3) * .1 }} whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}>
            <button type="button" className="memory-open" onClick={() => openMemory(i)} aria-label={`View ${m.title}`}><Image src={m.src} alt={m.title} fill sizes="(max-width: 700px) 90vw, 360px"/><span className="memory-zoom"><ZoomIn size={15}/> View memory</span></button>
            <div className="memory-caption"><span>{String(i + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')} · {m.date.toUpperCase()}</span><h3>{m.title}</h3><p>{m.note}</p></div><span className="memory-heart">♡</span>
          </motion.article>)}</div>
        </section>

        <section className="letter-section section-wrap" id="letter">
          <div className="letter-intro"><span className="eyebrow">A LETTER FROM THE HEART</span><h2>Words just <em>for you.</em></h2><p>Take your time. This one’s special.</p></div>

          <div className={`envelope-wrap envelope-${letterPhase}`} style={letterH ? ({ '--letter-h': `${letterH}px` } as React.CSSProperties) : undefined}>
            <div className="envelope" aria-label="A sealed pink paper envelope">
              <div className="envelope-paper-edge" />
              <div className="envelope-flap" />
              <div className="envelope-front">
                <span className="wax-seal"><Heart fill="currentColor" size={17}/></span>
                <span>to Sai, with love</span>
              </div>
            </div>

            <article ref={paperRef} className="letter-paper" aria-hidden={letterPhase === 'closed'}>
              <button
                type="button"
                className="letter-close"
                onClick={() => setLetterPhase('closing')}
                aria-label="Fold the letter and put it back in the envelope"
                tabIndex={letterPhase === 'open' ? 0 : -1}
              ><X size={16}/> Fold & close</button>
              <div className="letter-paper-inner">
                <div className="letter-flower">✿</div>
                <span className="letter-date">NOVEMBER 16, 2026</span>
                <h3>Hi, Sai! ♡</h3>
                <span className="sr-only">{letterParagraphs.join(' ')}</span>
                {/* Each paragraph holds its full text invisibly (so the layout never jumps while typing)
                    with the typed portion on top. Tap anywhere on the letter to skip the typing. */}
                <div className="letter-body" aria-hidden="true" onClick={() => setTypedCount(letterLength)}>
                  {letterParagraphs.map((p, i) => <p className="letter-p" key={i}>
                    <span className="letter-ghost">{p}</span>
                    <span className="letter-typed">{shownParagraphs[i]}{showCaret && i === typingIndex && <span className="typing-caret">▍</span>}</span>
                  </p>)}
                </div>
                <div className="letter-sign">With love, always <span>♡</span></div>
              </div>
            </article>

            <button
              className="primary-btn envelope-btn"
              onClick={() => {
                if (letterPhase === 'closed') setLetterPhase('opening');
                else if (letterPhase === 'open') setLetterPhase('closing');
              }}
              disabled={letterPhase === 'opening' || letterPhase === 'closing'}
              aria-expanded={letterPhase === 'open'}
            >
              {letterPhase === 'closed' ? 'Break the seal & open' : letterPhase === 'open' ? 'Fold letter & close' : letterPhase === 'opening' ? 'Opening your letter…' : 'Putting the letter away…'}
              <MailOpen size={17}/>
            </button>
            <p className="envelope-hint" aria-live="polite">
              {letterPhase === 'closed' ? 'A little note, sealed with love.' : letterPhase === 'opening' ? 'Carefully opening your letter…' : letterPhase === 'closing' ? 'Folding it safely back inside…' : 'Your letter is open. Take your time. ♡'}
            </p>
          </div>
        </section>

        <section className="finale"><div className="finale-flower">✿</div><span className="eyebrow">A WISH FOR YOUR NEW CHAPTER</span><h2>Keep blooming,<br/><em>Sai.</em></h2><p>May this year be gentle with your heart and generous with your dreams.</p><div className="finale-hearts">♡　✧　♡</div><span className="finale-sign">made with love, just for you.</span><a className="back-to-top" href="#top">Back to the beginning ↑</a></section>
        <footer>© 2026 · A little birthday garden for Sai <Heart size={12} fill="currentColor"/></footer>
      </motion.div>}
    </AnimatePresence>

    <AnimatePresence>{activeMemory && <motion.div className="memory-lightbox" role="dialog" aria-modal="true" aria-label={activeMemory.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMemory}>
      <motion.div
        className="lightbox-card"
        initial={{ scale: .92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 12 }}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(dx) > 50) stepMemory(dx < 0 ? 1 : -1);
        }}
      >
        <button ref={closeBtnRef} className="lightbox-close" onClick={closeMemory} aria-label="Close photograph"><X size={20}/></button>
        <div className="lightbox-image">
          <Image src={activeMemory.src} alt={activeMemory.title} fill sizes="(max-width: 700px) 90vw, 700px"/>
          <button className="lightbox-nav lightbox-prev" onClick={() => stepMemory(-1)} aria-label="Previous photograph"><ChevronLeft size={22}/></button>
          <button className="lightbox-nav lightbox-next" onClick={() => stepMemory(1)} aria-label="Next photograph"><ChevronRight size={22}/></button>
        </div>
        <div className="lightbox-caption"><span>{activeMemory.date}</span><h3>{activeMemory.title}</h3><p>{activeMemory.note}</p><small className="lightbox-count" aria-live="polite">{(activeIndex ?? 0) + 1} / {memories.length}</small></div>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </main>;
}
