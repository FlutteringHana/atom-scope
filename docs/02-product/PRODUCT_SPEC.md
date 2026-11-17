# AtomScope — Product Specification

> [!info] Document Status
> - Document Type: Product Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Purpose

This document defines the initial user-facing capabilities of AtomScope. It is derived from the Physics Knowledge Architecture and Project Overview.

It specifies what the product should allow users to do, not how the software should implement those capabilities.

## 2. Primary User Experience

AtomScope supports two complementary activities:

### Knowledge Exploration
Users browse a structured knowledge map, discover topics, and follow conceptual relationships.

### Interactive Learning
Users enter a knowledge module and explore a physical model, experiment, or data relationship through interactive visualization, contextual information, and deeper knowledge details.

## 3. Product Areas

### 3.1 Knowledge Map

The home experience provides access to the three major parts of the Atomic Physics knowledge architecture.

Initial requirements:
- Present Part I, Part II, and Part III as clear top-level areas.
- Allow users to browse topics within each part.
- Support a hierarchical card-based view.
- Provide a way to inspect important cross-topic relationships.
- Clearly distinguish Core, Supporting, and Extension priorities where this metadata is available.
- Link each topic to its knowledge module.

### 3.2 Knowledge Module

A knowledge module is the primary unit of interactive learning.

Requirements:
- Open with the primary visualization when one is available.
- Support Model, Experiment, and Data visualization categories.
- Allow more than one visualization in a module when appropriate.
- Provide a workspace view with a main visualization and side panel.
- Provide a control to switch to a presentation view.
- Provide visualization controls and contextual information in the side panel.
- Provide a Knowledge Details entry near the lower or peripheral page area.
- Provide access to supplementary information and related knowledge.
- Avoid requiring every module to use an identical content composition.

### 3.3 Visualization Workspace

Requirements:
- Display the selected visualization as the main content.
- Provide controls relevant to the visualization.
- Provide contextual information associated with the active visualization.
- Allow the side panel to be expanded, collapsed, or switched between relevant panel sections.
- Support a presentation mode that gives the visualization more screen space.
- Preserve the selected topic and visualization when switching display modes where technically practical.

### 3.4 Knowledge Details

Requirements:
- Offer deeper explanations outside the initial visualization-focused viewport.
- Support structured text, equations, figures, and derivations.
- Include experimental evidence, limitations, and historical context where relevant.
- Allow direct navigation back to the primary visualization.

### 3.5 Supporting Resources

Potential shared resources include:
- Mathematical reference.
- Physical constants and units.
- Glossary or terminology reference.
- Related knowledge links.

These resources should be introduced when their content and user value are sufficiently clear.

## 4. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NAV-001 | Display the three top-level knowledge parts | P0 |
| NAV-002 | Navigate from a part to its topics | P0 |
| NAV-003 | Open a knowledge module from a topic | P0 |
| NAV-004 | Show meaningful relationships between related topics | P1 |
| MOD-001 | Present the primary visualization before long-form details | P0 |
| MOD-002 | Support multiple visualization entries within a module | P0 |
| MOD-003 | Provide contextual information alongside visualization | P0 |
| MOD-004 | Provide a separate Knowledge Details entry | P0 |
| MOD-005 | Provide supplementary information where relevant | P1 |
| VIZ-001 | Support Model visualization patterns | P0 |
| VIZ-002 | Support Experiment visualization patterns | P0 |
| VIZ-003 | Support Data visualization patterns | P0 |
| VIZ-004 | Allow visualization categories to be combined in one module | P0 |
| UI-001 | Provide workspace and presentation display modes | P0 |
| UI-002 | Allow side-panel visibility or mode changes | P0 |
| PHY-001 | Display units and relevant physical quantities clearly | P0 |
| PHY-002 | Identify important assumptions and approximations | P0 |
| PHY-003 | Distinguish simulated, theoretical, and experimental data | P0 |
| EXT-001 | Provide a quiz and assessment system | Deferred |

Priority:
- P0: required for the initial product direction.
- P1: desirable after the core experience is established.
- Deferred: explicitly not part of the initial implementation.

## 5. Non-Functional Requirements

- Scientific correctness takes precedence over visual effects.
- Navigation should remain understandable as the knowledge map grows.
- Visualizations should remain responsive to user input.
- The interface should work on desktop and adapt to smaller screens.
- Content and visualization logic should be maintainable independently.
- Important calculations should be testable without rendering the UI.

## 6. Acceptance Principles

A feature is not complete merely because it renders. It should:
- Meet its stated user-facing behavior.
- Present correct labels, units, and relevant assumptions.
- Behave consistently with the relevant physics specification.
- Provide an understandable path to supporting explanations.
- Avoid confusing simulated output with experimental evidence.
