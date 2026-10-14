import { useId } from 'react';

/**
 * Stylized Chinese auspicious cloud (祥云) drawn parametrically.
 * White puffs + inward spiral curls, matching the artwork's clouds.
 */

function spiral(cx: number, cy: number, r: number): string {
  return [
    `M ${cx + r} ${cy}`,
    `a ${r} ${r} 0 1 1 ${-2 * r} 0`,
    `a ${0.58 * r} ${0.58 * r} 0 1 0 ${1.16 * r} 0`,
    `a ${0.34 * r} ${0.34 * r} 0 1 1 ${-0.68 * r} 0`,
  ].join(' ');
}

type Puff = { cx: number; cy: number; r: number };

interface CloudProps {
  variant?: 'wide' | 'compact';
  className?: string;
  style?: React.CSSProperties;
}

export default function AuspiciousCloud({ variant = 'wide', className, style }: CloudProps) {
  const id = useId().replace(/:/g, '');

  const cfg =
    variant === 'wide'
      ? {
          viewBox: '0 0 260 140',
          base: { cx: 132, cy: 96, rx: 96, ry: 27 },
          puffs: [
            { cx: 78, cy: 70, r: 30 },
            { cx: 132, cy: 52, r: 39 },
            { cx: 188, cy: 72, r: 26 },
          ] as Puff[],
          spirals: [
            { cx: 78, cy: 66, r: 17 },
            { cx: 132, cy: 48, r: 22 },
            { cx: 188, cy: 68, r: 13 },
          ],
          tail: 'M 38 102 Q 14 106 9 126',
        }
      : {
          viewBox: '0 0 200 125',
          base: { cx: 100, cy: 88, rx: 72, ry: 22 },
          puffs: [
            { cx: 64, cy: 64, r: 24 },
            { cx: 104, cy: 46, r: 30 },
            { cx: 144, cy: 62, r: 20 },
          ] as Puff[],
          spirals: [
            { cx: 64, cy: 60, r: 13 },
            { cx: 104, cy: 42, r: 16 },
            { cx: 144, cy: 58, r: 10 },
          ],
          tail: 'M 32 94 Q 14 100 11 116',
        };

  return (
    <svg viewBox={cfg.viewBox} className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`cloudfill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f2f4f8" />
        </linearGradient>
      </defs>
      <g fill={`url(#cloudfill-${id})`}>
        <ellipse cx={cfg.base.cx} cy={cfg.base.cy} rx={cfg.base.rx} ry={cfg.base.ry} />
        {cfg.puffs.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
        ))}
      </g>
      {/* spiral curls */}
      <g fill="none" stroke="#dfe4ec" strokeWidth="2.5" strokeLinecap="round">
        {cfg.spirals.map((s, i) => (
          <path key={i} d={spiral(s.cx, s.cy, s.r)} />
        ))}
      </g>
      {/* trailing curl */}
      <path d={cfg.tail} fill="none" stroke="#f2f4f8" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
