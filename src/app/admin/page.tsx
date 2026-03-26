'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Settings, 
  Trophy, 
  Heart, 
  BarChart3, 
  ListRestart, 
  ExternalLink, 
  CheckCircle, 
  XSquare, 
  Search,
  ChevronRight,
  Plus
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { simulateMonthlyDraw } from '@/lib/draw-engine'
import toast from 'react-hot-toast'
import { User, Score, Winner } from '@/types'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ users: 0, subs: 0, charity: 0, jackpot: 52000 })
  const [members, setMembers] = useState<any[]>([])
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchAdminData = async () => {
     const { data: users } = await supabase.from('profiles').select('*')
     const { data: winData } = await supabase.from('winners').select('*, profiles(display_name, email)')
     
     setMembers(users || [])
     setWinners(winData || [])
     
     const totalPrize = winData?.reduce((acc, curr) => acc + curr.prize_amount, 0) || 0
     setStats(prev => ({ ...prev, users: users?.length || 0, charity: totalPrize * 0.1 }))
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleUpdateWinnerStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('winners').update({ verification_status: status }).eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success(`Winner ${status}`)
      fetchAdminData()
    }
  }

  const handleExecuteDraw = async () => {
    setLoading(true)
    try {
      // 1. Fetch all active users and their scores
      const { data: users } = await supabase.from('profiles').select('*').eq('subscription_status', 'active')
      const { data: scores } = await supabase.from('scores').select('*')

      if (!users || users.length === 0) {
        toast.error("No active subscribers found.")
        return
      }

      // 2. Run Engine
      const result = simulateMonthlyDraw(users as any, scores as any, 10000) // 10k pool for demo
      
      // 3. Save Draw Record
      const { data: draw, error: drawErr } = await supabase.from('draws').insert({
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        status: 'published',
        logic: 'random',
        jackpot_pool: result.rolloverNextMonth,
        winning_numbers: result.winningNumbers
      }).select().single()

      if (drawErr) throw drawErr

      // 4. Save Winners
      const winnersData = result.winners.map(w => ({
        draw_id: draw.id,
        user_id: w.user_id,
        match_type: w.match_type,
        prize_amount: w.prize_amount,
        verification_status: 'pending'
      }))

      const { error: winErr } = await supabase.from('winners').insert(winnersData)
      if (winErr) throw winErr

      toast.success(`Draw executed! ${result.winners.length} winners recorded.`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
       setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-deep)]">
      {/* Sidebar Navigation */}
      <aside className="w-72 glass border-y-0 border-l-0 border-r-1 border-white/5 p-8 flex flex-col gap-12 sticky top-0 h-screen">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--accent-gold)] rounded-xl flex items-center justify-center">
             <Trophy className="text-black w-6 h-6" />
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">ADMIN<span className="text-[var(--accent-gold)]">CTRL</span></span>
        </div>


        <nav className="flex flex-col gap-4">
           {[
             { id: 'overview', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
             { id: 'users', icon: <Users className="w-5 h-5" />, label: 'Members' },
             { id: 'draws', icon: <ListRestart className="w-5 h-5" />, label: 'Draw Engine' },
             { id: 'charities', icon: <Heart className="w-5 h-5" />, label: 'Charity Center' },
             { id: 'winners', icon: <Trophy className="w-5 h-5" />, label: 'Verification' },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 font-medium text-sm
                 ${activeTab === tab.id 
                   ? 'bg-white/10 text-white border-l-4 border-[var(--accent-gold)] shadow-xl' 
                   : 'text-[var(--text-dim)] hover:text-white hover:bg-white/5'}`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </nav>

        <div className="mt-auto p-6 bg-white/5 rounded-2xl flex flex-col gap-2">
           <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">System Status</span>
           <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-teal)]">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-teal)] animate-pulse" /> ENGINE ONLINE
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div className="max-w-[800px]">
             <span className="text-[var(--accent-gold)] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">System Command Overview</span>
             <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">Command <span className="text-[var(--text-muted)] opacity-30">&</span> Control</h1>
             <p className="text-[var(--text-muted)] text-lg">Manage members, execute global draws, and analyze the ecosystem impact.</p>
          </div>
          <div className="flex gap-4">
             <button className="premium-btn py-4 px-8 text-sm"><Plus className="w-4 h-4" /> Add Charity</button>
             <button className="flex items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Search className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Dynamic Content Based on Tabs */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[
               { label: 'Total Users', val: stats.users, change: '+14%', color: 'var(--accent-teal)' },
               { label: 'Annual Subs', val: `£${stats.subs || 0}`, change: '+8.2%', color: 'var(--accent-gold)' },
               { label: 'Charity Giving', val: `£${stats.charity.toFixed(2)}`, change: '+22%', color: 'var(--accent-coral)' },
               { label: 'Jackpot Status', val: `£${stats.jackpot}`, change: 'Rollover', color: 'white' },
             ].map((stat, i) => (
               <div key={i} className="glass p-8 flex flex-col gap-2 border-white/5 group hover:border-[var(--accent-gold)] transition-colors">
                  <span className="text-xs uppercase tracking-widest text-[var(--text-dim)] font-black italic">{stat.label}</span>
                  <div className="text-3xl font-bold font-sans tracking-tight">{stat.val}</div>
                  <div className="text-[10px] font-bold" style={{ color: stat.color }}>{stat.change}</div>
               </div>
             ))}
          </div>
        )}

        {/* Members Table */}
        {(activeTab === 'overview' || activeTab === 'users') && (
          <section className="glass overflow-hidden border-white/5">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-xl font-bold font-sans">Active Membership Directory</h2>
                <button className="text-xs font-bold text-[var(--text-dim)] hover:text-white flex items-center gap-1">View Full Logs <ChevronRight className="w-4 h-4" /></button>
             </div>
             <table className="w-full text-left text-sm font-medium">
                <thead className="text-[10px] text-white/40 border-b border-white/5 uppercase tracking-widest">
                   <tr>
                      <th className="p-6">User Identity</th>
                      <th className="p-6">Current Cycle Status</th>
                      <th className="p-6">Subscription Engine</th>
                      <th className="p-6">Charity Focus</th>
                      <th className="p-6 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {members.map((row, i) => (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                           <div className="flex flex-col">
                              <span className="text-white font-bold">{row.display_name || 'Anonymous Rebel'}</span>
                              <span className="text-[var(--text-dim)] text-xs">{row.email || 'hidden@domain.com'}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black italic uppercase italic
                             ${row.subscription_status === 'active' ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]' : 
                               'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]'}`}>
                              {row.subscription_status}
                           </span>
                        </td>
                        <td className="p-6 text-[var(--text-muted)] font-bold italic italic">{row.plan || 'Free Tier'}</td>
                        <td className="p-6 text-[var(--text-muted)]">{row.charity_percentage}% Focus</td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white/10 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
                           </div>
                        </td>
                     </tr>
                    ))}
                </tbody>
             </table>
          </section>
        )}

        {/* Winners / Verification Table */}
        {activeTab === 'winners' && (
          <section className="glass overflow-hidden border-white/5">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-xl font-bold font-sans">Result Verification Console</h2>
             </div>
             <table className="w-full text-left text-sm font-medium">
                <thead className="text-[10px] text-white/40 border-b border-white/5 uppercase tracking-widest">
                   <tr>
                      <th className="p-6">Winner</th>
                      <th className="p-6">Match Type</th>
                      <th className="p-6">Prize Pool</th>
                      <th className="p-6">Proof Status</th>
                      <th className="p-6 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {winners.map((row, i) => (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                           <div className="flex flex-col">
                              <span className="text-white font-bold">{row.profiles?.display_name}</span>
                              <span className="text-[var(--text-dim)] text-xs">{row.profiles?.email}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className="premium-btn py-1 px-3 text-[10px] bg-white/5 text-white border-white/10">
                             {row.match_type} MATCH
                           </span>
                        </td>
                        <td className="p-6 text-[var(--accent-gold)] font-bold">£{row.prize_amount.toFixed(2)}</td>
                        <td className="p-6">
                           <span className={`px-2 py-1 rounded text-[9px] font-black uppercase
                             ${row.verification_status === 'approved' ? 'text-[var(--accent-teal)]' : 
                               row.verification_status === 'pending' ? 'text-[var(--accent-gold)]' : 'text-[var(--accent-coral)]'}`}>
                              {row.verification_status}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-3">
                              {row.proof_url && (
                                <a href={row.proof_url} target="_blank" className="p-2 hover:bg-white/10 rounded-lg"><ExternalLink className="w-4 h-4" /></a>
                              )}
                              <button 
                                onClick={() => handleUpdateWinnerStatus(row.id, 'approved')}
                                className="p-2 hover:bg-[var(--accent-teal)]/10 rounded-lg text-[var(--accent-teal)]"
                              ><CheckCircle className="w-4 h-4" /></button>
                              <button 
                                onClick={() => handleUpdateWinnerStatus(row.id, 'rejected')}
                                className="p-2 hover:bg-[var(--accent-coral)]/10 rounded-lg text-[var(--accent-coral)]"
                              ><XSquare className="w-4 h-4" /></button>
                           </div>
                        </td>
                     </tr>
                    ))}
                </tbody>
             </table>
          </section>
        )}

        {/* Example Action Center for Draw Logic */}
        {activeTab === 'draws' && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass p-10 flex flex-col gap-6">
                <h3 className="text-2xl font-bold flex items-center gap-3 italic"><ListRestart className="text-[var(--accent-gold)]" /> Engine Control</h3>
                <p className="text-[var(--text-muted)] text-sm mb-4">Select the algorithm logic for this month's draw cycle. Publishing finalized results is irreversible.</p>
                <div className="flex flex-col gap-3">
                   <label className="p-6 rounded-2xl border border-[var(--accent-gold)] bg-[var(--accent-gold)]/5 flex justify-between items-center cursor-pointer group">
                      <div>
                         <div className="font-bold">Algorithmic Weighted</div>
                         <div className="text-[10px] text-white/50">Prioritizes user participation metrics</div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-[var(--accent-gold)] flex items-center justify-center">
                         <div className="w-3 h-3 rounded-full bg-[var(--accent-gold)]" />
                      </div>
                   </label>
                   <label className="p-6 rounded-2xl border border-white/5 hover:bg-white/5 flex justify-between items-center cursor-pointer group transition-colors">
                      <div>
                         <div className="font-bold">Standard Lottery</div>
                         <div className="text-[10px] text-white/50">Pure cryptographic randomness</div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                   </label>
                </div>
                 <div className="flex gap-4 mt-4">
                   <button className="flex-1 py-5 rounded-2xl border border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold text-sm tracking-widest uppercase hover:bg-[var(--accent-gold)]/10 transition-colors">Run Sim</button>
                   <button 
                     onClick={handleExecuteDraw}
                     disabled={loading}
                     className="flex-1 premium-btn text-sm uppercase tracking-widest"
                   >
                     {loading ? 'Executing...' : 'Execute Draw'}
                   </button>
                </div>
             </div>

             <div className="glass p-10 bg-[var(--bg-deep)] border-dashed border-2 border-white/5 flex flex-col justify-center items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                   <Trophy className="w-8 h-8 opacity-20" />
                </div>
                <h4 className="font-bold text-lg">Simulation Results</h4>
                <p className="text-[var(--text-muted)] text-xs max-w-[250px]">No pending simulations. Execute a simulation to see estimated pool distributions.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}
