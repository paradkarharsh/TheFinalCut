'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SPECIAL = [
  { title: '🧠 Mind-Bending Films', href: '/discover?list=mindbending', desc: 'Reality-twisting masterpieces', gradient: 'from-purple-900/40 to-blue-900/40' },
  { title: '💎 Hidden Gems', href: '/discover?list=hiddengems', desc: 'Under 10K ratings, over 7.0 score', gradient: 'from-green-900/40 to-teal-900/40' },
  { title: '🏆 Oscar Winners Hub', href: '/discover?list=oscar', desc: 'Academy Award™ laureates', gradient: 'from-yellow-900/40 to-amber-900/40' },
  { title: '🌙 Late Night Picks', href: '/discover?list=latenight', desc: 'Perfect for 2AM sessions', gradient: 'from-indigo-900/40 to-purple-900/40' },
  { title: '🔪 Darkest Films', href: '/discover?list=dark', desc: 'Not for the faint-hearted', gradient: 'from-red-950/60 to-black/60' },
  { title: '📼 Cult Classics Vault', href: '/discover?list=cult', desc: 'Timeless underground legends', gradient: 'from-orange-900/40 to-red-900/40' },
  { title: '🎨 Perfect Cinematography', href: '/discover?list=cinematography', desc: 'Visually stunning masterworks', gradient: 'from-cyan-900/40 to-blue-900/40' },
  { title: '🔄 Most Rewatchable', href: '/discover?list=rewatch', desc: 'You&apos;ll keep coming back', gradient: 'from-pink-900/40 to-rose-900/40' },
];

export default function SpecialSections() {
  return (
    <section className="px-4 sm:px-8 lg:px-16">
      <h2 className="section-title text-xl sm:text-2xl mb-6">✨ Curated Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPECIAL.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={section.href}
              className={`block p-6 rounded-2xl glass bg-gradient-to-br ${section.gradient} border border-white/10 hover:border-cinema-red/30 transition-all duration-300 group`}
            >
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-cinema-red transition-colors">
                {section.title}
              </h3>
              <p className="text-cinema-silver text-sm" dangerouslySetInnerHTML={{ __html: section.desc }} />
              <div className="flex items-center gap-1 mt-4 text-cinema-red text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
