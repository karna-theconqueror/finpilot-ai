export function calculateEmi(principal: number, annualRatePercent: number, months: number) {
  if (!(principal > 0) || !(months > 0)) return null
  const r = annualRatePercent / 100 / 12
  if (r === 0) {
    const emi = principal / months
    return { emi, total: principal, interest: 0 }
  }
  const pow = Math.pow(1 + r, months)
  const emi = (principal * r * pow) / (pow - 1)
  const total = emi * months
  return { emi, total, interest: total - principal }
}
