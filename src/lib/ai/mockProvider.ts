import type { AIProvider, AIResponse } from './types'

function answer(question: string, context: string): AIResponse {
  const q = question.toLowerCase()
  let a = ''
  if (q.includes('emi')) a = 'EMI (Equated Monthly Installment) is a fixed monthly payment used to repay a loan over time. It typically includes principal and interest. A common reducing-balance formula is EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is the monthly interest rate and n is the number of months. If the interest rate is 0%, EMI = P / n. This is educational information only, not a lender quotation or loan offer.'
  else if (q.includes('personal loan')) a = 'A personal loan is commonly an installment loan used for personal expenses. It may be secured or unsecured depending on the lender and product. Eligibility, rates, fees, and terms vary by lender and individual circumstances. This is general educational information, not a loan offer or approval.'
  else if (q.includes('secured') || q.includes('unsecured')) a = 'Secured loans are typically backed by collateral (such as property or a vehicle), while unsecured loans generally do not require collateral and may rely more on factors like credit profile and income. Terms and eligibility vary by lender; this is educational guidance only.'
  else if (q.includes('document')) a = 'Lenders may commonly request categories of information such as identity verification, address verification, income information, employment information, and other lender-specific documentation. Requirements vary by institution and product. FinPilot AI does not collect real Aadhaar, PAN, bank credentials, or actual identity documents in this MVP.'
  else if (q.includes('interest')) a = 'An interest rate is the cost of borrowing, often expressed as an annual percentage. Actual rates, fees, and policies depend on the lender, market conditions, and individual circumstances. I cannot invent or quote specific lender interest rates or guarantee terms.'
  else if (q.includes('after submitting') || q.includes('submitted') || q.includes('review')) a = 'After submitting an application to a lender, it often goes through review and verification stages. Timelines, required checks, and outcomes vary by lender. FinPilot AI provides simulated demo tracking for learning only; it does not submit real applications to banks or lenders and does not make approval decisions.'
  else if (q.includes('eligibility')) a = 'Common eligibility factors lenders may consider can include identity, income stability, employment details, credit profile, existing obligations, and product-specific criteria. These vary by lender and product. This is general education only, not an eligibility decision or guarantee.'
  else a = 'I can help with general lending education, including loan types, EMI concepts, common documentation categories, and typical application journey stages. I provide educational guidance only: I do not approve or reject loans, make creditworthiness decisions, guarantee eligibility, or invent lender-specific rates, policies, or fees. If you share what you want to learn, I can explain it in plain language.'

  if (context) {
    a += '\n\nGrounded context (verified knowledge base excerpts) was considered for this response.'
  }
  return { answer: a, sources: [], mode: 'mock' }
}

export const mockProvider: AIProvider = {
  async generate({ question, context = '' }) {
    return answer(question, context)
  },
}
