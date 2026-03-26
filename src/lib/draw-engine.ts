import { Score, Winner, User } from '@/types'

/**
 * Executes a monthly draw based on a set of users and their scores.
 * @param users - All active subscribers
 * @param scores - All scores recorded in the month
 * @param poolAmount - Total Prize Pool from subscriptions
 * @param rollover - Rollover from last month (if any)
 */
export function simulateMonthlyDraw(
  users: User[],
  scores: Score[],
  poolAmount: number,
  rollover: number = 0
) {
  const totalPool = poolAmount + rollover
  
  // Prize Distribution (PRD 07)
  const pool5 = totalPool * 0.40
  const pool4 = totalPool * 0.35
  const pool3 = totalPool * 0.25

  // Generate Winning Numbers (Mock Logic: Usually Standard Lottery)
  const winningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1)
  
  const winners: Partial<Winner>[] = []

  users.forEach(user => {
    const userScores = scores.filter(s => s.user_id === user.id)
    if (userScores.length === 0) return

    // Logic: In Stableford format (1-45), we check if their latest scores match drawn numbers
    // This is just a simulation of "matching"
    const matchedCount = Math.floor(Math.random() * 6) // Mocking 0-5 matches
    
    if (matchedCount >= 3) {
      winners.push({
        user_id: user.id,
        match_type: matchedCount as 3 | 4 | 5,
        verification_status: 'pending'
      })
    }
  })

  // Group winners by tier
  const tier5 = winners.filter(w => w.match_type === 5)
  const tier4 = winners.filter(w => w.match_type === 4)
  const tier3 = winners.filter(w => w.match_type === 3)

  // Calculate payouts for each tier (split equally)
  if (tier5.length > 0) {
    const payoutPerWinner = pool5 / tier5.length
    tier5.forEach(w => w.prize_amount = payoutPerWinner)
  }

  if (tier4.length > 0) {
    const payoutPerWinner = pool4 / tier4.length
    tier4.forEach(w => w.prize_amount = payoutPerWinner)
  }

  if (tier3.length > 0) {
    const payoutPerWinner = pool3 / tier3.length
    tier3.forEach(w => w.prize_amount = payoutPerWinner)
  }

  return {
    winningNumbers,
    winners: [...tier5, ...tier4, ...tier3],
    rolloverNextMonth: tier5.length === 0 ? pool5 : 0 // Jackpot rollover if no 5-match winner
  }
}
