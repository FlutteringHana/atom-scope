# AtomScope — Documentation Guide

> [!info] Document Status
> - Document Type: Documentation Standard
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Purpose

This guide defines how AtomScope documentation is organized, maintained, and used during development. Its purpose is to prevent duplicated specifications, conflicting decisions, and unnecessary repetition across project documents.

## 2. Documentation Structure

```text
docs/
├── 00-foundation/
│   ├── PROJECT_OVERVIEW.md
│   ├── PROJECT_DECISION_LOG.md  # NEW
│   └── DOCUMENTATION_GUIDE.md
├── 01-knowledge/
│   ├── PHYSICS_KNOWLEDGE_ARCHITECTURE.md
│   └── LEARNING_CONTENT_SPEC.md
├── 02-product/
│   ├── PRODUCT_SPEC.md
│   ├── INFORMATION_ARCHITECTURE.md
│   ├── GUI_DESIGN_SPEC.md
│   └── VISUALIZATION_SYSTEM_SPEC.md
├── 03-physics/
│   ├── MATHEMATICAL_REFERENCE.md
│   ├── physical-model-specifications/
│   └── experiment-simulation-specifications/
├── 04-engineering/
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── VALIDATION_STRATEGY.md
├── 05-planning/
│   └── ROADMAP.md
└── 06-decisions/
    ├── ADR-0001-technology-stack.md
    ├── ADR-0002-visualization-architecture.md
    ├── ADR-0003-knowledge-navigation.md
    └── ADR-0004-workspace-modes.md
```

## 3. Document Responsibilities

| Document | Single responsibility |
|---|---|
| Project Overview | Product identity, objectives, scope, non-goals |
| Project Decision Log | Project owner's meta-decisions, project direction changes, and major development-stage decisions |
| Physics Knowledge Architecture | Course knowledge scope, hierarchy, and conceptual relationships |
| Learning Content Spec | Reusable structure of a knowledge module |
| Product Spec | User-facing capabilities and functional requirements |
| Information Architecture | Knowledge hierarchy, navigation, and relationships |
| GUI Design Spec | Global layout, visual language, and interaction patterns |
| Visualization System Spec | Visualization categories, templates, and shared behavior |
| Mathematical Reference | Canonical equations, symbols, units, and notation |
| Physics specifications | Scientific assumptions, equations, and computational models |
| Technical Architecture | Software boundaries, data flow, and implementation structure |
| Validation Strategy | Tests for physical, numerical, and software correctness |
| Roadmap | Milestones, deliverables, and exit criteria |
| ADRs | Context and rationale for important decisions |

## 4. Source of Truth and Conflict Resolution

Use the following ownership rules:

| Information | Authoritative source |
|---|---|
| Course knowledge scope and organization | Physics Knowledge Architecture |
| Knowledge-module content structure | Learning Content Spec |
| Product capabilities | Product Spec |
| Knowledge navigation and hierarchy | Information Architecture |
| Global GUI behavior and visual language | GUI Design Spec |
| Visualization behavior and patterns | Visualization System Spec |
| Canonical symbols and shared constants | Mathematical Reference |
| Topic-specific physical assumptions and equations | Relevant Physics Specification |
| Software structure and implementation boundaries | Technical Architecture |
| Verification requirements | Validation Strategy |
| Current milestone and project phase | Roadmap |
| Historical rationale for decisions | ADR |

When documents appear to conflict:
1. Identify which document owns the disputed information.
2. Update the authoritative document first.
3. Update dependent documents only where necessary.
4. Record consequential architectural decisions in an ADR.
5. Do not preserve conflicting copies of the same specification.

The Physics Knowledge Architecture is the authority for course coverage. Product and technical documents may explain how its knowledge is presented, but must not silently redefine the course content.

## 5. Document Status

Use these statuses consistently:

| Status | Meaning |
|---|---|
| Draft | Work in progress; not yet reviewed |
| Proposed | Ready for review and discussion |
| Accepted | Approved as the current project specification |
| Deprecated | No longer recommended for use |
| Superseded | Replaced by a newer document or decision |

`Accepted` describes the status of a specification, not implementation completion. Implementation status belongs in the roadmap or project issue tracker.

## 6. Document Header

Use this header for maintained specifications:

```markdown
> [!info] Document Status
> - Document Type: Specification
> - Status: Draft
> - Version: 0.1
> - Last Updated: YYYY-MM-DD
> - Scope: AtomScope / [specific scope]
```

Use semantic document versions where useful:
- `0.x`: evolving pre-release specification.
- `1.0`: first accepted stable specification.
- Increment minor versions for compatible additions.
- Increment major versions when the document's structure or commitments change substantially.

## 7. Writing and Maintenance Rules

- Prefer one authoritative definition over repeated copies.
- Link to other documents rather than duplicating their content.
- Separate confirmed requirements from proposals and open questions.
- Mark approximations, assumptions, and course-specific uncertainties explicitly.
- Do not create a separate document for every small UI component.
- Create a dedicated physics specification when a topic has substantial independent assumptions, equations, or computational behavior.
- Keep implementation task lists in the issue tracker rather than duplicating them in specifications.
- Update documentation when an implementation changes an accepted behavior.

## 8. AI-Assisted Development

Before changing a feature, an AI coding assistant should:
1. Read `README.md` and `PROJECT_OVERVIEW.md`.
2. Read the relevant product or visualization specification.
3. Read the relevant Physics Knowledge Architecture section.
4. Read the topic-specific physics specification, if one exists.
5. Read `TECHNICAL_ARCHITECTURE.md`.
6. Check relevant ADRs and current project tasks.

AI assistants must not:
- Invent course requirements not supported by the knowledge architecture or course materials.
- silently replace accepted design decisions.
- mix UI implementation details into physics specifications.
- change physical assumptions without documenting and validating the change.
- treat illustrative visualizations as physically exact unless the specification says so.

## 9. Change Process

For a significant change:
1. Identify the affected document and its owner.
2. Update the authoritative specification.
3. Review dependent documents.
4. Add or update an ADR if the change affects an important architectural decision.
5. Update validation requirements if physical or numerical behavior changes.
6. Update the roadmap or issue tracker if scope or delivery changes.
