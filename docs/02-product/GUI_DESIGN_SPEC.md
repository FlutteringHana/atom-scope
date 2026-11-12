# AtomScope — GUI Design Specification

> [!info] Document Status
> - Document Type: GUI / Interaction Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Design Direction

**Scientific Editorial + Interactive Laboratory**

The interface should combine:
- The clarity, typography, and reading comfort of an academic publication.
- The direct manipulation and information density of a scientific instrument.
- A restrained visual language that supports scientific content rather than decorating it.

Avoid relying on generic neon-blue dashboards, excessive grids, or decorative data that has no physical meaning.

## 2. Global Visual Principles

- Clear typographic hierarchy.
- Restrained use of color.
- Strong contrast and readable labels.
- Consistent spacing and alignment.
- Scientific charts with explicit axes, units, and legends.
- Distinct visual treatment for explanatory content and interactive canvases.
- Responsive layouts that preserve the main task.

### 2.1 Theme Direction

The default reading and navigation interface should favor a light, neutral theme.

Individual visualization canvases may use a dark background when it improves scientific legibility or represents the subject more naturally. For example, emission spectra may benefit from a dark canvas.

Do not force every visualization to use the same background.

### 2.2 Color Semantics

The three course Parts may use restrained accent colors for navigation and recognition. These colors must not be confused with data-series colors or physical color mappings.

Data colors should be selected according to the chart's meaning and accessibility, not merely inherited from the Part accent.

Exact color tokens, typography, and component dimensions remain implementation-stage design decisions.

## 3. Global Application Layout

The application should provide:
- A consistent header or navigation region.
- Access to the Knowledge Map.
- Clear Part / topic location context.
- A central content area.
- A restrained system for supplementary navigation and shared resources.

The global shell should not consume excessive vertical space, especially on visualization pages.

## 4. Knowledge Map Interface

The Knowledge Map should use hierarchical cards as the default browsing structure.

Cards should communicate:
- Part or topic title.
- Short description or central question.
- Knowledge priority or category where relevant.
- A clear navigation affordance.

An optional relationship view may display cross-topic connections. The graph should remain readable and should not replace the card-based hierarchy.

## 5. Knowledge Workspace

A Knowledge Module opens in a **Knowledge Workspace**.

Default layout:
- Main area: selected interactive visualization.
- Side panel: visualization controls and Contextual Information.
- Secondary page area: Knowledge Details and supplementary content.

The visualization should receive the strongest visual emphasis in the initial viewport.

### 5.1 Side Panel

The side panel contains two related functions:
- **Controls:** parameters, playback, display options, and other controls relevant to the active visualization.
- **Context:** concise concept explanations, physical interpretation, equations, assumptions, and observation notes.

Controls and Context may be organized as tabs or clearly separated sections. The panel should be capable of collapsing or changing width where appropriate.

The panel must remain specific to the active visualization. Do not display irrelevant controls or explanations.

### 5.2 Workspace / Immersive Toggle

Provide a clear user-operated toggle between:

**Workspace Mode**
- Main visualization remains prominent.
- Side panel is available for Controls and Context.
- Suitable for active exploration with supporting information visible.

**Immersive Visualization Mode**
- Visualization receives substantially more screen space.
- Side panel is hidden or minimized.
- A persistent control allows the user to return to Workspace Mode.

Switching modes should preserve the current topic, selected visualization, and simulation state where technically practical.

The toggle changes presentation, not the underlying knowledge or simulation.

### 5.3 Multiple Visualizations

When a knowledge module contains multiple visualizations, provide a clear selector within the workspace. Examples include switching between an apparatus view, a particle trajectory view, and a result plot.

The selector should make the active view obvious. The side panel should update to match the selected view.

## 6. Knowledge Details Section

Knowledge Details is a separate deeper-reading area, accessible through a visible entry near the lower or peripheral part of the knowledge page.

It may include:
- Concept and background.
- Physical principles.
- Mathematical descriptions and derivations.
- Physical interpretation.
- Experimental evidence.
- Model limitations and applicability.

The entry should be discoverable but should not compete with the visualization in the initial viewport.

Provide a clear route back to the visualization.

## 7. Supplementary Information

Historical context, scientist profiles, additional derivations, advanced notes, and references should be presented as supporting material.

Suitable patterns include:
- Expandable sections.
- Secondary information panels.
- Popovers for short definitions.
- Linked detail sections for longer content.

Do not force supplementary material into the primary visualization area.

## 8. Visualization Layout Variants

Use layout variants according to the nature of the content.

### Immersive / Model-oriented layout
Suitable for model structures and spatial simulations. Give the central model enough area and keep controls close to the canvas.

### Experiment-oriented layout
Give adequate space to apparatus, process animation, observations, and result views. A process and result may be shown together where useful.

### Analytical / Data-oriented layout
Give charts and quantitative comparisons the main area. Provide controls and readable value inspection without overcrowding the plot.

These are layout patterns within one design system, not separate products.

## 9. Responsive Behavior

Desktop is the primary target for complex scientific exploration.

On narrower screens:
- Side panels may become drawers or stacked sections.
- The visualization remains the primary content.
- Controls should remain accessible.
- Dense multi-chart layouts may stack vertically.
- Immersive mode should remain reversible.

Exact breakpoints should be chosen during implementation and tested against actual content.

## 10. Accessibility and Usability

- Do not use color as the only way to communicate state or data category.
- Provide readable text labels and units.
- Make interactive controls keyboard accessible.
- Provide sufficient contrast.
- Avoid motion that cannot be paused when it may distract or cause discomfort.
- Use clear labels for mode switches and panel controls.
