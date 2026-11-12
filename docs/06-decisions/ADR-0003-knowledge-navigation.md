# ADR-0003 — Knowledge Map and Navigation

> [!info] Decision Status
> - Document Type: Architecture Decision Record
> - Status: Accepted
> - Date: 2026-11-11

## Context

AtomScope follows a theory-centered Physics Knowledge Architecture with three major course parts and meaningful cross-topic relationships.

A simple linear sequence would not represent the structure adequately. A free-form graph alone may also be difficult to browse.

## Decision

Use a hybrid Knowledge Map:
- Hierarchical cards are the primary navigation structure.
- A relationship graph or relationship view is supplementary and used to explore conceptual connections.
- The course knowledge architecture remains the authority for topic scope and hierarchy.

## Consequences

Positive:
- Clear entry points for learners.
- Scales more predictably than a graph-only interface.
- Supports cross-topic exploration without requiring graph navigation.

Trade-offs:
- The card hierarchy and relationship view must remain synchronized with the knowledge source.
- Relationship types should be explicit; not every connection is a prerequisite.
