import { describe, expect, it } from 'vitest'
import { calculateEmi } from './emi'

describe('calculateEmi', () => {
  it('calculates standard reducing-balance EMI', () => {
    const res = calculateEmi(100000, 12, 12)
    expect(res).not.toBeNull()
    expect(res!.emi).toBeGreaterThan(8884)
    expect(res!.emi).toBeLessThan(8886)
    expect(res!.total).toBeCloseTo(res!.emi * 12, 5)
    expect(res!.interest).toBeCloseTo(res!.total - 100000, 5)
  })

  it('handles zero interest', () => {
    const res = calculateEmi(12000, 0, 12)
    expect(res).toEqual({ emi: 1000, total: 12000, interest: 0 })
  })

  it('returns null for invalid inputs', () => {
    expect(calculateEmi(0, 10, 12)).toBeNull()
    expect(calculateEmi(1000, 10, 0)).toBeNull()
  })
})
