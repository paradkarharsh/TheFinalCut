'use client';

import { motion } from 'framer-motion';
import { GoodnessMeter as GoodnessMeterType } from '@/types';
import { getScoreColor } from '@/lib/utils';

interface GoodnessMeterProps {
  data: GoodnessMeterType;
}

const METRICS = [
  { key: 'entertainmentValue' as const, label: 'Entertainment Value', emoji: '🎉' },
  { key: 'bingeworthiness' as const, label: 'Binge-Worthiness', emoji: '📺' },
  { key: 'emotionalIntensity' as const, label: 'Emotional Intensity', emoji: '💔' },
  { key: 'slowBurnFactor' as const, label: 'Slow Burn Factor', emoji: '🔥' },
  { key: 'complexity' as const, label: 'Complexity', emoji: '🧩' },
  { key: 'plotTwistLevel' as const, label: 'Plot Twist Level', emoji: '🌀' },
  { key: 'casualFriendliness' as const, label: 'Casual Viewer Friendly', emoji: '😊' },
  { key: 'cinemaLoverScore' as const, label: 'Cinema Lover Score', emoji: '🎬' },
];

function Gauge({ value, size = 120 }: { value: number; size?: number }) {
  const color = getScoreColor(value);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const startAngle = -210;
  const endAngle = 30;
  const totalArc = endAngle - startAngle;
  const arcEnd = startAngle + totalArc * (value / 100);

  const polar = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  const describeArc = (from: number, to: number) => {
    const s = polar(from, r);
    const e = polar(to, r);
    const largeArc = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.75}`}>
      {/* Background arc */}
      <path d={describeArc(startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.08} strokeLinecap="round" />
      {/* Value arc */}
      <motion.path
        d={describeArc(startAngle, arcEnd)}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.08}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {/* Center text */}
      <text x={cx} y={cy + 2} textAnchor="middle" fill={color} fontSize={size * 0.22} fontWeight="bold" fontFamily="Outfit, sans-serif">
        {value}
      </text>
      <text x={cx} y={cy + size * 0.18} textAnchor="middle" fill="#A0A0A8" fontSize={size * 0.1} fontFamily="Inter, sans-serif">
        / 100
      </text>
    </svg>
  );
}

export default function GoodnessMeterComponent({ data }: GoodnessMeterProps) {
  const overallScore = Math.round(
    (data.entertainmentValue + data.bingeworthiness + data.cinemaLoverScore) / 3
  );

  return (
    <div className="space-y-6">
      {/* Main gauge */}
      <div className="flex flex-col items-center gap-2">
        <Gauge value={overallScore} size={160} />
        <div className="text-center">
          <p className="text-white font-bold text-lg">Goodness Score</p>
          <p className="text-cinema-silver text-sm">AI Predicted Quality</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <p className="text-cinema-red text-xs font-semibold">{data.aiConfidence}% AI Confidence</p>
          </div>
        </div>
      </div>

      {/* Metric gauges grid */}
      <div className="grid grid-cols-2 gap-4">
        {METRICS.map(({ key, label, emoji }) => {
          const val = data[key];
          const color = getScoreColor(val);
          return (
            <div key={key} className="glass rounded-xl p-4 text-center">
              <span className="text-2xl mb-2 block">{emoji}</span>
              <div className="text-2xl font-black mb-1" style={{ color, fontFamily: 'Outfit, sans-serif' }}>
                {val}
                <span className="text-sm font-normal text-cinema-silver">/100</span>
              </div>
              <p className="text-cinema-silver text-xs leading-tight">{label}</p>
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
