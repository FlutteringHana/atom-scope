# AtomScope — Project Overview

> [!info] Document Status
> - Document Type: Project Definition
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11
> - Authority: Project-level product identity and scope

## 1. Project Introduction

AtomScope is an interactive physics learning and exploration platform. Its initial subject is the Atomic Physics content covered by the course's Atom and Photons / Quantum Optics section.

The project reorganizes course knowledge around physical theories, models, mathematical relationships, and experimental phenomena rather than reproducing a lecture sequence. It aims to help learners understand not only individual concepts, but also the relationships between models, mathematical descriptions, observable phenomena, and experimental evidence.

AtomScope is not intended to be a conventional article-based course website or a general-purpose research-grade physics simulator. It is a learning environment in which interactive scientific visualization is a primary way to enter and explore physics knowledge.

## 2. Product Positioning

**Positioning statement:**

> AtomScope is a knowledge-centered, visualization-first interactive learning environment for exploring atomic physics.

The product combines:
- A structured Physics Knowledge Architecture.
- Interactive visualizations of physical models, experiments, and data.
- Contextual explanations that support active exploration.
- Deeper knowledge details, derivations, and supplementary information.
- Connections between related knowledge topics.

The project should preserve the distinction between a physical model, its mathematical description, an observable phenomenon, and the historical context in which the model developed.

## 3. Objectives

### 3.1 Learning Objectives

AtomScope should help learners:
- Understand core physical concepts and principles.
- Understand the assumptions and behavior of physical models.
- Interpret mathematical relationships and connect equations with physical meaning.
- Explore phenomena predicted or explained by models.
- Understand how experiments provide evidence for physical theories.
- Recognize model applicability and limitations.
- Navigate relationships across the course's knowledge structure.

### 3.2 Product Objectives

The application should:
- Make interactive visualization the primary entry point of a knowledge module.
- Provide consistent navigation across the course knowledge architecture.
- Support multiple visualization types within one knowledge module.
- Separate the visualization experience from deeper reading without disconnecting them.
- Remain extensible as further course topics and visualizations are added.

## 4. Initial Scope

The initial subject scope follows the three parts of the approved project knowledge architecture.

### Part I — Atomic Structure and Nuclear Model

Includes electron discovery and atomic constituents, Thomson's model, Rutherford's nuclear model, classical atomic model limitations, and their experimental and mathematical foundations.

### Part II — Quantization and Atomic Energy States

Includes blackbody radiation, Planck's quantum hypothesis, the photoelectric effect, the Bohr model, hydrogen-like atoms and ions, the Bohr-Sommerfeld model, atomic energy transitions, atomic spectroscopy, and the Franck-Hertz experiment.

### Part III — Introduction to Quantum Mechanics

Includes wave-particle duality, de Broglie matter waves, wave functions, the Schrödinger equation, quantum states, atomic orbitals, and the relevant experimental foundations identified in the Physics Knowledge Architecture.

The exact course-specific depth of individual topics remains governed by the Physics Knowledge Architecture and any subsequent course-material review.

## 5. Out of Scope for the Initial Release

The following are not initial-release requirements:
- A general-purpose multi-atom or molecular simulation engine.
- Research-grade numerical accuracy beyond the documented educational models.
- Advanced quantum topics identified as extensions in the Physics Knowledge Architecture, unless later approved.
- A mandatory quiz, examination, or scoring system.
- User accounts, cloud synchronization, or learning analytics unless later required.
- A full 3D environment where a 2D visualization communicates the physics adequately.

Quiz functionality is explicitly deferred. It may be reconsidered after a working product exists and actual learning interactions can be evaluated.

## 6. Core Product Principles

1. **Physics accuracy first.** Visual presentation must not distort the underlying physics.
2. **Knowledge-centered organization.** The course knowledge architecture, not a sequence of animations, determines the information structure.
3. **Visualization-first experience.** A knowledge module should open with its principal interactive visualization whenever one is appropriate.
4. **Model transparency.** Assumptions, approximations, units, and limitations must be visible when relevant.
5. **Mathematics connected to meaning.** Equations should be interpretable, not decorative.
6. **Experiment as evidence.** Experimental views should distinguish setup, procedure, observations, and theoretical interpretation.
7. **Flexible exploration.** Users may explore visually, consult contextual explanations, or read deeper details in their own order.
8. **Progressive disclosure.** Supporting information should be available without overwhelming the primary experience.
9. **Extensible architecture.** New topics should be added without redesigning the whole application.

## 7. Success Criteria

The initial product can be considered successful when:
- The three course parts can be navigated through a coherent knowledge map.
- Core knowledge topics have structured module pages.
- Relevant topics provide functional visualizations rather than static decorative images.
- Model, Experiment, and Data views can coexist where a topic requires them.
- Users can switch between a workspace view and an immersive visualization view.
- Contextual information is available alongside visualization controls.
- Deeper knowledge details and supplementary information are accessible without dominating the initial view.
- Core calculations have documented validation tests.
- The application clearly communicates important assumptions and model limitations.

## 8. Relationship to Other Documents

- `PHYSICS_KNOWLEDGE_ARCHITECTURE.md` defines the course knowledge scope and organization.
- `LEARNING_CONTENT_SPEC.md` defines the structure of individual knowledge modules.
- Product and GUI documents define what the application presents and how users interact with it.
- Physics specifications define the scientific and mathematical basis of individual simulations.
- Technical and validation documents define implementation and correctness requirements.

This document defines the project's identity and boundaries. It does not prescribe detailed page layouts, equations, or code structure.
