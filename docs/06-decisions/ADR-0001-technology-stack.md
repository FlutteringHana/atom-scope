# ADR-0001 — Frontend Technology Stack

> [!info] Decision Status
> - Document Type: Architecture Decision Record
> - Status: Accepted
> - Date: 2026-11-11

## Context

AtomScope requires an interactive browser-based learning platform with structured content, parameter controls, multiple visualization types, and a maintainable physics computation layer.

## Decision

Use:
- React for the UI framework.
- TypeScript for application and physics-layer typing.
- Vite for development and build tooling.

## Alternatives Considered

- Vanilla TypeScript with Vite.
- Other frontend frameworks.

React is selected as the initial framework because the product contains reusable page structures, side panels, navigation, and coordinated interactive components.

## Consequences

Positive:
- Reusable component model.
- TypeScript support across UI and computation.
- Fast development feedback through Vite.
- Broad ecosystem.

Trade-offs:
- React introduces framework concepts and state/rendering considerations.
- Care is needed to prevent physics calculations from becoming coupled to UI components.

## Follow-up

Specific routing, state-management, styling, charting, and rendering libraries remain open until implementation demonstrates a concrete need.
