# AtomScope

**An interactive physics learning and exploration platform, beginning with Atomic Physics.**

AtomScope is organized around the course's physics knowledge structure. It combines interactive scientific visualizations, mathematical descriptions, experimental exploration, and supporting explanations in one learning environment.

The project is **knowledge-first and visualization-first**:
- The Physics Knowledge Architecture defines what knowledge is covered and how it is organized.
- Each knowledge module provides an interactive entry point into a physical model, experiment, or data relationship.
- Contextual information supports exploration without turning the main experience into a conventional article.
- Deeper explanations and supplementary material remain available through a separate Knowledge Details section.

## Current scope

The initial scope follows the course's Atomic Physics knowledge architecture:

1. Atomic Structure and Nuclear Model
2. Quantization and Atomic Energy States
3. Introduction to Quantum Mechanics

The authoritative course-level structure is maintained in:

`docs/01-knowledge/PHYSICS_KNOWLEDGE_ARCHITECTURE.md`

## Documentation

| Area | Purpose |
|---|---|
| [Project Overview](docs/00-foundation/PROJECT_OVERVIEW.md) | Product identity, objectives, scope, and principles |
| [Project Decision Log](docs/00-foundation/PROJECT_DECISION_LOG.md) | Records project-level meta-decisions and changes in project direction |
| [Documentation Guide](docs/00-foundation/DOCUMENTATION_GUIDE.md) | Documentation ownership and change rules |
| [Learning Content Spec](docs/01-knowledge/LEARNING_CONTENT_SPEC.md) | Structure of an individual knowledge module |
| [Product Spec](docs/02-product/PRODUCT_SPEC.md) | Product capabilities and requirements |
| [Information Architecture](docs/02-product/INFORMATION_ARCHITECTURE.md) | Knowledge map, hierarchy, and navigation |
| [GUI Design Spec](docs/02-product/GUI_DESIGN_SPEC.md) | Global interface and workspace behavior |
| [Visualization System Spec](docs/02-product/VISUALIZATION_SYSTEM_SPEC.md) | Model, Experiment, and Data visualization patterns |
| [Mathematical Reference](docs/03-physics/MATHEMATICAL_REFERENCE.md) | Formula and notation registry |
| [Technical Architecture](docs/04-engineering/TECHNICAL_ARCHITECTURE.md) | Frontend and software structure |
| [Validation Strategy](docs/04-engineering/VALIDATION_STRATEGY.md) | Physical and software correctness |
| [Roadmap](docs/05-planning/ROADMAP.md) | Milestones and delivery criteria |
| [Architecture Decisions](docs/06-decisions/) | Important design decisions and rationale |

## Technology baseline

- React
- TypeScript
- Vite

The visualization implementation will use the simplest suitable browser technology for each task. SVG and Canvas are the initial candidates; a specific charting or rendering library is not mandated at this stage.

## Development status

The project is currently in the documentation and product-definition phase. Detailed implementation decisions may be refined during development and recorded in the relevant specification or ADR.

## Local development

The application setup instructions will be added when the initial Vite project is created.
