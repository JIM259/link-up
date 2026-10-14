import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { User } from '../types';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import Journey from '../sections/Journey';
import LandingFooter from '../sections/LandingFooter';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  currentUser: User | null;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    gsap.to('.scroll-dot', {
      y: 14,
      opacity: 0.2,
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (id && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { duration: 1.4 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-white font-body text-neutral-900 antialiased">
      {/* No GlassNav — Header.tsx provides the global nav */}
      <Hero />
      <Features />
      <Journey />
      <LandingFooter />
    </div>
  );
};