import { useMemo, useState } from 'react'
import styles from './App.module.css'
import { calculateTip } from './utils/tipCalculator'

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

  const tipPercent =
    activePreset ?? (customTip.trim() === '' ? 0 : parseInputValue(customTip))

  const calculation = useMemo(() => {
    const billValue = parseInputValue(bill)
    const peopleValue = parseInputValue(people)

    if (
      !Number.isFinite(billValue) ||
      !Number.isFinite(tipPercent) ||
      !Number.isInteger(peopleValue) ||
      billValue <= 0 ||
      tipPercent < 0 ||
      peopleValue < 1
    ) {
      return null
    }

    return calculateTip(billValue, tipPercent, peopleValue)
  }, [bill, people, tipPercent])

  const handlePresetClick = (preset: number) => {
    setActivePreset(preset)
    setCustomTip('')
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
        <div className={styles.formPanel}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="bill">
              Bill amount
              <span>Rs / PKR</span>
            </label>
            <div className={styles.inputShell}>
              <span className={styles.prefix}>Rs</span>
              <input
                id="bill"
                className={styles.input}
                inputMode="decimal"
                placeholder="0.00"
                type="text"
                value={bill}
                onChange={(event) => setBill(event.target.value)}
              />
            </div>
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
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset}%
                </button>
              ))}
              <div className={styles.customTipShell}>
                <input
                  id="custom-tip"
                  className={styles.input}
                  inputMode="decimal"
                  placeholder="Custom"
                  type="text"
                  value={customTip}
                  onChange={(event) =>
                    handleCustomTipChange(event.target.value)
                  }
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </fieldset>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="people">
              Number of people
            </label>
            <input
              id="people"
              className={styles.input}
              inputMode="numeric"
              placeholder="1"
              type="text"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
            />
          </div>

          <button className={styles.resetButton} type="button" onClick={handleReset}>
            Reset
          </button>
        </div>

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
