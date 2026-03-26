'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShieldCheck, Zap, Heart, Trophy, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export default function SubscribePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen py-24 px-8 overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* Toggle Switch */}
        <div className="glass p-2 rounded-full flex gap-2 mb-16 relative">
           <motion.div 
             layoutId="active-cycle"
             className="absolute bg-[var(--accent-gold)] h-[calc(100%-16px)] rounded-full z-0 transition-all duration-300 shadow-xl"
             style={{ 
               width: '140px',
               left: billingCycle === 'monthly' ? '8px' : 'calc(100% - 148px)'
             }}
           />
           <button 
             onClick={() => setBillingCycle('monthly')}
             className={`px-8 py-3 rounded-full text-sm font-bold transition-colors z-10 w-[140px]
               ${billingCycle === 'monthly' ? 'text-black' : 'text-[var(--text-muted)]'}`}
           >
             Monthly
           </button>
           <button 
             onClick={() => setBillingCycle('yearly')}
             className={`px-8 py-3 rounded-full text-sm font-bold transition-colors z-10 w-[140px]
               ${billingCycle === 'yearly' ? 'text-black' : 'text-[var(--text-muted)]'}`}
           >
             Yearly (Save 20%)
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-[1000px]">
           {/* Monthly Plan Cardano */}
           <motion.div 
             whileHover={{ y: -5 }}
             className={cn(
               "p-10 rounded-[32px] border transition-all duration-500 flex flex-col gap-6 relative overflow-hidden glass",
               billingCycle === 'monthly' ? 'border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]/20' : 'border-white/5 opacity-80'
             )}
           >
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-bold mb-1 italic">FLEX CYCLE</h3>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest font-bold">Month-by-Month Entry</p>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl"><Zap className="w-5 h-5 text-[var(--accent-gold)]" /></div>
              </div>

              <div className="my-4">
                 <div className="text-6xl font-black gradient-text">£34.99<span className="text-sm font-normal text-white/50 ml-2 not-italic">/mo</span></div>
              </div>

              <div className="flex flex-col gap-4 py-8 border-y border-white/5 flex-grow">
                 {[
                   'Full Score Tracking',
                   '10% Minimum Charity Contribution',
                   '1x Draw Participation Multiplier',
                   'Cancel Anytime Guarantee'
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-3 text-sm font-medium">
                      <Check className="w-5 h-5 text-[var(--accent-gold)] shrink-0" /> {feat}
                   </div>
                 ))}
              </div>

              <Link href="/dashboard" className="premium-btn w-full py-4 text-lg">Confirm Membership</Link>
           </motion.div>

           {/* Yearly Plan Cardano */}
           <motion.div 
             whileHover={{ y: -5 }}
             className={cn(
               "p-10 rounded-[32px] border transition-all duration-500 flex flex-col gap-6 relative overflow-hidden glass",
               billingCycle === 'yearly' ? 'border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]/20' : 'border-white/5 opacity-80'
             )}
           >
              <div className="absolute top-0 right-0 bg-[var(--accent-gold)] text-black text-[10px] font-black px-4 py-1 rounded-bl-xl italic">BEST VALUE</div>
              
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-bold mb-1 italic">ELITE CIRCLE</h3>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest font-bold">Full Annual Engagement</p>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl"><Trophy className="w-5 h-5 text-[var(--accent-gold)]" /></div>
              </div>

              <div className="my-4">
                 <div className="text-6xl font-black gradient-text">£24.99<span className="text-sm font-normal text-white/50 ml-2 not-italic">/mo</span></div>
                 <p className="text-[10px] text-white/40 mt-2">Billed annually at £299.88</p>
              </div>

              <div className="flex flex-col gap-4 py-8 border-y border-white/5 flex-grow">
                 {[
                   'All Flex Cycle Features',
                   '1.2x Prize Multiplier Bonus',
                   'Priority Verification Lane',
                   'Founding Member Profile Badge',
                   'Free Access to Live Charity Golf Events'
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-3 text-sm font-medium">
                      <Check className="w-5 h-5 text-[var(--accent-gold)] shrink-0" /> {feat}
                   </div>
                 ))}
              </div>

              <Link href="/dashboard" className="premium-btn w-full py-4 text-lg shadow-[0_0_20px_rgba(255,207,51,0.2)]">Claim Elite Pass</Link>
           </motion.div>
        </div>


        {/* Global Stats / Trust Block */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[900px]">
           <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><ShieldCheck className="w-8 h-8 opacity-50" /></div>
              <div>
                 <h4 className="font-bold text-lg italic italic">Secure & Encrypted</h4>
                 <p className="text-xs text-[var(--text-muted)] mt-1">PCI-DSS compliant via Stripe infrastructure.</p>
              </div>
           </div>
           <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Heart className="w-8 h-8 opacity-50" /></div>
              <div>
                 <h4 className="font-bold text-lg italic italic">Transparent Impact</h4>
                 <p className="text-xs text-[var(--text-muted)] mt-1">Track precisely where your contributions go.</p>
              </div>
           </div>
           <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Trophy className="w-8 h-8 opacity-50" /></div>
              <div>
                 <h4 className="font-bold text-lg italic italic">Fair Play Engine</h4>
                 <p className="text-xs text-[var(--text-muted)] mt-1">Provably fair draw logic verified for transparency.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
