# AI Code Assistant - Design Guidelines

## Design Approach

**Selected Approach**: Design System-Inspired (Linear + VS Code + GitHub)

**Justification**: As a developer productivity tool, the interface prioritizes efficiency, clarity, and familiarity. Drawing from Linear's clean aesthetics, VS Code's code-editor conventions, and GitHub's developer-centric patterns creates an environment developers trust and can navigate intuitively.

**Core Principles**:
- Developer-first: Interface feels like a natural extension of the development environment
- Clarity over decoration: Every element serves a functional purpose
- Technical precision: Typography and spacing reflect code editor conventions

---

## Typography

**Font Families**:
- **Interface Text**: Inter or System UI stack (`system-ui, -apple-system, sans-serif`)
- **Code Display**: JetBrains Mono or Fira Code (monospace with ligature support)

**Type Scale**:
- Page Title: `text-3xl font-semibold` (30px)
- Section Headers: `text-xl font-semibold` (20px)
- Form Labels: `text-sm font-medium` (14px)
- Body Text: `text-base` (16px)
- Code Preview: `text-sm font-mono` (14px monospace)
- Helper Text: `text-xs` (12px)

**Hierarchy Rules**:
- Titles use semibold weight for authority
- Labels use medium weight for clarity
- Body text uses regular weight for readability
- Code blocks maintain monospace consistently

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Component padding: `p-6` or `p-8`
- Section gaps: `gap-8` or `gap-12`
- Form field spacing: `space-y-6`
- Button padding: `px-6 py-2.5`

**Container Strategy**:
- Main content: `max-w-7xl mx-auto px-6`
- Form sections: `max-w-2xl` for optimal form width
- Code preview: `w-full` with horizontal scroll when needed

**Grid Layouts**:
- Two-column split for input/preview: `grid lg:grid-cols-2 gap-8`
- Framework cards: `grid md:grid-cols-2 gap-4`
- Single column on mobile: Stack all content vertically

---

## Component Library

### Navigation Header
- Fixed top bar with subtle border bottom
- Logo/title on left, GitHub link on right
- Height: `h-16` with flex centering
- Minimal, stays out of the way

### Primary Input Form
**Structure**: Single column form with clear sections
- **Entity Configuration Section**:
  - Entity name input field
  - Dynamic field builder (add/remove fields)
  - Each field row: name + type selector + delete button
  - "Add Field" button with subtle styling

**Framework Selector**:
- Radio button cards or segmented control
- Two options: "Node.js/Express" and "Spring Boot/Java"
- Visual indicators showing selected state
- Icon + framework name + brief description

**Form Controls**:
- Text inputs: `border rounded-lg px-4 py-2.5`
- Select dropdowns: Styled with consistent height
- Buttons: Rounded with clear hierarchy (primary vs secondary)
- Add/remove actions use icon buttons

### Code Preview Panel
**Layout**: Full-height panel with syntax highlighting
- Tabbed interface showing different generated files (Controller, Model, Routes)
- Line numbers in gutter (subtle, non-intrusive)
- Syntax highlighting using Prism.js or Highlight.js
- Copy button for each code block (top-right corner)
- Scrollable with custom scrollbar styling

**File Structure Display**:
- Tree view showing folder hierarchy
- Expandable/collapsible folders
- File icons indicating type (.js, .java, .yaml, Dockerfile)

### Action Buttons
**Primary CTA**: "Generate Code"
- Prominent placement below form
- Full-width on mobile, fixed width on desktop (`w-full md:w-auto`)
- Loading state with spinner during generation

**Download Button**: "Download ZIP"
- Appears after successful generation
- Secondary styling (outline or ghost variant)
- Icon indicating download action

### Status & Feedback
**Generation Status**:
- Loading spinner with status text during generation
- Success message with checkmark icon
- Error states with clear messaging and retry option

**Documentation Card**:
- Collapsible section showing generated API documentation
- Swagger-style endpoint list
- Copy functionality for API specs

---

## Application Structure

### Single-Page Layout
**Left Panel** (40% width on desktop):
1. Page header: "AI Code Assistant" with tagline
2. Framework selection cards
3. Entity input form
4. Generate button
5. Optional features toggles (Dockerfile, CI/CD, Swagger)

**Right Panel** (60% width on desktop):
1. Sticky header: "Generated Code Preview"
2. File tree navigation
3. Tabbed code viewer
4. Download actions

**Mobile**: Stack vertically, preview follows form

---

## Animations

**Minimal, purposeful only**:
- Button hover: subtle scale or opacity shift
- Form validation: shake animation for errors
- Loading states: spinner or skeleton screens
- Tab transitions: smooth fade between code views
- No distracting scroll effects or page transitions

---

## Images

**No hero image required** for this application-focused tool. The interface is content-dense and functional.

**Icon Usage**:
- Framework logos (Node.js, Spring Boot) in selector cards
- File type icons in code preview tree
- Action icons (download, copy, add, delete) via Heroicons
- Status icons (checkmark, error, loading) for feedback

---

## Accessibility

- All form inputs have associated labels
- Keyboard navigation for entire workflow
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Color contrast meets WCAG AA standards
- Error messages clearly associated with form fields
- Tab order follows logical flow (form → preview → actions)

---

## Visual Refinement

**Professional Developer Aesthetic**:
- Subtle borders separate sections without harsh lines
- Gentle shadows for elevation (cards, modals)
- Code blocks have slightly inset appearance
- Consistent border radius across all components (`rounded-lg`)
- Monospace fonts create technical credibility
- Clean, uncluttered layouts maximize working space

**Interactive States**:
- Hover states are subtle (opacity/border changes)
- Active/selected states are clear but not loud
- Disabled states use reduced opacity
- Loading states maintain layout stability (no layout shifts)