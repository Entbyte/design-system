# Design System Governance Rules

## Structure
- All components live under `src/components/<Category>/<Name>/`.
- Each component must have:
  - `<Name>.tsx`
  - `<Name>.stories.tsx`
  - `index.ts` that re-exports the component.

## Naming
- Components use **PascalCase** (e.g. `PrimaryButton`).
- Props must be clear and not abbreviated (e.g. `variant`, `size`, `disabled`).

## Storybook
- Every component must have at least:
  - A `Primary` story with realistic values.
  - A `Disabled` story if relevant.
- `title` follows the pattern: `Components/<Category>/<Name>`.

## Accessibility
- All interactive elements must have an `aria-label` or a visible label.
- No body text is allowed below a 4.5:1 contrast ratio.