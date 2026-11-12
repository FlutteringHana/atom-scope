# AtomScope — Project Decision Log

**Document Type:** Project Decision Log  
**Project:** AtomScope  
**Period:** 2026-11-10 — 2026-11-12

---

## 1. Project Direction — Initial Definition

**2026-11-10**

Initial discussions established the general direction of AtomScope as an interactive physics learning and visualization project.

- Focus on atomic physics, particularly atomic models and related physical phenomena.
- Use interactive visualizations to support the understanding of physical theories and models.
- Initial visualization interests included the Rutherford model, Bohr model, and atomic spectra.
- Adopt an npm-based development environment.

**Decision:** Proceed with AtomScope as a software-based physics visualization project rather than a conventional collection of learning notes.

## 2. Physics Knowledge Architecture — Structural Definition

**2026-11-11**

Discussions shifted toward defining the physics knowledge structure that would underpin the project.

- Reorganize course content around Physics Core Knowledge rather than reproducing the teacher's lecture sequence.
- Establish a theory-centered, model-driven, experiment-supported knowledge architecture.
- Divide the initial scope into three major parts:
  1. Atomic Structure and Nuclear Model
  2. Quantization and Atomic Energy States
  3. Introduction to Quantum Mechanics
- Clarify the relationships between physical theories, mathematical descriptions, experimental phenomena, and historical context.
- Include hydrogen-like atoms and ions, the Bohr-Sommerfeld model, the Schrödinger equation, and atomic orbitals within the architecture.

**Decision:** Establish a dedicated Physics Knowledge Architecture as the physics foundation of AtomScope, independent of its software implementation.

## 3. Project Planning — Refinement and Reassessment

**2026-11-11**

Further discussions explored the details and structure of the project plan.

During this process, the distinction between defining the project and preparing for actual development became clearer.

**Decision:** Discontinue further abstract project-plan discussions and shift toward producing practical development documentation.

## 4. Development Documentation — Transition to Implementation Preparation

**2026-11-11**

The project entered a new documentation phase.

- Move from high-level planning toward documents directly supporting implementation.
- Separate documentation responsibilities instead of consolidating every concern into one extensive project plan.
- Use the Physics Knowledge Architecture as the foundation for deriving learning content, physical models, mathematical references, visualization requirements, and software architecture.

**Decision:** Prioritize practical, modular development documentation as the basis for subsequent implementation.

---

## 5. Current Project Status

- **Project Direction:** Established
- **Physics Knowledge Architecture:** Draft v1.0 established; pending review and confirmation
- **Project Planning:** Initial planning discussions concluded
- **Development Documentation:** Foundation retained; implemented-model specification and validation record added
- **Software Implementation:** First local application delivered; M1 and M2 complete, M3 and M4 in progress (see Roadmap)

## 6. Local Implementation — 2026-11-11

The owner authorized implementation, `.gitignore`, and staged local commits, with no remote push or publication. The first release uses React, TypeScript and Vite, represents all three course Parts, and delivers nine interactive modules alongside explicitly labelled concept notes. Scientific assumptions and calculation conventions are documented before treating the visuals as validated models. Remaining experiments and course-specific Bohr–Sommerfeld depth stay visible as future work rather than being represented by invented measurements.

---

## 7. GitHub Pages Delivery — 2026-11-12

The owner connected the GitHub remote `FlutteringHana/atom-scope` and authorized committing and pushing the GitHub Pages Actions configuration. Add a validated build/deploy workflow and derive Vite's production base path from the Pages configuration. This instruction replaces the initial local-only delivery constraint for the requested Pages work. Model assumptions and learning content are unchanged.

---

*This log records major project-level decisions and changes in direction. Detailed requirements, technical specifications, and implementation decisions should be maintained in their respective project documents.*
