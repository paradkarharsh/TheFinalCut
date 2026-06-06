'use client';

import { motion } from 'framer-motion';
import { CinematicRating } from '@/types';
import { getScoreColor } from '@/lib/utils';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  Tooltip
} from 'recharts';

interface CinematicRatingChartProps {
  rating: CinematicRating;
  title: string;
}

const METRIC_LABELS: Record<keyof CinematicRating, string> = {
  overall: 'Overall',
  story: 'Story',
  acting: 'Acting',
  cinematography: 'Cinematography',
  soundtrack: 'Soundtrack',
  emotionalImpact: 'Emotional Impact',
  rewatchValue: 'Rewatch Value',
  endingQuality: 'Ending Quality',
  characterDepth: 'Character Depth',
  suspenseMeter: 'Suspense',
  comedyMeter: 'Comedy',
  horrorMeter: 'Horror',
  romanceMeter: 'Romance',
  actionMeter: 'Action',
  mindfuckMeter: 'Mind F***',
  darkToneMeter: 'Dark Tone',
  violenceMeter: 'Violence',
};

const CORE_METRICS = ['story', 'acting', 'cinematography', 'soundtrack', 'emotionalImpact', 'rewatchValue', 'endingQuality', 'characterDepth'] as (keyof CinematicRating)[];
const METER_METRICS = ['suspenseMeter', 'comedyMeter', 'horrorMeter', 'romanceMeter', 'actionMeter', 'mindfuckMeter', 'darkToneMeter', 'violenceMeter'] as (keyof CinematicRating)[];

function ScoreBar({ label, value, emoji }: { label: string; value: number; emoji?: string }) {
  const color = getScoreColor(value);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-cinema-silver-light font-medium">
          {emoji && <span className="mr-1.5">{emoji}</span>}
          {label}
        </span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

export default function CinematicRatingChart({ rating, title }: CinematicRatingChartProps) {
  const radarData = CORE_METRICS.map(key => ({
    metric: METRIC_LABELS[key],
    value: rating[key],
    fullMark: 100,
  }));

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative w-28 h-28 flex-shrink-0"
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={getScoreColor(rating.overall)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - rating.overall / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${getScoreColor(rating.overall)})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black" style={{ color: getScoreColor(rating.overall) }}>
              {rating.overall}
            </span>
            <span className="text-cinema-silver text-xs">/ 100</span>
          </div>
        </motion.div>
        <div>
          <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
          <p className="text-cinema-silver text-sm">TFC Cinematic Rating</p>
          <p className="text-xs mt-2 px-3 py-1 rounded-full inline-block" style={{
            background: `${getScoreColor(rating.overall)}20`,
            color: getScoreColor(rating.overall),
            border: `1px solid ${getScoreColor(rating.overall)}40`
          }}>
            {rating.overall >= 85 ? '🏆 Masterpiece' : rating.overall >= 70 ? '⭐ Excellent' : rating.overall >= 55 ? '👍 Good' : '📊 Average'}
          </p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#A0A0A8', fontSize: 11 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#E50914"
              fill="#E50914"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: '#1A1A1A',
                border: '1px solid rgba(229,9,20,0.3)',
                borderRadius: '8px',
                color: '#F0F0F0',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Core Metrics bars */}
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Core Metrics</h4>
        <div className="space-y-3">
          {CORE_METRICS.map(key => (
            <ScoreBar key={key} label={METRIC_LABELS[key]} value={rating[key]} />
          ))}
        </div>
      </div>

      {/* Genre Meters */}
      <div>
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Genre Meters</h4>
        <div className="grid grid-cols-2 gap-4">
          {METER_METRICS.map(key => {
            const emojis: Record<string, string> = {
              suspenseMeter: '😱', comedyMeter: '😂', horrorMeter: '👻',
              romanceMeter: '❤️', actionMeter: '💥', mindfuckMeter: '🧠',
              darkToneMeter: '🌑', violenceMeter: '⚔️',
            };
            return (
              <ScoreBar key={key} label={METRIC_LABELS[key]} value={rating[key]} emoji={emojis[key]} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
