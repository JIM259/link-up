import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: '壹',
    title: 'Choose Your Route',
    body: 'From the silk road to southern rivers — pick the thread that pulls you.',
  },
  {
    n: '贰',
    title: 'Craft Your Journey',
    body: 'Local experts shape every day around your pace, taste and curiosity.',
  },
  {
    n: '叁',
    title: 'Travel Like a Local',
    body: 'Tea with a calligrapher, dawn tai chi, dinner in a hutong courtyard.',
  },
];

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.journey-step',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.journey-steps', start: 'top 78%' },
        }
      );
      gsap.fromTo(
        '.quote-panel',
        { y: 80, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.quote-panel', start: 'top 82%' },
        }
      );
      gsap.fromTo(
        '.journey-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.journey-steps', start: 'top 78%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journeys" ref={root} className="relative bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#b30d10]">
            <span className="h-px w-9 bg-[#b30d10]" /> Your Journey
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-wide text-neutral-900 sm:text-5xl">
            Three steps to <span className="text-[#b30d10]">the East</span>
          </h2>
        </div>

        <div className="journey-steps relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* connecting brush line */}
          <span className="journey-line absolute left-0 top-7 hidden h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-[#b30d10] via-[#e05252] to-[#f3c1c1] md:block" />
          {STEPS.map((s) => (
            <div key={s.n} className="journey-step relative">
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-[#b30d10] font-display text-xl text-white shadow-[0_14px_30px_-8px_rgba(179,13,16,0.55)] ring-4 ring-white">
                {s.n}
              </span>
              <h3 className="mt-6 text-lg font-bold text-neutral-900">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">{s.body}</p>
            </div>
          ))}
        </div>

        {/* glass quote band */}
        <div className="quote-panel relative mt-24 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8f0407] to-[#c01418] p-10 sm:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0 2px, transparent 2px)',
              backgroundSize: '34px 34px',
            }}
          />
          <div className="glass relative mx-auto max-w-3xl rounded-3xl p-8 text-center sm:p-10">
            <p className="font-display text-2xl leading-snug tracking-wide text-white sm:text-3xl">
              “A journey of a thousand miles
              <br />
              begins with a single step.”
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Laozi · 老子
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
