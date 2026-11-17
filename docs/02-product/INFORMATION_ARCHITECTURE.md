# AtomScope — Information Architecture

> [!info] Document Status
> - Document Type: Information Architecture
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Purpose

This document defines how users navigate AtomScope's course knowledge and how information is grouped into pages.

The Physics Knowledge Architecture is the source of truth for course topics and their conceptual organization. This document translates that structure into application navigation.

## 2. Primary Navigation Model

Use a **hybrid knowledge map**:

- Hierarchical cards are the primary way to browse the course structure.
- A relationship view may be used to explore meaningful links between topics.
- The relationship view supplements, rather than replaces, the hierarchical structure.

A free-form graph should not be the only navigation mechanism because it can become difficult to scan and use as the number of topics increases.

## 3. Knowledge Hierarchy

```text
AtomScope
└── Atomic Physics
    ├── Part I — Atomic Structure and Nuclear Model
    │   ├── Knowledge Topics
    │   └── Knowledge Modules
    ├── Part II — Quantization and Atomic Energy States
    │   ├── Knowledge Topics
    │   └── Knowledge Modules
    └── Part III — Introduction to Quantum Mechanics
        ├── Knowledge Topics
        └── Knowledge Modules
```

The detailed topic hierarchy must follow `PHYSICS_KNOWLEDGE_ARCHITECTURE.md`. Do not silently reorder or omit course topics for visual convenience.

## 4. Home / Knowledge Map

The home page should:
- Establish AtomScope identity and provide primary navigation.
- Present the three major course parts as prominent sections or cards.
- Provide a concise description or central question for each part.
- Offer access to topic-level navigation.
- Provide an optional relationship-exploration view.
- Make supporting resources discoverable without competing with the main knowledge map.

The initial view should be clear and relatively low in information density. Individual topic details belong inside the relevant part or module.

## 5. Part Overview

A Part overview page provides:
- Part title and central question.
- A short orientation to the knowledge area.
- Its topic hierarchy.
- Core / Supporting / Extension classification where applicable.
- Important conceptual connections to other parts.
- Entry points to individual knowledge modules.

## 6. Knowledge Topic and Module

A topic entry may lead directly to a knowledge module or to a short topic overview when the topic contains multiple distinct learning modules.

A Knowledge Module contains:
1. Primary interactive visualization area.
2. Visualization selector when multiple views exist.
3. Side panel for visualization controls and contextual information.
4. Workspace / presentation mode control.
5. Knowledge Details entry.
6. Supplementary information and related knowledge links.

## 7. Cross-Topic Relationships

Relationships should be explicit and meaningful. Useful relationship types include:
- Conceptual prerequisite.
- Model extension.
- Mathematical foundation.
- Experimental evidence for a theory.
- Phenomenon explained by a model.
- Historical or theoretical development.

Do not imply that all relationships are strict prerequisites or a single linear learning sequence.

Examples from the course architecture include:
- Rutherford model → motivation for quantization and the Bohr model.
- Bohr energy states → atomic transitions → spectroscopy.
- De Broglie matter waves → Schrödinger equation → atomic orbitals.
- Bohr orbits ↔ quantum orbitals as a conceptual comparison, not equivalent descriptions.

## 8. Supporting Resources

Supporting resources may be accessible through:
- Global navigation.
- Contextual links from knowledge modules.
- The Knowledge Details section.
- Related knowledge panels.

Do not create a separate navigation destination for every small piece of supplementary information.

## 9. Navigation Principles

- Preserve the user's location in the knowledge hierarchy.
- Make the current Part and topic identifiable.
- Provide a clear route back to the Knowledge Map.
- Use related-topic links to encourage exploration without forcing a sequence.
- Avoid making the graph view necessary for basic navigation.
- Keep the number of top-level navigation choices limited.
