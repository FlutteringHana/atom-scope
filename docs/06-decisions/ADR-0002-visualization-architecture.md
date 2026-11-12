# ADR-0002 — Visualization Architecture

> [!info] Decision Status
> - Document Type: Architecture Decision Record
> - Status: Accepted
> - Date: 2026-11-11

## Context

The course contains physical models, experiments, and quantitative relationships. These require different visual representations, but users should experience them as parts of one coherent learning platform.

## Decision

Use three visualization categories:
- Model Visualization.
- Experiment Visualization.
- Data Visualization.

Treat these as composable categories rather than mutually exclusive page types. A knowledge module may contain one or several coordinated visualizations.

Use a shared visualization framework for common behavior and presentation, while allowing each visualization to use a suitable internal layout and renderer.

## Consequences

Positive:
- Supports the range of visualization needs in the course.
- Enables shared controls and contextual information patterns.
- Avoids forcing experiments, models, and charts into one identical template.

Trade-offs:
- Shared interfaces must be designed carefully to avoid over-generalization.
- Some modules will require specialized layouts and state coordination.

## Implementation Guidance

Start with SVG and Canvas as browser-native candidates. Add charting or rendering libraries only when a concrete visualization benefits from them.
