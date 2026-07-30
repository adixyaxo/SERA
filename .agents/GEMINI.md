# SERA AI-Assisted Frontend Development Guide

This document (`GEMINI.md`) defines the operational parameters, coding standards, and decision frameworks for the Gemini agent collaborating on the SERA repository. Gemini's role on this project is centered on the **presentation layer** — UI, styling, layout, motion, and frontend design quality. Logic-, data-, and backend-layer changes are out of scope for autonomous action and are treated as human-gated.

---

## 1. Project Philosophy

SERA is built for the long term. As an AI-assisted project, Gemini emphasizes:

- **Zero Regressions**: Existing UI functionality and behavior must never break.
- **Rapid UI Iteration**: The presentation layer is fluid and meant to be optimized continuously — this is Gemini's primary domain.
- **Design Consistency**: Visual language, spacing, typography, and component patterns should stay coherent across the app.
- **Protected Core Logic**: Business logic, data, and backend systems are out of scope for autonomous Gemini action.
- **Continuous Validation**: Visual and behavioral correctness must be proven through tests and, where relevant, manual/visual review.

---

## 2. Repository Structure

- **`src/components/` & `src/pages/`**: UI Layer. **Gemini's primary working area.** Safe for autonomous layout, styling, animation, and design-system improvements.
- **`src/styles/`, design tokens, Tailwind/CSS config**: Visual Design Layer. **Gemini's primary working area.**
- **`src/hooks/`, `src/contexts/`, `src/lib/`**: Business Logic & State Layer. **Out of scope. Requires human approval and ideally a logic-focused agent.**
- **`supabase/functions/`**: Backend API Layer. **Out of scope for Gemini. Do not modify.**
- **`supabase/migrations/`**: Database Schema Layer. **Out of scope for Gemini. Do not modify.**
- **`docs/`**: Documentation Layer. Should be kept updated for any UI/design decisions Gemini makes.

---

## 3. Coding Standards

- **Typing**: Strict TypeScript typing must be maintained in all UI code. Do not use `any`. Define explicit prop and component interfaces.
- **Composition**: Prefer composition over duplication. Build and reuse UI primitives (buttons, cards, layout wrappers, etc.) rather than one-off implementations.
- **Component Size**: Keep components small and focused on a single visual responsibility. Split large components into presentational sub-components.
- **Readability**: Prefer readability over cleverness, especially in JSX/markup structure.
- **Design Tokens over Magic Values**: Use existing design tokens (spacing, color, radius, typography scales) instead of hardcoded values wherever a token exists.
- **Self-Documenting Code**: Component, prop, and variable names must clearly describe their visual purpose (e.g. `PrimaryActionButton`, not `Btn2`).

---

## 4. Architecture Rules (Frontend Scope)

- **Consistent Paradigms**: Do not introduce new styling systems, component libraries, or animation frameworks without explicit approval.
- **Modularity**: New UI features should be encapsulated in their own components/directories.
- **No Prop-Drilling Sprawl**: Prefer composition or existing context providers over threading props through many layers; do not create new global state to solve a purely visual problem.
- **Presentational vs. Container Separation**: Keep visual/presentational components decoupled from data-fetching or business logic — pass data and callbacks in via props rather than reaching into logic layers directly.

---

## 5. Testing Strategy

*Philosophy: UI behavior that affects what users see or how they interact must be tested; purely visual polish is validated through review rather than heavy test suites.*

### Mandatory Test Types (Frontend)

- Component rendering tests
- Snapshot tests for complex or frequently-changing UI
- Accessibility (a11y) tests (roles, labels, keyboard navigation, contrast)
- Responsive/layout smoke tests where feasible
- Interaction tests (clicks, form input, focus states) for components with behavior

### Testing Rules

- Every new UI component should include a basic render test.
- Every UI bug fix should include a regression test to prevent recurrence.
- Do not write or modify tests for business logic, API contracts, or backend behavior — flag these to the user instead.
- Visual/UI changes should preserve any existing prop contracts and data requirements a component relies on.

### Coverage Expectations

- **UI Components**: Reasonable coverage on interactive and reusable components; exhaustive coverage is not required for purely static/presentational markup.
- **Critical flows touching Auth/Billing UI**: Coordinate with the logic-layer owner — do not assume full coverage responsibility for logic behind these screens.

### Before Committing Changes

Gemini should ensure the following steps are executed:

1. Run linting.
2. Run formatting.
3. Run type checking.
4. Run relevant component/UI tests.
5. Ensure zero failing tests.
6. Visually sanity-check the change where possible (e.g. via a dev preview or description of expected appearance).

---

## 6. Agent Decision Framework

Gemini must consult this matrix before executing any changes:

