import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AuspiciousCloud from '../components/AuspiciousCloud';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: 'Iconic Landmarks',
    body: 'The Great Wall at sunrise, the Forbidden City in gold light, terraces carved into clouds.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-7 w-7">
        <path d="M4 20h16M6 20v-6h12v6M8 14V9h8v5M10 9V5h4v4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 5V3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Timeless Culture',
    body: 'Calligraphy, tea ceremony, opera and festivals — living traditions older than empires.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-7 w-7">
        <path d="M12 3c-3 3-3 6 0 8 3-2 3-5 0-8Z" strokeLinejoin="round" />
        <path d="M7 13h10l-1.5 8h-7L7 13Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Modern Cities',
    body: "Shanghai's skyline, Shenzhen's speed, Chengdu's ease — futures built beside ancient walls.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-7 w-7">
        <path d="M4 21V8l5-4v17M9 21V11l6-3v13M15 21v-8l5 3v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Culinary Journey',
    body: 'Eight great cuisines, night markets that never sleep, dumplings folded by hand at dawn.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-7 w-7">
        <path d="M5 12a7 7 0 0 1 14 0H5ZM7 12v2a5 5 0 0 0 10 0v-2M9 5c1 1 1 2 0 3M13 4c1 1 1 2 0 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feat-head > *',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        }
      );
      gsap.fromTo(
        '.feat-card',
        { y: 90, opacity: 0, rotateX: -8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.feat-grid', start: 'top 80%' },
        }
      );
      // watermark clouds drift at their own rate while scrolling through
      gsap.utils.toArray<HTMLElement>('.feat-cloud').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60 + i * 30 },
          {
            y: -80 - i * 40,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experiences"
      ref={root}
      className="relative overflow-hidden bg-gradient-to-b from-[#8f0407] via-[#a50c0f] to-[#7a0305] py-28"
    >
      {/* giant watermark clouds */}
      <div className="feat-cloud pointer-events-none absolute -right-20 top-10 opacity-[0.07]">
        <AuspiciousCloud variant="wide" style={{ width: 560 }} />
      </div>
      <div className="feat-cloud pointer-events-none absolute -left-24 bottom-16 opacity-[0.05]">
        <AuspiciousCloud variant="wide" style={{ width: 480 }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="feat-head max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
            <span className="h-px w-9 bg-white/50" /> Experiences
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl">
            Every corner tells <span className="text-[#ffc9c9]">a story</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Four paths into the Middle Kingdom — each one layered, each one
            unforgettable.
          </p>
        </div>

        <div className="feat-grid mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="feat-card glass group rounded-3xl p-7 shadow-[0_26px_60px_-20px_rgba(40,1,2,0.6)] transition-transform duration-500 will-change-transform hover:-translate-y-2"
            >
              <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {f.icon}
              </span>
              <h3 className="mt-6 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/70">{f.body}</p>
              <span className="mt-6 block h-px w-full bg-gradient-to-r from-white/40 to-transparent" />
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors group-hover:text-white">
                Explore
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}