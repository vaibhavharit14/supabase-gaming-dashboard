'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Trophy, Heart, CreditCard, ChevronRight, Activity, LogOut, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Score, User as AppUser } from '@/types'
import { ProofUploader } from '@/components/ProofUploader'

export default function UserDashboard() {
  const [scores, setScores] = useState<Score[]>([])
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    toast.success("Logged out successfully")
  }

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch Profile
    const { data: prof, error: profError } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profError) {
      console.error("Profile fetch error:", profError)
      toast.error("Failed to load profile data")
    }
    setProfile(prof)

    // Fetch Scores (Top 5)
    const { data: scoreData, error: scoreError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5)
    
    if (scoreError) {
      console.error("Scores fetch error:", scoreError)
      toast.error("Failed to load scores data")
    }
    setScores(scoreData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addScore = async () => {
    const scoreVal = parseInt(newScore)
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      toast.error("Invalid score range (1-45)")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('scores').insert({
      user_id: user.id,
      score: scoreVal,
      date: newDate
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Performance Logged")
      setNewScore('')
      fetchData() // Refresh rolling list
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
      <div className="w-12 h-12 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen p-4 md:p-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-[var(--text-muted)]">Track performance, manage charities and check winnings.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button 
             onClick={() => router.push('/')}
             className="glass px-6 py-4 flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
             <Home className="w-4 h-4" /> Home
          </button>
          <button 
             onClick={handleLogout}
             className="glass px-6 py-4 flex items-center gap-2 hover:bg-[var(--accent-coral)]/10 hover:text-[var(--accent-coral)] transition-colors border-white/10"
          >
             <LogOut className="w-4 h-4" /> Logout
          </button>
          <div className="glass px-6 py-4 flex flex-col items-center justify-center min-w-[150px]">
             <span className="text-xs uppercase tracking-widest text-[var(--accent-gold)] mb-1">Status</span>
             <span className="font-bold uppercase tracking-tighter">{profile?.subscription_status || 'Inactive'}</span>
          </div>
          <div className="glass px-6 py-4 flex flex-col items-center justify-center min-w-[150px]">
             <span className="text-xs uppercase tracking-widest text-[var(--accent-teal)] mb-1">Plan</span>
            <span className="font-bold uppercase tracking-tighter">{profile?.plan || 'Free'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scores & Management */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Recent Scores Section */}
          <div className="glass p-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Activity className="text-[var(--accent-gold)] w-6 h-6" /> Late Performance
              </h2>
              <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Stableford Format (Last 5)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              <AnimatePresence mode="popLayout">
                {scores.map((s, i) => (
                  <motion.div 
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={s.id} 
                    className="flex flex-col items-center gap-3 glass p-6 border-white/5 relative bg-white/5 hover:bg-white/[0.08] transition-colors"
                  >
                    {i === 0 && <span className="absolute -top-2 bg-[var(--accent-gold)] text-black text-[10px] px-2 font-black rounded italic italic">NEW</span>}
                    <span className="text-3xl font-black">{s.score}</span>
                    <span className="text-[10px] text-white/50">{s.date}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Score Entry UI */}
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-[var(--bg-deep)] rounded-2xl border border-white/5">
              <div className="flex-1">
                <label className="block text-[10px] uppercase text-white/40 mb-2 font-bold ml-1">Stableford Score (1-45)</label>
                <input 
                  type="number" 
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="e.g. 36"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] uppercase text-white/40 mb-2 font-bold ml-1">Date Played</label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
              <button 
                onClick={addScore}
                className="premium-btn mt-auto py-5 px-10 h-[58px]"
              >
                Log Performance <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Charity Impact */}
          <div className="glass p-8">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Heart className="text-[var(--accent-coral)] w-6 h-6" /> Your Charity Impact
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center group overflow-hidden border border-white/10">
                 <img src="https://via.placeholder.com/150" alt="Charity" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Tee Up for Tomorrow</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Developing young golfers through community programs. Since joining, you've contributed £45.30 to this cause.</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="glass px-4 py-2 text-xs font-bold border-[var(--accent-coral)]">Current %: 15%</span>
                  <button className="text-xs font-bold text-white/60 hover:text-white transition-colors underline flex items-center gap-1">Change Choice <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="w-full md:w-auto p-6 bg-white/5 rounded-2xl flex flex-col items-center">
                 <span className="text-[10px] uppercase text-white/40 mb-1">Next Draw Multiplier</span>
                 <span className="text-3xl font-black text-[var(--accent-coral)]">1.2x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Stats */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Subscription Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-deep)] border border-white/10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/5 rounded-xl"><CreditCard className="w-6 h-6" /></div>
              <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full font-bold">ANNUAL PLAN</span>
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Monthly Cost</p>
              <h3 className="text-3xl font-bold italic italic">£29.99<span className="text-sm font-normal not-italic ml-2">/mo</span></h3>
            </div>
            <button className="w-full p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold flex items-center justify-center gap-2">
              Manage Billing <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Winnings Board */}
          <div className="glass p-8 border-[var(--accent-gold)] border-opacity-30">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 italic italic">
              <Trophy className="w-5 h-5 text-[var(--accent-gold)]" /> WINNINGS BOARD
            </h3>
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center py-3 border-b border-white/5">
                 <span className="text-sm">Total Profits</span>
                 <span className="text-xl font-bold">£{profile?.total_winnings || '0.00'}</span>
               </div>
               <div className="flex justify-between items-center py-3 border-b border-white/5">
                 <span className="text-sm">Current Payouts</span>
                 <span className="text-sm text-[var(--accent-teal)] font-bold">Pending Approval</span>
               </div>
               
               {/* Functional Uploader for Winners */}
               <div className="mt-4">
                 <ProofUploader winnerId="latest-win-id" onUploadSuccess={fetchData} />
               </div>
               
               <button className="premium-btn mt-2 py-4">Request Payout</button>
            </div>
          </div>

          {/* Notifications / Draws */}
          <div className="glass p-8">
             <h3 className="text-lg font-bold mb-6">Upcoming Draws</h3>
             <div className="flex flex-col gap-4">
                {[
                  { month: 'APRIL MATCH', pool: '£50,000', days: 12 },
                  { month: 'MAY MATCH', pool: '£48,000', days: 42 },
                ].map((d, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-center font-bold text-xs">{d.days}d</div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{d.month}</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">Pool Expectancy: {d.pool}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
