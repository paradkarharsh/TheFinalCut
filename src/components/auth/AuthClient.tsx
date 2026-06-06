'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Film } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Props {
  mode: 'login' | 'register';
}

export default function AuthClient({ mode }: Props) {
  const { signInWithGoogle, signInWithGithub, signInWithEmail, registerWithEmail, error, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === 'login') {
      await signInWithEmail(form.email, form.password);
    } else {
      await registerWithEmail(form.email, form.password, form.name);
    }
    setSubmitting(false);
    if (!error) router.push('/');
  };

  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-cinema-red/10 via-transparent to-transparent" />
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cinema-red/40"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [-20, -200], opacity: [0, 0.8, 0] }}
            transition={{ duration: 3 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-dark rounded-3xl p-8 border border-white/10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A0000, #0A0A0A)', border: '1.5px solid rgba(229,9,20,0.5)', boxShadow: '0 0 20px rgba(229,9,20,0.2)' }}>
                <Film className="w-5 h-5 text-cinema-red" />
              </div>
              <span className="text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, #fff, #C8C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                The<span style={{ WebkitTextFillColor: '#E50914' }}>Final</span>Cut
              </span>
            </Link>
            <h1 className="text-2xl font-black text-white mb-1">
              {mode === 'login' ? 'Welcome Back' : 'Join the Cinema'}
            </h1>
            <p className="text-cinema-silver text-sm">
              {mode === 'login' ? 'Sign in to your account' : 'Create your TFC account'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass-red rounded-xl p-3 mb-6 text-cinema-red text-sm text-center">
              {error}
            </motion.div>
          )}

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signInWithGoogle().then(() => router.push('/'))}
              className="w-full flex items-center justify-center gap-3 p-3 glass rounded-xl text-white font-semibold hover:bg-white/5 transition-all border border-white/10 hover:border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970244 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/><path fill="#4A90E2" d="M19.834192,20.9995801 C21.9955573,19.0520096 23.4545455,16.1536745 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/><path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/></svg>
              Continue with Google
            </button>
          </div>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-cinema-silver text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-silver" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  className="w-full glass rounded-xl pl-11 pr-4 py-3 text-white placeholder-cinema-silver/50 outline-none focus:border-cinema-red/40 border border-white/10 transition-all"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-silver" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email address"
                required
                className="w-full glass rounded-xl pl-11 pr-4 py-3 text-white placeholder-cinema-silver/50 outline-none focus:border-cinema-red/40 border border-white/10 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-silver" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Password"
                required
                minLength={6}
                className="w-full glass rounded-xl pl-11 pr-11 py-3 text-white placeholder-cinema-silver/50 outline-none focus:border-cinema-red/40 border border-white/10 transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-silver hover:text-white transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full btn-cinema py-3 text-base disabled:opacity-50"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-cinema-silver text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already a member? '}
            <Link href={mode === 'login' ? '/auth/register' : '/auth/login'} className="text-cinema-red hover:text-red-400 font-semibold transition-colors">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
