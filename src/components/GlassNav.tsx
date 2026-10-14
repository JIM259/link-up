import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import linkupLogo from '../assets/images/linkup-logo.png';

const links = ['Destinations', 'Culture', 'Journeys', 'Stories'];

export default function GlassNav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.4 }
    );
  }, []);

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 opacity-0">
      <nav className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full py-2.5 pl-6 pr-2.5 shadow-[0_18px_50px_-12px_rgba(120,4,6,0.35)]">
        {/* wordmark */}
        <a href="#" className="flex items-center gap-2.5">
          <img src={linkupLogo} alt="Link Up" className="h-8 w-auto object-contain" />
        </a>

        {/* links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l}>
              <a
                href="#"
                className="group relative text-[13px] font-medium tracking-wide text-white/85 transition-colors hover:text-white"
              >
                {l}
                <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#journeys"
          className="rounded-full bg-white/95 px-5 py-2 text-[13px] font-semibold text-[#9d0b0e] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)]"
        >
          Plan Your Trip
        </a>
      </nav>
    </header>
  );
}
