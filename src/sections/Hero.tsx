import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AuspiciousCloud from '../components/AuspiciousCloud';

import heroScene from '../assets/images/hero int.png';

gsap.registerPlugin(ScrollTrigger);

/* Cloud placement: [top, left/right, width, variant, enterFromX, enterFromY, parallaxRate, floatDur] */
const CLOUDS = [
  { top: '4%',  right: '6%',  width: 300, variant: 'wide'    as const, from: { x: 480, y: -140 }, rate: -260, dur: 5.2 },
  { top: '22%', left: '30%',  width: 210, variant: 'compact' as const, from: { x: -420, y: -60 }, rate: -170, dur: 4.1 },
  { top: '38%', left: '12%',  width: 170, variant: 'compact' as const, from: { x: -360, y: 40 },  rate: -110, dur: 4.8 },
  { top: '12%', left: '52%',  width: 150, variant: 'compact' as const, from: { x: 260, y: -110 }, rate: -210, dur: 3.7 },
  { top: '26%', right: '10%', width: 150, variant: 'compact' as const, from: { x: 380, y: -40 },  rate: -80,  dur: 5.6 },
];

/* Falling plum-blossom petals */
const PETALS = Array.from({ length: 10 }, (_, i) => ({
  left: 4 + ((i * 47) % 60),
  size: 7 + ((i * 13) % 9),
  delay: (i * 1.7) % 9,
  dur: 7 + ((i * 29) % 6),
  sway: 26 + ((i * 17) % 40),
}));

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------- entrance choreography ---------- */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // scene slowly settles from a gentle zoom
      tl.fromTo(
        '.hero-scene',
        { scale: 1.12 },
        { scale: 1, duration: 2.6, ease: 'power2.out' },
        0
      );

      // clouds glide in from every side, one after another
      gsap.utils.toArray<HTMLElement>('.cloud-parallax').forEach((el, i) => {
        const c = CLOUDS[i];
        tl.fromTo(
          el,
          { x: c.from.x, y: c.from.y, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 2.1, ease: 'power2.out' },
          0.25 + i * 0.22
        );
      });

      // title letters rise one by one
      tl.fromTo(
        '.hero-letter',
        { yPercent: 118, rotate: 5 },
        { yPercent: 0, rotate: 0, duration: 1, stagger: 0.07, ease: 'power4.out' },
        0.9
      );

      // subtitle + buttons
      tl.fromTo(
        '.hero-sub',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        1.5
      );
      tl.fromTo(
        '.hero-cta',
        { y: 24, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.6)' },
        1.7
      );

      // glass traveller card floats up
      tl.fromTo(
        '.hero-card',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1 },
        2
      );

      /* ---------- endless drifting ---------- */
      gsap.utils.toArray<HTMLElement>('.cloud-float').forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? 16 : -14,
          x: i % 2 === 0 ? 10 : -12,
          rotation: i % 2 === 0 ? 1.4 : -1.2,
          duration: CLOUDS[i].dur,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      });

      /* ---------- petals fall forever ---------- */
      gsap.utils.toArray<HTMLElement>('.petal').forEach((el, i) => {
        const p = PETALS[i];
        gsap.fromTo(
          el,
          { y: -40, x: 0, rotation: 0, opacity: 0 },
          {
            y: () => window.innerHeight + 80,
            x: p.sway,
            rotation: 300 + i * 40,
            opacity: 1,
            duration: p.dur,
            delay: p.delay,
            repeat: -1,
            ease: 'none',
            modifiers: {
              // soft sine sway while falling
              x: gsap.utils.unitize((x) => parseFloat(x) + Math.sin(Date.now() / 900 + i) * 14),
            },
          }
        );
      });

      /* ---------- scroll parallax: layered depth ---------- */
      gsap.utils.toArray<HTMLElement>('.cloud-parallax').forEach((el, i) => {
        gsap.to(el, {
          y: CLOUDS[i].rate,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
      });
      gsap.to('.hero-copy', {
        y: 140,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.hero-scene', {
        y: 90,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.hero-card', {
        y: -110,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-white">
      {/* illustrated scene */}
      <img
        src={heroScene}
        alt="International students walking toward Chinese pagodas"
        className="hero-scene absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      {/* legibility veil on the left for small screens */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent md:from-white/40 md:via-transparent" />

      {/* drifting clouds */}
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="cloud-parallax pointer-events-none absolute will-change-transform"
          style={{ top: c.top, left: c.left, right: c.right }}
        >
          <div className="cloud-float will-change-transform">
            <AuspiciousCloud
              variant={c.variant}
              style={{
                width: c.width,
                filter: 'drop-shadow(0 14px 22px rgba(110,6,9,0.28))',
              }}
            />
          </div>
        </div>
      ))}

      {/* plum-blossom petals */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal pointer-events-none absolute top-0 block rounded-[60%_40%_55%_45%] bg-[#c01418] opacity-0"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.82 }}
        />
      ))}

      {/* copy — sits exactly where the artwork's title lived */}
      <div className="hero-copy relative z-10 flex h-full flex-col justify-start px-6 pt-[13vh] sm:px-12 md:pt-[11vh] lg:px-20">
        <div className="hero-letter inline-block overflow-hidden pb-1 align-bottom will-change-transform">
          
        </div>
        <p className="hero-sub mt-5 max-w-md text-[15px] leading-relaxed text-neutral-700 opacity-0">
          Wander through five thousand years of wonder — from misty pagodas and
          vermilion temples to lantern-lit streets. Your journey across China
          begins with a single step.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#experiences"
            className="hero-cta rounded-full bg-[#b30d10] px-7 py-3.5 text-sm font-semibold text-white opacity-0 shadow-[0_14px_34px_-8px_rgba(179,13,16,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8f0407]"
          >
            Start Exploring
          </a>
          <a
            href="#journeys"
            className="hero-cta glass-light rounded-full px-7 py-3.5 text-sm font-semibold text-[#8f0407] opacity-0 transition-all duration-300 hover:-translate-y-0.5"
          >
            View Journeys
          </a>
        </div>
      </div>

      {/* floating glass traveller card */}
      <aside className="hero-card glass absolute bottom-10 left-6 z-10 hidden w-[320px] rounded-3xl p-5 opacity-0 shadow-[0_24px_60px_-16px_rgba(60,2,3,0.55)] sm:left-12 md:block lg:left-20">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#c01418] text-sm font-bold text-white ring-2 ring-white/50">
            梅
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Mei Lin</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">Traveller · Beijing</p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-white/85">
          “I came for the temples and stayed for the mornings — steam rising
          from bamboo baskets, red walls glowing at dawn. China feels endless.”
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </aside>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="glass flex h-11 w-7 items-start justify-center rounded-full pt-2">
          <span className="scroll-dot block h-2 w-1 rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
}