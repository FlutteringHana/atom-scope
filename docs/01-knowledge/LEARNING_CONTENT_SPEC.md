# AtomScope — Learning Content Specification

> [!info] Document Status
> - Document Type: Content Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Purpose

This document defines how course knowledge is represented inside an AtomScope knowledge module.

The Physics Knowledge Architecture remains the authority for which topics are included, their conceptual organization, learning outcomes, and course-specific emphasis. This document defines the presentation structure used to turn those topics into an interactive learning experience.

## 2. Content Design Principle

AtomScope uses a **visualization-first knowledge-module design**.

A knowledge module is not primarily a conventional teaching article with an animation embedded in it. It is an interactive exploration space in which the user first encounters a physical model, experiment, or data relationship, then accesses explanations and deeper knowledge as needed.

The intended experience is flexible rather than a mandatory sequence:

**Explore → Observe → Understand → Connect**

Users may enter through visualization, consult contextual information, open deeper details, or follow related knowledge links in any order.

## 3. Knowledge Module Content Structure

A knowledge module may contain the following elements.

### 3.1 Primary Interactive Experience

The primary experience is the most important interactive representation of the topic.

Depending on the topic, it may be:
- A Model Visualization.
- An Experiment Visualization.
- A Data Visualization.
- A coordinated combination of these.

The primary visualization should be presented before long-form explanatory content when a meaningful visualization exists.

### 3.2 Contextual Information

Contextual information supports the active visualization. It should be concise, relevant to the current view, and available without forcing the user to leave the exploration experience.

Possible content:
- Short concept definition.
- Parameter meaning.
- Physical interpretation of the current state.
- Relevant equations.
- Assumptions and approximations.
- Observation prompts or important notes.

Contextual information is presented in the side panel alongside visualization controls. It may be organized as tabs, sections, or another compact pattern defined by the GUI implementation.

### 3.3 Knowledge Details Section

The Knowledge Details Section provides a deeper, more complete treatment of the topic. It is accessed through a clear entry near the lower or peripheral area of the knowledge page, rather than occupying the initial viewport.

Possible sections:
- Concept and Background.
- Physical Principles.
- Mathematical Description and Derivation.
- Physical Interpretation.
- Experimental Evidence.
- Limitations and Applicability.

The exact sections depend on the topic. Do not force every topic to contain every section.

### 3.4 Supplementary Information

Supplementary information provides useful context without interrupting the primary exploration experience.

Examples:
- Historical Context.
- Scientist Profiles.
- Additional Derivations.
- Interesting Facts.
- Advanced Notes.
- References and Further Reading.

Supplementary information may use expandable sections, secondary panels, or dedicated linked resources.

### 3.5 Related Knowledge

Each module should identify meaningful links to other topics where applicable. Links should reflect conceptual relationships, not merely neighboring positions in the course outline.

## 4. Content and Visualization Relationship

Content should be written around the learning value of the visualization.

For each visualization, specify:
- What physical object, process, or relationship is represented.
- What the learner can observe.
- Which parameters can be changed.
- Which physical quantities are displayed.
- Which assumptions or limitations matter.
- What interpretation the learner should be able to make.

The visualization should not be treated as a decorative illustration. Its displayed behavior must correspond to a documented physical model or clearly identified illustrative representation.

## 5. Content Types

Use semantic content types where useful:

| Type | Purpose |
|---|---|
| Definition | Establish the meaning of a concept |
| Explanation | Explain a physical principle or mechanism |
| Equation | Present a mathematical relationship |
| Derivation | Show how a result follows |
| Interpretation | Explain what a mathematical result means physically |
| Observation | Describe or prompt attention to an observable result |
| Assumption | State a model condition or simplification |
| Limitation | Explain where a model is insufficient |
| Historical Context | Explain scientific motivation and development |
| Reference | Point to a source or further reading |

## 6. Writing Principles

- Use precise physics terminology.
- Explain symbols and units near equations or through a consistent reference.
- Distinguish a model from physical reality.
- Distinguish a classical orbit from a quantum orbital.
- Identify whether a value or curve is theoretical, experimental, or simulated.
- Avoid unnecessary historical detail in the primary exploration area.
- Keep contextual explanations concise; place longer derivations in Knowledge Details.
- Preserve the course's level of detail and terminology.

## 7. Deferred Features

A quiz, scoring, or formal assessment system is not part of the initial content specification. Guided observation prompts may be considered as lightweight explanatory aids, but a full Quiz System should only be designed after the first working product can be evaluated.

## 8. Per-Module Content Checklist

```text
[ ] Knowledge topic and course location identified
[ ] Primary visualization or reason for having none identified
[ ] Visualization category/categories identified
[ ] Learning purpose of each visualization described
[ ] Contextual information prepared
[ ] Relevant mathematical relationships identified
[ ] Knowledge Details content prepared where useful
[ ] Supplementary information identified
[ ] Model assumptions and limitations stated
[ ] Related knowledge links identified
[ ] Course scope checked against Physics Knowledge Architecture
```
