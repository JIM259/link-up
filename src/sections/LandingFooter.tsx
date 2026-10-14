import linkupLogo from '../assets/images/linkup_3d_handshake_1790500150159.jpg';

export default function LandingFooter() {
  return (
    <footer className="bg-[#2a0203] py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img src={linkupLogo} alt="Link Up" className="h-8 w-auto object-contain" />
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
          {['Destinations', 'Culture', 'Journeys', 'Stories', 'Contact'].map((l) => (
            <li key={l}>
              <a href="#" className="transition-colors hover:text-white">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/40">© 2026 LINK UP. All rights reserved.</p>
      </div>
    </footer>
  );
}