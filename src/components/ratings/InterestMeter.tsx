'use client';

import { motion } from 'framer-motion';
import { InterestMeter } from '@/types';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';

interface InterestMeterProps {
  data: InterestMeter;
}

const GENRE_CONFIG: Record<keyof InterestMeter, { label: string; emoji: string; color: string }> = {
  horror: { label: 'Horror', emoji: '👻', color: '#8B0000' },
  thriller: { label: 'Thriller', emoji: '🔪', color: '#1A1A4E' },
  romance: { label: 'Romance', emoji: '❤️', color: '#C2185B' },
  mystery: { label: 'Mystery', emoji: '🔍', color: '#283593' },
  action: { label: 'Action', emoji: '💥', color: '#E65100' },
  scifi: { label: 'Sci-Fi', emoji: '🚀', color: '#006064' },
  comedy: { label: 'Comedy', emoji: '😂', color: '#F57F17' },
  drama: { label: 'Drama', emoji: '🎭', color: '#4A148C' },
  fantasy: { label: 'Fantasy', emoji: '🧙', color: '#1B5E20' },
  crime: { label: 'Crime', emoji: '🕵️', color: '#37474F' },
  animation: { label: 'Animation', emoji: '🎨', color: '#880E4F' },
  documentary: { label: 'Documentary', emoji: '📽️', color: '#01579B' },
};

export default function InterestMeterComponent({ data }: InterestMeterProps) {
  const radarData = (Object.keys(data) as (keyof InterestMeter)[]).map(key => ({
    genre: GENRE_CONFIG[key].label,
    value: data[key],
    fullMark: 100,
  }));

  const sorted = (Object.keys(data) as (keyof InterestMeter)[])
    .sort((a, b) => data[b] - data[a]);

  return (
    <div className="space-y-6">
      {/* Radar */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="genre"
              tick={{ fill: '#A0A0A8', fontSize: 10 }}
            />
            <Radar
              name="Interest"
              dataKey="value"
              stroke="#E50914"
              fill="#E50914"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {sorted.map((key, idx) => {
          const cfg = GENRE_CONFIG[key];
          const val = data[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-cinema-silver-light">
                  <span>{cfg.emoji}</span>
                  {cfg.label}
                </span>
                <span className="font-bold text-white">{val}%</span>
              </div>
              <div className="h-2 bg-white/08 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.06 }}
                  style={{
                    background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})`,
                    boxShadow: val > 70 ? `0 0 10px ${cfg.color}80` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
