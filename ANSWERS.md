# Assessment Answers

## 1. How to run

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

Build the production version:

```bash
npm run build
```

Deployment will be done with GitHub Pages. The deployed URL is: https://GhayyasAhmed.github.io/tip-calculator-assessment

## 2. Stack & design choices

I chose React + TypeScript + Vite because this task depends on live input state, derived totals, validation states, and fast iteration. React fits the controlled-input model well, TypeScript keeps the calculation and validation contracts explicit, and Vite keeps setup and local development lightweight.

Specific decision 1: the result panel is placed to the right of the form on desktop and below the form on mobile. This affects the calculation results area. On a 1440px laptop, the user can enter values and compare the totals without scrolling. On a 360px phone, putting the result below the inputs keeps the flow natural after the user finishes entering the number of people.

Specific decision 2: the preset tip buttons use a filled active state while the custom tip input clears the active preset when typed into. This affects the tip percentage control. I wanted the selected tip source to be unambiguous, so the user never has to wonder whether the app is using a preset or the custom value.

## 3. Responsive & accessibility

At 360px wide, the app uses a single-column layout: inputs are full-width, tip controls wrap into two columns, and the output panel appears below the inputs so the user can reach the result after typing. At 1440px wide, the app uses a two-column layout with the form on the left and the output panel on the right for faster scanning.

One accessibility consideration I handled was connecting field errors to their inputs with `aria-describedby` and marking invalid fields with `aria-invalid`. This helps assistive technology announce the relevant error instead of leaving the user to visually search for it.

One accessibility improvement I knowingly skipped is a live region for announcing recalculated totals after every keystroke. I skipped it because the totals update very frequently while typing, and a live announcement could become noisy. With another pass, I would add a polite summary that announces only after the user pauses typing.

## 4. AI usage

I used Codex to help plan the work, scaffold the Vite + React + TypeScript project, implement the calculator UI, wire validation states, and draft the documentation. Codex also helped inspect the assessment PDF and turn the requirements into a step-by-step implementation plan.

One specific AI-assisted area was the responsive and accessibility pass. Codex proposed adding `aria-invalid`, `aria-describedby`, and `aria-pressed`. I manually reviewed that output against the assessment requirements and kept those changes because they directly supported keyboard and screen-reader behavior. I also kept the output panel as a normal page section instead of a sticky/fixed element, because a fixed result panel could be covered by the mobile keyboard and would make the small-screen experience worse.

## 5. Honest gap

The least polished part is that there is no automated test suite for the calculation and validation utilities yet. The core logic is separated into a pure TypeScript file, so with another day I would add unit tests for edge cases like pasted text, zero people, bill amounts above Rs 10,000,000, decimal tips, and per-person rounding. That would make future changes safer and prove the behavior more clearly than manual testing alone.

## Rounding Policy

The per-person share is rounded up to 2 decimal places using:

```ts
Math.ceil(value * 100) / 100
```

I chose this over round-to-nearest because splitting a bill should avoid underpaying the total. Rounding to the nearest cent can leave the group short by a small amount when the total does not divide evenly. Rounding up makes the displayed per-person amount slightly conservative and easier to trust in real payment scenarios.
