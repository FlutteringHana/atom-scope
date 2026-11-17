# ADR-0004 — Knowledge Workspace and Presentation Mode

> [!info] Decision Status
> - Document Type: Architecture Decision Record
> - Status: Accepted
> - Date: 2026-11-11

## Context

Users need both a focused visualization experience and convenient access to controls and contextual explanations. A permanently fixed split layout may constrain complex visualizations, while a permanent presentation layout may make explanations difficult to access.

## Decision

Provide two user-selectable presentation modes within a knowledge module.

### Workspace Mode

- Main visualization area.
- Side panel containing visualization Controls and Contextual Information.
- Side panel can organize these functions as tabs or sections.
- Knowledge Details remains accessible separately.

### Presentation Mode

- Visualization receives substantially more screen space.
- Side panel is hidden or minimized.
- A visible control returns the user to Workspace Mode.

The mode switch should preserve the active topic, selected visualization, and current simulation state where practical.

## Consequences

Positive:
- Supports different exploration preferences.
- Keeps controls and explanations close to the visualization.
- Allows complex visualizations to use more screen area.

Trade-offs:
- Responsive behavior and state preservation need implementation testing.
- The interface must make the current mode and return action obvious.

## Terminology and navigation refinement — 2026-11-17

The owner clarified the user-facing name as **Presentation Mode / 演示模式**. This replaces the former immersive-mode label while retaining the current state-preserving workspace behavior. Presentation Mode hides the module's parameter/context panel and deeper-reading section, with a visible return action and Escape support. It is a presentation layout, not an automatic browser fullscreen operation.

The global left course navigation can independently collapse from a persistent desktop header control, releasing its column without unmounting the active module. In-app navigation retains that choice. Mobile continues to use its directory drawer, independently of the desktop collapse state.

## Related Design

Knowledge Details is a separate deeper-reading section, normally entered from a lower or peripheral part of the knowledge page. It is not the same as the contextual side panel.
