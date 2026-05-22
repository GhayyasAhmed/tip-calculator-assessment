import { useMemo, useState } from 'react'
import styles from './App.module.css'
import {
  calculateTip,
  validateBill,
  validatePeople,
  validateTipPercent,
} from './utils/tipCalculator'

const TIP_PRESETS = [10, 15, 20]

const EMPTY_OUTPUT = '--'

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function parseInputValue(value: string) {
  return value.trim() === '' ? Number.NaN : Number(value)
}

function App() {
  const [bill, setBill] = useState('')
  const [activePreset, setActivePreset] = useState<number | null>(null)
  const [customTip, setCustomTip] = useState('')
  const [people, setPeople] = useState('')
  const [billTouched, setBillTouched] = useState(false)
  const [customTipTouched, setCustomTipTouched] = useState(false)
  const [peopleTouched, setPeopleTouched] = useState(false)

  const tipPercent =
    activePreset ?? (customTip.trim() === '' ? 0 : parseInputValue(customTip))
  const billValue = parseInputValue(bill)
  const peopleValue = parseInputValue(people)
  const billValidation = validateBill(billValue)
  const tipValidation = validateTipPercent(tipPercent)
  const peopleValidation = validatePeople(peopleValue)
  const billError =
    (billTouched || bill.trim() !== '') && !billValidation.isValid
      ? billValidation.message
      : undefined
  const tipError =
    (customTipTouched || customTip.trim() !== '') && !tipValidation.isValid
      ? tipValidation.message
      : undefined
  const peopleError =
    (peopleTouched || people.trim() !== '') && !peopleValidation.isValid
      ? peopleValidation.message
      : undefined
  const isCalculationReady =
    billValidation.isValid && tipValidation.isValid && peopleValidation.isValid
  const billErrorId = billError ? 'bill-error' : undefined
  const tipErrorId = tipError ? 'custom-tip-error' : undefined
  const peopleErrorId = peopleError ? 'people-error' : undefined

  const calculation = useMemo(() => {
    if (!isCalculationReady) {
      return null
    }

    return calculateTip(billValue, tipPercent, peopleValue)
  }, [billValue, isCalculationReady, peopleValue, tipPercent])

  const handlePresetClick = (preset: number) => {
    setActivePreset(preset)
    setCustomTip('')
    setCustomTipTouched(false)
  }

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value)
    setActivePreset(null)
  }

  const handleReset = () => {
    setBill('')
    setActivePreset(null)
    setCustomTip('')
    setPeople('')
    setBillTouched(false)
    setCustomTipTouched(false)
    setPeopleTouched(false)
  }

  return (
    <main className={styles.appShell} aria-label="Tip calculator app">
      <section className={styles.header}>
        <p className={styles.eyebrow}>PKR bill splitter</p>
        <h1>Tip Calculator</h1>
        <p className={styles.intro}>
          Enter the bill, choose a tip, and see each person&apos;s share update
          instantly.
        </p>
      </section>

      <section className={styles.calculator} aria-label="Tip calculator">
        <form
          className={styles.formPanel}
          noValidate
          onSubmit={(event) => event.preventDefault()}
        >
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="bill">
              Bill amount
              <span>Rs / PKR</span>
            </label>
            <div className={styles.inputShell}>
              <span className={styles.prefix}>Rs</span>
              <input
                id="bill"
                className={`${styles.input} ${billError ? styles.inputInvalid : ''}`}
                aria-describedby={billErrorId}
                aria-invalid={Boolean(billError)}
                inputMode="decimal"
                placeholder="0.00"
                type="text"
                value={bill}
                onBlur={() => setBillTouched(true)}
                onChange={(event) => {
                  setBill(event.target.value)
                  setBillTouched(true)
                }}
              />
            </div>
            {billError ? (
              <p className={styles.errorMessage} id="bill-error">
                {billError}
              </p>
            ) : null}
          </div>

          <fieldset className={styles.fieldGroup}>
            <legend className={styles.label}>Tip percentage</legend>
            <div className={styles.tipGrid}>
              {TIP_PRESETS.map((preset) => (
                <button
                  key={preset}
                  className={`${styles.tipButton} ${
                    activePreset === preset ? styles.tipButtonActive : ''
                  }`}
                  aria-pressed={activePreset === preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset}%
                </button>
              ))}
              <div className={styles.customTipShell}>
                <label className={styles.visuallyHidden} htmlFor="custom-tip">
                  Custom tip percentage
                </label>
                <input
                  id="custom-tip"
                  className={`${styles.input} ${tipError ? styles.inputInvalid : ''}`}
                  aria-describedby={tipErrorId}
                  aria-invalid={Boolean(tipError)}
                  inputMode="decimal"
                  placeholder="Custom"
                  type="text"
                  value={customTip}
                  onBlur={() => setCustomTipTouched(true)}
                  onChange={(event) =>
                    handleCustomTipChange(event.target.value)
                  }
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
            {tipError ? (
              <p className={styles.errorMessage} id="custom-tip-error">
                {tipError}
              </p>
            ) : null}
          </fieldset>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="people">
              Number of people
            </label>
            <input
              id="people"
              className={`${styles.input} ${peopleError ? styles.inputInvalid : ''}`}
              aria-describedby={peopleErrorId}
              aria-invalid={Boolean(peopleError)}
              inputMode="numeric"
              placeholder="1"
              type="text"
              value={people}
              onBlur={() => setPeopleTouched(true)}
              onChange={(event) => {
                setPeople(event.target.value)
                setPeopleTouched(true)
              }}
            />
            {peopleError ? (
              <p className={styles.errorMessage} id="people-error">
                {peopleError}
              </p>
            ) : null}
          </div>

          <button className={styles.resetButton} type="button" onClick={handleReset}>
            Reset
          </button>
        </form>

        <aside className={styles.outputPanel} aria-label="Calculation results">
          <div>
            <p className={styles.resultLabel}>Total tip</p>
            <p className={styles.resultValue}>
              {calculation ? formatCurrency(calculation.tipAmount) : EMPTY_OUTPUT}
            </p>
          </div>
          <div>
            <p className={styles.resultLabel}>Grand total</p>
            <p className={styles.resultValue}>
              {calculation ? formatCurrency(calculation.grandTotal) : EMPTY_OUTPUT}
            </p>
          </div>
          <div className={styles.primaryResult}>
            <p className={styles.resultLabel}>Each person pays</p>
            <p className={styles.primaryValue}>
              {calculation ? formatCurrency(calculation.perPerson) : EMPTY_OUTPUT}
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