| Modification Type | Gemini Autonomy Level | Required Action |
| :--- | :--- | :--- |
| **UI Layout / Spacing** | Autonomously Proceed | Implement and format. |
| **Styling / Typography** | Autonomously Proceed | Implement and format. |
| **Animations / Motion** | Autonomously Proceed | Implement and format. |
| **Responsive Design** | Autonomously Proceed | Implement and format. |
| **Accessibility (a11y)** | Autonomously Proceed | Implement and format. |
| **Design System / Tokens** | Autonomously Proceed | Implement and format; document changes. |
| **Component Visual Refactor** | Autonomously Proceed | Only if behavior and props remain strictly unchanged. |
| **Component Prop/Interface Change** | **STOP** | Ask User. |
| **Logic Change** | **STOP** | Ask User. |
| **Database/Schema Change** | **STOP** | Ask User. |
| **API Contract Change** | **STOP** | Ask User. |
| **Auth / Security Change** | **STOP** | Ask User. |
| **Architecture Change** | **STOP** | Ask User. |
| **Dependency Replacement** | **STOP** | Ask User. |
| **Breaking Change** | **STOP** | Ask User. |
| **Routing Behavior Change** | **STOP** | Ask User, unless explicitly requested. |

---

## 7. UI Modification Rules

Gemini may freely improve the UI layer — layouts, styling, spacing, animations, responsiveness, accessibility, typography, design systems, and component organization — without asking the user.

**Strict Restrictions:**

- Do not alter underlying business logic.
- Do not change API contracts or data requirements of a component.
- Do not change data models.
- Do not rename public interfaces or exported props without approval.
- Do not modify routing behavior unless explicitly requested.
- Do not reach into `src/hooks/`, `src/contexts/`, `src/lib/`, or `supabase/` to "fix" something in service of a UI task — flag the underlying issue to the user instead.

---

## 8. Out-of-Scope: Backend & Logic

**Gemini is explicitly forbidden from autonomously modifying backend or business-logic code.**

If a UI task appears to require a logic, data, schema, API, or auth change to complete properly, Gemini must stop and surface this to the user rather than making the change itself.

**Required Questions Before Flagging a Logic Dependency:**

1. What UI goal is blocked by the current logic/data/API shape?
2. Is there a purely presentational way to achieve the same goal without a logic change?
3. If not, what specifically would need to change outside the UI layer?
4. Should the user route this to a logic-focused agent or handle it directly?

---

## 9. Refactoring Policy

- Refactoring UI components for readability, composability, or performance is allowed autonomously, provided tests continue to pass and visual/behavioral output is identical.
- Refactoring anything outside the UI layer (hooks, contexts, lib, backend) is out of scope — surface a recommendation to the user instead of implementing it.
- **Never introduce TODO placeholders** into production UI code.

---

## 10. Security Rules (Frontend-Relevant)

- **Never reduce or bypass client-side auth gating** (e.g., conditionally hiding UI based on role/permission) without explicit approval.
- **Never expose sensitive data in the UI** (tokens, internal IDs, unredacted PII) even temporarily for debugging.
- Flag to the user any UI change that would surface data that may not be intended for the current user's permission level.

---

## 11. Performance Rules

- **Never degrade UI performance or perceived responsiveness.**
- Large list rendering must use virtualization where applicable.
- Avoid unnecessary re-renders by properly utilizing `useMemo`, `useCallback`, `React.memo`, or restructuring component state/props.
- Prefer CSS-based animation over JS-driven animation where it achieves the same effect with less overhead.
- Watch bundle size impact when adding new UI dependencies (icons, animation libraries, etc.).

---

## 12. Design & Documentation Standards

Gemini must actively maintain frontend-relevant documentation:

- Document notable design decisions (new patterns, token additions, layout conventions) in the `docs/` folder.
- Document reusable UI components and their props using JSDoc/TSDoc.
- Note any new UI-related environment variables (e.g. feature flags) in `.env.example`.
- Document visual/behavioral changes and any manual verification steps for the user.
- **Keep UI-relevant sections of README.md synchronized** with the current state of the component library and design system.

---

## 13. Commit Guidelines

- **Search before creating**: Check for existing UI primitives, patterns, and design tokens before building new ones, to avoid visual and code duplication.
- Explain notable design decisions clearly if proposing new patterns to the user.
- Ensure the diff is as minimal as necessary to achieve the visual/UX objective.

---

## 14. Definition of Done

A UI task is only considered complete when:

- [ ] All relevant tests pass.
- [ ] No lint errors exist.
- [ ] No type errors exist.
- [ ] Documentation is updated for any new components/patterns.
- [ ] No duplicated UI logic or components were introduced.
- [ ] Design system consistency is maintained (spacing, color, typography, tokens).
- [ ] Performance is not degraded.
- [ ] Accessibility (a11y) standards are maintained or improved.
- [ ] Regression tests are added for any behavior changes.
- [ ] No business logic, API contracts, or data models were touched.
- [ ] Feature is described to the user for manual visual verification.

---

*Note to Gemini: You must read and internalize this document upon initialization. Your scope is the presentation layer. Any task that appears to require logic, data, or backend changes should be flagged to the user rather than implemented directly.*