export const BILL_MAX = 10_000_000
export const TIP_PERCENT_MAX = 100

export type TipCalculation = {
  tipAmount: number
  grandTotal: number
  perPerson: number
}

export type ValidationResult = {
  isValid: boolean
  message?: string
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100

const roundCurrencyUp = (value: number) => Math.ceil(value * 100) / 100

export function calculateTip(
  bill: number,
  tipPercent: number,
  people: number,
): TipCalculation {
  const tipAmount = roundCurrency(bill * (tipPercent / 100))
  const grandTotal = roundCurrency(bill + tipAmount)
  const perPerson = roundCurrencyUp(grandTotal / people)

  return {
    tipAmount,
    grandTotal,
    perPerson,
  }
}

export function validateBill(value: number): ValidationResult {
  if (!Number.isFinite(value)) {
    return { isValid: false, message: 'Enter a valid bill amount.' }
  }

  if (value <= 0) {
    return { isValid: false, message: 'Bill amount must be greater than 0.' }
  }

  if (value > BILL_MAX) {
    return {
      isValid: false,
      message: 'Bill amount must be Rs 10,000,000 or less.',
    }
  }

  return { isValid: true }
}

export function validateTipPercent(value: number): ValidationResult {
  if (!Number.isFinite(value)) {
    return { isValid: false, message: 'Enter a valid tip percentage.' }
  }

  if (value < 0) {
    return { isValid: false, message: 'Tip percentage cannot be negative.' }
  }

  if (value > TIP_PERCENT_MAX) {
    return { isValid: false, message: 'Tip percentage cannot exceed 100%.' }
  }

  return { isValid: true }
}

export function validatePeople(value: number): ValidationResult {
  if (!Number.isFinite(value)) {
    return { isValid: false, message: 'Enter a valid number of people.' }
  }

  if (!Number.isInteger(value)) {
    return {
      isValid: false,
      message: 'Number of people must be a whole number.',
    }
  }

  if (value < 1) {
    return { isValid: false, message: 'Number of people must be at least 1.' }
  }

  return { isValid: true }
}
