# SERA AI-Assisted Development Guide

This document (`CLAUDE.md`) defines the strict operational parameters, coding standards, and decision frameworks for AI agents collaborating on the SERA repository. The primary goal is to maintain a repository optimized for autonomous AI-assisted development while strictly preserving code stability, high test coverage, and predictable behavior.

---

## 1. Project Philosophy

SERA is built for the long term. As an AI-assisted project, we emphasize:
- **Zero Regressions**: Existing functionality must never break.
- **Rapid UI Iteration**: The presentation layer is fluid and meant to be optimized continuously.
- **Protected Core Logic**: Architectural, backend, and business logic changes require human confirmation.
- **Continuous Validation**: Correctness must be continuously proven through automated testing.
- **Maintainable AI Collaboration**: Code must remain explicit, readable, and modular so that future AI context windows can easily parse and extend it.

---

## 2. Repository Structure

Understanding the repository boundaries is essential for the AI decision matrix:
- **`src/components/` & `src/pages/`**: UI Layer. Safe for autonomous layout, styling, and animation improvements.
- **`src/hooks/`, `src/contexts/`, `src/lib/`**: Business Logic & State Layer. **Requires human approval to modify.**
- **`supabase/functions/`**: Backend API Layer. **Requires human approval to modify.**
- **`supabase/migrations/`**: Database Schema Layer. **Requires human approval to modify.**
- **`docs/`**: Documentation Layer. Should be kept rigorously updated.

---

## 3. Coding Standards

- **Typing**: Strict TypeScript typing must be maintained. Do not use `any`. Define explicit interfaces and types.
- **Composition**: Prefer composition over duplication. Create reusable UI primitives.
- **Function Size**: Keep functions small and focused on a single responsibility.
- **Readability**: Prefer readability over cleverness. Code is read more often than it is written.
- **Optimization**: Avoid premature optimization. Optimize for maintainability first.
- **Cohesion & Coupling**: Maximize cohesion within modules; minimize coupling between modules.
- **Self-Documenting Code**: Variable and function names must explicitly describe their purpose.

---

## 4. Architecture Rules

- **Consistent Paradigms**: Do not introduce new state management libraries or data fetching paradigms without explicit approval.
- **Modularity**: New features should be encapsulated.
- **No Global State Sprawl**: Limit the use of global contexts to truly global state (Auth, Theme).
- **Idempotency**: Edge functions and API routes should be written to be idempotent where applicable.

---

## 5. Testing Strategy

*Philosophy: Anything deterministic, analytical, computational, architectural, or business-critical must be tested.*

### Mandatory Test Types
- Unit tests
- Integration tests
- Regression tests
- Snapshot tests (where appropriate for complex UI)
- API contract tests
- Schema validation tests
- Business logic & Edge case tests
- Boundary & Error handling tests
- Performance smoke tests

### Testing Rules
- Every new feature must include corresponding tests.
- Every bug fix must include a regression test to prevent recurrence.
- Algorithms require deterministic test cases.
- Parsers require malformed input tests.
- Validators must test both valid and invalid data states.
- API endpoints, utility functions, reusable components, and critical calculations must be tested.
- Authentication flows and authorization rules must be tested.

### Coverage Expectations
- **Minimum Overall Coverage**: 90%
- **Critical Modules (Auth, Billing, Core Logic)**: 100%

### Before Committing Changes
The AI must ensure the following steps are executed:
1. Run linting.
2. Run formatting.
3. Run type checking.
4. Run unit and integration tests.
5. Ensure zero failing tests.
6. Ensure no skipped tests (unless explicitly documented and approved).

---

## 6. Agent Decision Framework

The AI must consult this matrix before executing any changes:

| Modification Type | AI Autonomy Level | Required Action |
| :--- | :--- | :--- |
| **UI Layout / Spacing** | Autonomously Proceed | Implement and format. |
| **Styling / Typography** | Autonomously Proceed | Implement and format. |
| **Animations / Motion** | Autonomously Proceed | Implement and format. |
| **Responsive Design** | Autonomously Proceed | Implement and format. |
| **Accessibility (a11y)** | Autonomously Proceed | Implement and format. |
| **Component Refactor** | Autonomously Proceed | Only if behavior remains strictly unchanged. |
| **Logic Change** | **STOP** | Ask User. |
| **Database/Schema Change** | **STOP** | Ask User. |
| **API Contract Change** | **STOP** | Ask User. |
| **Auth / Security Change** | **STOP** | Ask User. |
| **Architecture Change** | **STOP** | Ask User. |
| **Dependency Replacement** | **STOP** | Ask User. |
| **Breaking Change** | **STOP** | Ask User. |

---

## 7. UI Modification Rules

The AI agent may freely improve the UI layer (layouts, styling, spacing, animations, responsiveness, accessibility, typography, design systems, and component organization) without asking the user.

**Strict Restrictions:**
- Do not alter underlying business logic.
- Do not change API contracts or data requirements of a component.
- Do not change data models.
- Do not rename public interfaces or exported props.
- Do not modify routing behavior unless explicitly requested.

---

## 8. Backend Modification Rules

**The AI agent is explicitly forbidden from autonomously modifying backend code.**
Before modifying any backend logic, business logic, architecture, database schema, APIs, authentication, authorization, state management, or algorithms, the agent **must stop and question the user**.

**Required Questions before Backend Modification:**
1. What problem are we solving?
2. Are there existing constraints I should be aware of?
3. Should this remain backward compatible?
4. How should the tests be updated to reflect this?
5. Is this intended to change behavior or only improve implementation?

---

## 9. Refactoring Policy

- Refactoring UI components for better readability or performance is allowed autonomously, provided tests continue to pass and visual/behavioral output is identical.
- Refactoring core logic requires user approval and must be accompanied by a 100% test pass rate.
- **Never introduce TODO placeholders** into production code.

---

## 10. Security Rules

- **Never reduce security checks.**
- **Never bypass authentication or authorization** rules, even for testing purposes in production code.
- **Never expose internal APIs** without verifying RLS (Row Level Security) or token validation.
- Identify and warn the user of potential risks before implementing logic that touches PII or critical systems.

---

## 11. Performance Rules

- **Never degrade performance.**
- Large list rendering must use virtualization if applicable.
- Avoid unnecessary re-renders in React by properly utilizing `useMemo`, `useCallback`, or restructuring component state.
- Edge functions should execute within acceptable latency limits (e.g., <500ms where possible).

---

## 12. Documentation Standards

The AI must actively maintain project documentation:
- Document architectural decisions in the `docs/` folder.
- Document public APIs using JSDoc/TSDoc.
- Document new environment variables in a `.env.example` file.
- Document breaking changes and migration steps for the user.
- **Keep the README.md synchronized** with the current state of the repository.

---

## 13. Commit Guidelines

- **Search before creating**: Analyze existing architecture and search for existing implementations before writing new code to avoid duplication.
- Explain significant architectural decisions clearly if proposing them to the user.
- Ensure the diff is as minimal as necessary to achieve the objective.

---

## 14. Definition of Done

A task is only considered complete when:
- [ ] All tests pass.
- [ ] No lint errors exist.
- [ ] No type errors exist.
- [ ] Documentation is updated.
- [ ] No duplicated logic was introduced.
- [ ] Overall architecture remains consistent.
- [ ] Performance is not degraded.
- [ ] Accessibility (a11y) standards are maintained.
- [ ] Regression tests are added for any behavior changes.
- [ ] Feature is verified manually (if UI-related) via an explicit instruction to the user.

---

*Note to AI Agents: You must read and internalize this document upon initialization. Adherence to these rules is mandatory and non-negotiable.*
