'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, Bell, User, BookMarked, Heart,
  Shuffle, Film, Tv, Compass, Star, ChevronDown, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Film },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/series', label: 'Series', icon: Tv },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/absolute-cinema', label: 'Absolute Cinema', icon: Star },
  { href: '/random', label: 'Random Pick', icon: Shuffle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { watchlist, favorites } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-dark border-b border-white/5 py-2 shadow-cinema'
            : 'bg-gradient-to-b from-black/80 to-transparent py-4'
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="The Final Cut"
                width={44}
                height={44}
                className="rounded-lg transition-all duration-300 group-hover:brightness-125"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(139, 30, 30, 0.3))',
                }}
                priority
              />
              <span
                className="text-lg font-black tracking-wide hidden sm:block"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  background: 'linear-gradient(135deg, #fff, #C8C8D0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                The<span style={{ WebkitTextFillColor: '#E50914' }}>Final</span>Cut
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-cinema-red bg-cinema-red/10'
                      : 'text-cinema-silver hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 glass rounded-xl px-3 py-2 overflow-hidden"
                  >
                    <Search className="w-4 h-4 text-cinema-silver flex-shrink-0" />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies, series..."
                      className="bg-transparent text-white text-sm outline-none flex-1 placeholder-cinema-silver/50"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-cinema-silver hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-lg text-cinema-silver hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Watchlist Count */}
              {user && (
                <Link
                  href="/profile?tab=watchlist"
                  className="relative p-2 rounded-lg text-cinema-silver hover:text-white hover:bg-white/5 transition-all"
                >
                  <BookMarked className="w-5 h-5" />
                  {watchlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cinema-red rounded-full text-xs flex items-center justify-center font-bold">
                      {watchlist.length > 9 ? '9+' : watchlist.length}
                    </span>
                  )}
                </Link>
              )}

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl glass transition-all hover:border-cinema-red/30"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-cinema-red/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-cinema-red" />
                      </div>
                    )}
                    <ChevronDown className={cn('w-3.5 h-3.5 text-cinema-silver transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl overflow-hidden border border-white/10 shadow-cinema"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-white font-semibold text-sm truncate">{user.displayName || 'User'}</p>
                          <p className="text-cinema-silver text-xs truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          {[
                            { href: '/profile', label: 'My Profile', icon: User },
                            { href: '/profile?tab=watchlist', label: 'Watchlist', icon: BookMarked },
                            { href: '/profile?tab=favorites', label: 'Favorites', icon: Heart },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-cinema-silver hover:text-white hover:bg-white/5 text-sm transition-all"
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-cinema-silver hover:text-cinema-red hover:bg-cinema-red/5 text-sm transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="btn-cinema text-sm py-1.5 px-4"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-cinema-silver hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden glass-dark border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      pathname === link.href
                        ? 'text-cinema-red bg-cinema-red/10'
                        : 'text-cinema-silver hover:text-white hover:bg-white/5'
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for menus */}
      {(mobileOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setMobileOpen(false); setUserMenuOpen(false); }}
        />
      )}
    </>
  );
}
