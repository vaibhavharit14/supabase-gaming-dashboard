'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Heart, TrendingUp, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section className="relative pt-24 pb-20 px-8 flex flex-col items-center text-center max-w-[1000px] mx-auto overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-teal)] opacity-[0.05] blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-gold)] opacity-[0.05] blur-[120px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] glass mb-6"
        >
          <Zap className="w-4 h-4 text-[var(--accent-gold)]" />
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--accent-gold)]">The Next Era of Golf</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]"
        >
          Drive Your Game. <br />
          <span className="gradient-text">Fund Your Passion.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-[var(--text-muted)] max-w-[700px] mb-12"
        >
          The subscription-based golf platform where your performance earns you more than just bragging rights. Track Stableford scores, win monthly prize pools, and support world-class charities with every swing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/subscribe" className="premium-btn text-lg py-5 px-10">
            Start Winning Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#how-it-works" className="flex items-center justify-center px-10 py-5 rounded-full border border-[var(--border)] hover:bg-white/5 transition-colors font-medium">
            Explore Mechanics
          </Link>
        </motion.div>

        {/* Floating Mock Metrics Panel (Decorative) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, type: 'spring' }}
          className="mt-20 w-full max-w-[900px] glass p-1 border-white/5"
        >
          <div className="bg-[var(--bg-deep)] rounded-xl overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            <div className="p-8 text-left">
              <div className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider font-semibold">Active Members</div>
              <div className="text-3xl font-bold">12,482</div>
            </div>
            <div className="p-8 text-left">
               <div className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider font-semibold">Raised for Cause</div>
              <div className="text-3xl font-bold gradient-text">£450,231</div>
            </div>
            <div className="p-8 text-left">
               <div className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider font-semibold">Jackpot Pool</div>
              <div className="text-3xl font-bold text-[var(--accent-gold)]">£52,000</div>
            </div>
            <div className="p-8 text-left">
               <div className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider font-semibold">Winners Verified</div>
              <div className="text-3xl font-bold">1,200+</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="how-it-works" className="py-24 px-8 bg-black/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[500px]">
              <h2 className="text-3xl font-bold mb-4 uppercase tracking-[0.05em]">How it works</h2>
              <p className="text-[var(--text-muted)] text-lg">A simple loop of performance and purpose. Play your best, win the rest, and give back.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Zap className="text-[var(--accent-lime)]" />, 
                title: "Subscribe & Play", 
                desc: "Choose a monthly or annual plan. Start entering your latest 5 Stableford scores." 
              },
              { 
                icon: <Trophy className="text-[var(--accent-gold)]" />, 
                title: "Enter the Draw", 
                desc: "Your scores feed into our monthly draw engine. Match numbers to win tiered prize pools." 
              },
              { 
                icon: <Heart className="text-[var(--accent-coral)]" />, 
                title: "Impact Charity", 
                desc: "A minimum of 10% of your subscription goes directly to your chosen charity. You choose the impact." 
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="glass p-10 flex flex-col items-start gap-4 border-white/[0.03]"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center scale-110 mb-2">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold">{f.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <section className="py-24 px-8 border-t border-white/5">
        <div className="flex flex-col items-center gap-12 max-w-[800px] mx-auto text-center">
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-full opactiy-50" />
          <h2 className="text-4xl md:text-5xl font-bold">Ready to redefine <br /><span className="text-[var(--text-dim)]">your golf experience?</span></h2>
          <Link href="/subscribe" className="premium-btn text-xl py-6 px-12">
            Get Started Now
          </Link>
          <div className="text-[var(--text-muted)] flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4" /> Secure checkout with Stripe
          </div>
        </div>
      </section>

      <footer className="py-12 px-8 text-center text-[var(--text-dim)] text-xs uppercase tracking-[0.2em] border-t border-white/5">
        © 2026 Digital Heroes. All Rights Reserved.
      </footer>
    </div>
  )
}
