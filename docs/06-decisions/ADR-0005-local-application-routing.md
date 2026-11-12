# ADR-0005 — Local application routing and delivery

> - Document Type: Architecture Decision Record
> - Status: Accepted
> - Date: 2026-11-11

## Context

The initial application is intended for local development and review. Topic URLs should be directly navigable without a backend or production hosting configuration. The project owner requested local commits without pushing or opening a public website.

## Decision

Use hash routes for the knowledge map (`#/`), Parts (`#/part/1`), topics (`#/topic/bohr`) and reference (`#/reference`). Use React state for module parameters and display modes. Navigating to a different topic resets that topic to its defaults; changing visualization or display mode retains state. Unknown routes show a recovery link.

Use plain CSS and SVG for the initial renderers. Keep all physics pure and separate from presentation. Share the Bohr engine across four related modules while allowing specialized controls and renderers for other physics.

Bind Vite development and preview servers to 127.0.0.1. Keep generated output, dependencies, credentials, local caches, browser traces and screenshots out of Git. Commit the dependency lockfile. No remote synchronization, Site registration, or deployment is part of this delivery.

## 2026-11-12 — GitHub Pages delivery extension

The owner connected `FlutteringHana/atom-scope` and explicitly authorized a GitHub Pages Actions workflow, commit, and push. This supersedes the initial delivery's local-only restriction for this repository. Local development remains bound to loopback.

The Pages workflow builds and deploys `dist/` from `main`. The Vite `base` is configurable through `VITE_BASE_PATH`, populated from the `configure-pages` output during deployment and defaulting to `/` locally. Hash routes continue to work at the project subpath without server rewrite rules. The workflow uses the built-in token with job-specific permissions and actions pinned to verified commit SHAs.

## Consequences

Direct links work on any static server with no rewrite rules. No routing or shared-state dependency is required yet. Hash URLs are less conventional than path URLs and may be replaced when a deployed application needs server-side routing. Browser-native typesetting is sufficient for current short equations; derivation-heavy modules may later adopt KaTeX.
