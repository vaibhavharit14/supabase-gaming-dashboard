'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Mail, Lock, ArrowRight, Zap, Globe } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: email.split('@')[0]
          }
        }
      })
      if (error) toast.error(error.message)
      else {
        toast.success('Registration Initiated. Please check your email (if confirmed) or just try signing in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast.error(error.message)
      else {
        toast.success('Access Granted')
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#050608] via-[#0d0f12] to-[#050608]">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('/noise.svg')] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass w-full max-w-[500px] p-12 flex flex-col items-center gap-12 border-white/5 shadow-[0_32px_128px_rgba(0,0,0,0.8)]"
      >
        <div className="flex flex-col items-center gap-4 text-center">
           <div className="w-16 h-16 bg-[var(--accent-gold)] rounded-2xl flex items-center justify-center rotate-6 scale-110 shadow-2xl">
              <Trophy className="text-black w-10 h-10 -rotate-6" />
           </div>
           <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                {isSignUp ? 'Join' : 'Welcome'} <span className="text-[var(--accent-gold)]">{isSignUp ? 'Elite' : 'Back'}</span>
              </h1>
              <p className="text-[var(--text-muted)] text-sm font-medium mt-1">
                {isSignUp ? 'Create your player identity.' : 'Enter the elite golf arena.'}
              </p>
           </div>
        </div>

        <form onSubmit={handleAuth} className="w-full flex flex-col gap-6">

           <div className="flex flex-col gap-4">
              <div className="relative group">
                 <Mail className="absolute left-5 top-1/2 -translate-y-[52%] w-5 h-5 text-white/30 group-focus-within:text-[var(--accent-gold)] transition-colors" />
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Email Identity"
                   required
                   className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)]/20 transition-all font-medium text-sm"
                 />
              </div>
              <div className="relative group">
                 <Lock className="absolute left-5 top-1/2 -translate-y-[52%] w-5 h-5 text-white/30 group-focus-within:text-[var(--accent-gold)] transition-colors" />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Secure Key Phrase"
                   required
                   className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)]/20 transition-all font-medium text-sm"
                 />
              </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="premium-btn py-5 text-lg w-full flex items-center gap-2 justify-center font-bold italic"
           >
              {loading ? 'Authenticating...' : (isSignUp ? 'Register Account' : 'Access Dashboard')} <ArrowRight className="w-5 h-5" />
           </button>


           {!isSignUp && (
             <button 
               type="button"
               onClick={async () => {
                 setLoading(true)
                 const { error } = await supabase.auth.signInWithPassword({ 
                   email: 'demo@hero.com', 
                   password: 'Password123!' 
                 })
                 if (error) toast.error("Demo account not found. Please Sign Up once as demo@hero.com first!")
                 else {
                   toast.success('Demo Access Granted')
                   router.push('/dashboard')
                 }
                 setLoading(false)
               }}
               className="w-full py-4 rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5 text-[var(--accent-gold)] text-xs font-black uppercase tracking-widest hover:bg-[var(--accent-gold)]/10 transition-all flex items-center justify-center gap-2 mt-4"
             >
                <Zap className="w-4 h-4" /> Quick Demo Access
             </button>
           )}

           <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">External Entry</span>
              <div className="h-[1px] flex-1 bg-white/5" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-xs font-bold"
              >
                 <Globe className="w-4 h-4 text-[var(--accent-teal)]" /> Google
              </button>
              <button 
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="flex items-center justify-center gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-xs font-bold"
              >
                 <Zap className="w-4 h-4 text-[var(--accent-gold)]" /> GitHub
              </button>
           </div>
        </form>

         <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-[var(--text-muted)] font-medium">
               {isSignUp ? 'Already a member?' : 'New to Digital Heroes?'}
            </p>
            <button 
               type="button"
               onClick={() => setIsSignUp(!isSignUp)}
               className="text-sm font-black text-[var(--accent-gold)] hover:text-white transition-colors flex items-center gap-2 italic uppercase tracking-wider"
            >
               {isSignUp ? 'Access Account' : 'Start Your Membership'} <ArrowRight className="w-3 h-3" />
            </button>
         </div>

      </motion.div>
    </div>
  )
}
