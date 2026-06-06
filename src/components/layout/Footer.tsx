'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Film, Tv, Star, Shuffle, Compass, ExternalLink, Mail } from 'lucide-react';

// Custom SVG social icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);


const GENRE_LINKS = [
  { name: 'Horror', href: '/discover?genre=27' },
  { name: 'Thriller', href: '/discover?genre=53' },
  { name: 'Action', href: '/discover?genre=28' },
  { name: 'Sci-Fi', href: '/discover?genre=878' },
  { name: 'Crime', href: '/discover?genre=80' },
  { name: 'Romance', href: '/discover?genre=10749' },
  { name: 'Mystery', href: '/discover?genre=9648' },
  { name: 'Fantasy', href: '/discover?genre=14' },
  { name: 'Animation', href: '/discover?genre=16' },
  { name: 'Comedy', href: '/discover?genre=35' },
  { name: 'Drama', href: '/discover?genre=18' },
  { name: 'Documentary', href: '/discover?genre=99' },
];

const FRANCHISE_LINKS = [
  { name: 'Marvel Universe', href: '/search?q=marvel' },
  { name: 'DC Universe', href: '/search?q=dc' },
  { name: 'Star Wars', href: '/search?q=star+wars' },
  { name: 'Harry Potter', href: '/search?q=harry+potter' },
  { name: 'Lord of the Rings', href: '/search?q=lord+of+the+rings' },
  { name: 'Fast & Furious', href: '/search?q=fast+furious' },
  { name: 'Mission Impossible', href: '/search?q=mission+impossible' },
  { name: 'James Bond', href: '/search?q=james+bond' },
];

const TRENDING_SEARCHES = [
  'Best Horror Movies 2024', 'Mind-bending Films', 'Best Anime Series',
  'Underrated Gems', 'Oscar Winners', 'A24 Movies', 'Netflix Originals',
  'Best Cinematography',
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cinema-black to-black opacity-95" />
      <div className="absolute inset-0 bg-red-glow-gradient opacity-20" />

      {/* Film strip top decoration */}
      <div className="relative border-b border-cinema-red/20 py-1 flex gap-2 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-8 h-4 border border-cinema-red/20 rounded-sm flex-shrink-0 bg-cinema-red/5" />
        ))}
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #1A0000, #0A0A0A)',
                  border: '1.5px solid rgba(229,9,20,0.5)',
                  boxShadow: '0 0 20px rgba(229,9,20,0.2)',
                }}
              >
                <span
                  className="text-base font-black"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    background: 'linear-gradient(135deg, #FF1A1A, #E50914)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 6px rgba(229,9,20,0.8))',
                  }}
                >
                  TFC
                </span>
              </div>
              <div>
                <div
                  className="text-xl font-black tracking-wide"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    background: 'linear-gradient(135deg, #fff, #C8C8D0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  The<span style={{ WebkitTextFillColor: '#E50914' }}>Final</span>Cut
                </div>
                <div className="text-xs text-cinema-silver tracking-widest">CINEMA REDEFINED</div>
              </div>
            </Link>

            <p className="text-cinema-silver text-sm leading-relaxed mb-6">
              The ultimate destination for true film lovers. Discover, rate, and explore cinema like never before with AI-powered recommendations and deep analytics.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { Icon: TwitterIcon, href: '#', label: 'Twitter' },
                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                { Icon: YouTubeIcon, href: '#', label: 'YouTube' },
                { Icon: GitHubIcon, href: '#', label: 'GitHub' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-cinema-silver hover:text-cinema-red hover:border-cinema-red/40 transition-all duration-200"
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>


          {/* Genres */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <Film className="w-4 h-4 text-cinema-red" />
              Browse Genres
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {GENRE_LINKS.map((genre) => (
                <Link
                  key={genre.name}
                  href={genre.href}
                  className="text-cinema-silver hover:text-cinema-red text-sm transition-colors duration-200 py-0.5"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Franchises */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <Star className="w-4 h-4 text-cinema-red" />
              Popular Franchises
            </h3>
            <div className="flex flex-col gap-2">
              {FRANCHISE_LINKS.map((franchise) => (
                <Link
                  key={franchise.name}
                  href={franchise.href}
                  className="text-cinema-silver hover:text-cinema-red text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cinema-red/40 group-hover:bg-cinema-red transition-colors" />
                  {franchise.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter + Trending */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cinema-red" />
              Stay Updated
            </h3>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mb-8"
            >
              <p className="text-cinema-silver text-sm mb-3">Get weekly picks delivered to your inbox</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-cinema-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-cinema-silver/50 outline-none focus:border-cinema-red/50 transition-colors"
                />
                <button type="submit" className="btn-cinema text-sm py-2 px-4">
                  Join
                </button>
              </div>
            </form>

            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cinema-red" />
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="text-xs px-3 py-1.5 glass rounded-full text-cinema-silver hover:text-cinema-red hover:border-cinema-red/30 transition-all"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-cinema-silver text-xs">
            <span>© 2024 TheFinalCut. All rights reserved.</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-cinema-red transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-cinema-red transition-colors">Terms</Link>
          </div>

          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cinema-silver text-xs hover:text-cinema-red transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Powered by TMDB
          </a>
        </div>
      </div>
    </footer>
  );
}
