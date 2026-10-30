import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, Sparkles, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../shared/GlassCard';
import Badge from '../shared/Badge';

export default function Login() {
  const { dispatch } = useApp();
  const [username, setUsername] = useState('demo.analyst');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Mock auth — no backend, resolves after a short delay for realism.
    setTimeout(() => {
      dispatch({
        type: 'LOGIN',
        payload: { name: 'Demo Analyst', role: 'Security Engineer' },
      });
    }, 650);
  }

  return (
    <div className="min-h-screen w-full bg-bgvoid bg-grid relative overflow-hidden flex items-center justify-center px-4">
      {/* Ambient glow blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyberCyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyberEmerald-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Hero / branding */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyberCyan-500/10 border border-cyberCyan-500/30 shadow-glowCyan">
              <ShieldCheck className="w-7 h-7 text-cyberCyan-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              CyberGuard <span className="text-cyberCyan-400">AI</span>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-white mb-4">
            Evidence-based security,<br />
            <span className="text-cyberEmerald-400 text-glow-emerald">closed-loop remediation.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-md">
            Scan, explain, approve, fix, and verify — in one continuous pipeline.
            AI explains the evidence. It never invents the finding.
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge color="cyan"><Terminal className="w-3.5 h-3.5" /> Full DevSecOps loop</Badge>
            <Badge color="emerald"><ShieldCheck className="w-3.5 h-3.5" /> Human-approved fixes</Badge>
            <Badge color="amber"><Sparkles className="w-3.5 h-3.5" /> Simulated Demo Mode</Badge>
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="p-8" glow>
            <div className="flex items-center justify-between mb-1 lg:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-cyberCyan-400" />
                <span className="text-xl font-bold text-white">CyberGuard AI</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Analyst Sign-in</h2>
              <p className="text-sm text-slate-400">Mock authentication — no real credentials required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-navy-800/80 border border-slate-700 focus:border-cyberCyan-500 outline-none rounded-lg pl-9 pr-3 py-2.5 text-sm text-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-navy-800/80 border border-slate-700 focus:border-cyberCyan-500 outline-none rounded-lg pl-9 pr-3 py-2.5 text-sm text-white transition-colors"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-cyberCyan-500 hover:bg-cyberCyan-400 disabled:opacity-60 text-navy-900 font-semibold py-2.5 rounded-lg transition-colors shadow-glowCyan flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-navy-900/40 border-t-navy-900 rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign in to CyberGuard AI'
                )}
              </motion.button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-center">
              <Badge color="amber">
                <Sparkles className="w-3.5 h-3.5" /> Simulated Demo Mode — no real scans, deploys, or GitHub actions
              </Badge>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}