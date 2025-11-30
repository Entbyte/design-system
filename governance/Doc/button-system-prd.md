
# Button System PRD – Standard Button (Updated)

_Last updated: 2025‑11‑29_

## 1. Purpose & Goals

This document specifies the **Standard Button** for the in‑car UI design system.

Goals:

1. Pixel‑close to Figma for all defined states.
2. 100% driven by **tokens** (no hard‑coded colors or geometry in components).
3. Works for both **SW** and **HW** input modes.
4. Encodes enough structure and rules that an AI / generator can create new variants.

---

## 2. Scope

In scope:

- The **Standard Button** only.
- Hierarchies: **high**, **primary**, **secondary**, **tertiary**.
- Surfaces: **bright_solid**, **dark_solid**, **dark_dynamic**, **bright_dynamic**.
- States: **default**, **hover**, **pressed**, **disabled**.
- Inputs: **sw**, **hw**.
- Content variants: **text_icon**, **text**, **icon**.

Out of scope (for separate PRDs):

- FABs, icon‑only minimal buttons, segmented controls, toggles, etc.

---

## 3. Component Anatomy

The button is built as **two nested rectangles** plus content:

1. **Outer frame – `Shape`**
   - Visual role: outer plinth / HW focus plate.
   - Geometry:
     - Corner radius: **16 px** (from size token).
     - Padding to inner box: **8 px** on all sides (from size token).
   - Visuals:
     - Has **background fill only** – no visible stroke.
     - Has drop‑shadow (shadow token, currently hard‑coded but should become a token later).
   - Tokens:
     - Background color comes from a **“grad / frame” token** or a **_HW_line** token depending on state/input (see mapping below).

2. **Inner box – `bg`**
   - Visual role: main button body.
   - Geometry:
     - Corner radius: **8 px**.
   - Visuals:
     - **Fill** from state token (e.g. `Secondary_default`).
     - **4 px inside stroke**; always inside, never outside.
       - Stroke color is a **line** token or **HW_line** token depending on state/input.
   - Padding:
     - Top: 24 px
     - Bottom: 20 px
     - Left/Right: 56 px
     - All values come from `buttonSizeTokens` and vary by size.

3. **Content holder – `Content Holder`**
   - Layout:
     - Horizontal flex row, centered vertically, `gap` from size token.
   - Children:
     1. **Icon container – `Icon_64px`**
        - 64×64 px container, no radius.
        - Contains a template **plus icon** (SVG).
        - Icon color is controlled via `color: var(--btn-text-color)` or `fill: currentColor`.
     2. **Text node – label**
        - Uses typography token `Ag_Button_text`.
        - Color: **_cont** token (e.g. `Secondary_cont`, `Secondary_cont_disable`).

---

## 4. Tokens

We assume tokens are exported from Figma in a JSON similar to `figma-button-tokens.json` and accessed via the adapter `figmaStandardColors.ts`.

### 4.1. Token namespaces

Per hierarchy we have (example with **Secondary**):

- Background:
  - `Secondary_default`
  - `Secondary_hover`
  - `Secondary_pressed`
  - `Secondary_disable`
- Content:
  - `Secondary_cont`
  - `Secondary_cont_disable`
- Lines:
  - `Secondary_line`
  - `Secondary_hw_line`
- Outer grad / frame (if present):
  - `Grad_secondary` (name can differ, but conceptually one token per hierarchy+surface).

All tokens are four‑mode:
- `brightSolid`, `darkSolid`, `darkDynamic`, `brightDynamic`.

### 4.2. Adapter contract

`getStandardColor(hierarchy, part, state, surface)` handles mapping Figma names → actual hex RGBA.

Supported parts for **Standard Button**:

- `bg`
- `label`
- `border`
- `hwOutline`  (used for both HW line and HW focus plate)
- (optional) `frame` / `grad` if we add explicit outer‑plinth tokens

---

## 5. Shape Tokens (logic layer)

`shapeTokens.ts` exposes a single main helper:

```ts
getStandardShapeToken(
  surface: ButtonSurface,
  hierarchy: StandardHierarchy,
  highPriority: boolean,
  input: ButtonInput,         // "sw" | "hw"
  size: ButtonSize,           // "large" | "medium" | "small"
  state: ButtonState,         // "default" | "hover" | "pressed" | "disabled"
  intent: ButtonIntent = "neutral",
): ShapeToken
```

### 5.1. ShapeToken structure

```ts
type ShapeToken = {
  // Outer frame (Shape)
  outerRadius: number;
  outerPadding: number;      // distance between outer frame and inner box
  outerBg: string;           // fill color of outer frame

  // Inner box (bg)
  radius: number;
  bg: string;
  borderWidth: number;       // always 4 px
  borderColor: string;

  paddingX: number;
  paddingY: number;
  paddingBottom: number;

  // Text
  fontSize: number;
  textColor: string;

  // Icon & layout
  gap: number;
  iconBoxSize: number;
  iconSize: number;
};
```

All geometry (radii, paddings, font size, icon sizes, gaps) comes from `buttonSizeTokens[size]`.

### 5.2. Derived hierarchy

If `highPriority === true` and `hierarchy === "primary"`, we use the **high** hierarchy tokens; otherwise we use the given hierarchy.

```ts
const effectiveHierarchy =
  highPriority && hierarchy === "primary" ? "high" : hierarchy;
```

---

## 6. Visual Rules per Input & State

This is the core behaviour that matches your Figma examples.

### 6.1. Common rules

- Geometry is **constant** between states:
  - `outerRadius` = 16 px
  - `outerPadding` = 8 px
  - `radius` (inner) = 8 px
  - `borderWidth` (inner) = 4 px
- No layout jump when changing state.
- Icon and label always share the same color tokens.

### 6.2. SW input

SW never shows HW focus plates or HW lines.

#### SW – default

- `outerBg` = grad/frame token for hierarchy+surface, e.g. `Grad_secondary`.
- `bg` = `<Hierarchy>_default`.
- `borderColor` = `<Hierarchy>_line`.
- `textColor` & icon color = `<Hierarchy>_cont`.

#### SW – hover

- `outerBg` = same as default (no extra ring).
- `bg` = `<Hierarchy>_hover`.
- `borderColor` = `<Hierarchy>_line`.
- Content = `<Hierarchy>_cont`.

#### SW – pressed

- `outerBg` = same as default.
- `bg` = `<Hierarchy>_pressed`.
- `borderColor` = `<Hierarchy>_line`.
- Content = `<Hierarchy>_cont`.

#### SW – disabled

- `outerBg` = same as default.
- `bg` = `<Hierarchy>_disable`.
- `borderColor` = `<Hierarchy>_line`.
- Content = `<Hierarchy>_cont_disable`.

### 6.3. HW input

HW adds a **focus plate** and **focus line** on hover/pressed. Default/disabled should feel calm and not attract attention.

#### HW – default

- Outer frame:
  - `outerBg` = **grad/frame** token (`Grad_*`), neutral.
- Inner box:
  - `bg` = `<Hierarchy>_default`.
  - `borderColor` = `<Hierarchy>_line` (not HW_line).
- Content:
  - `<Hierarchy>_cont`.

#### HW – hover

- Outer frame:
  - `outerBg` = `<Hierarchy>_hw_line`.  
    → This is the **outer HW focus plate**.
- Inner box:
  - `bg` = `<Hierarchy>_hover`.
  - `borderColor` = `<Hierarchy>_hw_line`.  
    → This is the **inner HW focus line**.
- Content:
  - `<Hierarchy>_cont`.

#### HW – pressed

Same principle, but with pressed background:

- Outer frame:
  - `outerBg` = `<Hierarchy>_hw_line`.
- Inner box:
  - `bg` = `<Hierarchy>_pressed`.
  - `borderColor` = `<Hierarchy>_hw_line`.
- Content:
  - `<Hierarchy>_cont`.

#### HW – disabled

- Outer frame:
  - `outerBg` = **grad/frame** token (same as default).
- Inner box:
  - `bg` = `<Hierarchy>_disable`.
  - `borderColor` = `<Hierarchy>_line` (no HW focus).
- Content:
  - `<Hierarchy>_cont_disable`.

---

## 7. React Implementation (current)

### 7.1. Component API

```ts
export type StandardButtonProps = {
  surface?: ButtonSurface;
  hierarchy?: StandardHierarchy;
  highPriority?: boolean;
  intent?: ButtonIntent;        // reserved for future additive/destructive
  input?: ButtonInput;          // "sw" | "hw"
  size?: ButtonSize;            // "large" | "medium" | "small"
  state?: ButtonState;          // "default" | "hover" | "pressed" | "disabled"
  element?: ButtonElement;      // "text_icon" | "text" | "icon"
  label?: string;
  iconNode?: React.ReactNode;   // default: plus template
};
```

Default props:

- `surface = "dark_solid"`
- `hierarchy = "primary"`
- `highPriority = false`
- `intent = "neutral"`
- `input = "sw"`
- `size = "large"`
- `state = "default"`
- `element = "text_icon"`
- `label = "Button"`

### 7.2. CSS variables mapping

`StandardButton` calls `getStandardShapeToken(...)` and exposes its values as CSS custom properties:

```ts
const t = getStandardShapeToken(...);

const style: CSSProperties = {
  // Outer frame
  "--btn-outer-radius": `${t.outerRadius}px`,
  "--btn-outer-padding": `${t.outerPadding}px`,
  "--btn-outer-bg": t.outerBg,

  // Inner box
  "--btn-radius": `${t.radius}px`,
  "--btn-bg": t.bg,
  "--btn-border-width": `${t.borderWidth}px`,
  "--btn-border-color": t.borderColor,

  // Padding
  "--btn-padding-x": `${t.paddingX}px`,
  "--btn-padding-y": `${t.paddingY}px`,
  "--btn-padding-bottom": `${t.paddingBottom}px`,

  // Text
  "--btn-font-size": `${t.fontSize}px`,
  "--btn-text-color": t.textColor,

  // Icon & layout
  "--btn-gap": `${t.gap}px`,
  "--btn-icon-box-size": `${t.iconBoxSize}px`,
  "--btn-icon-size": `${t.iconSize}px`,
};
```

### 7.3. CSS structure (Shape.module.css)

Relevant parts:

```css
.shape {
  display: inline-flex;
  align-items: flex-start;
  justify-content: flex-start;

  padding: var(--btn-outer-padding, 8px);
  border-radius: var(--btn-outer-radius, 16px);
  background: var(--btn-outer-bg, transparent);
  border: none;

  box-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.1),
    0px 0px 20px rgba(122, 142, 161, 0.3);

  font-family: Roboto, system-ui, sans-serif;
}

.bg {
  box-sizing: border-box;
  border-radius: var(--btn-radius, 8px);
  background: var(--btn-bg, #191919);
  border-width: var(--btn-border-width, 4px);
  border-style: solid;
  border-color: var(--btn-border-color, rgba(255, 255, 255, 0.7));

  padding: var(--btn-padding-y, 24px)
           var(--btn-padding-x, 56px)
           var(--btn-padding-bottom, 20px);

  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

/* content holder, icon64px, etc. – as already implemented */
```

---

## 8. Behaviour Summary (Design‑friendly)

1. **Default / Disabled**
   - Outer block (`Shape`) is a neutral plate (`Grad_*`).
   - Inner block (`bg`) carries state background.
   - Inner stroke uses `*_line`.
   - No HW focus colors are used.
2. **Hover / Pressed – SW**
   - Only inner block changes (bg + content color).
   - Outer plate stays neutral, inner stroke still `*_line`.
3. **Hover / Pressed – HW**
   - Outer plate switches to `*_hw_line` color.
   - Inner stroke also switches to `*_hw_line`.
   - Geometry never changes → no “jump”.

---

## 9. Open Questions / Future Work

1. **Shadows as tokens**  
   - Currently hard‑coded; should be formalized as `Button/Shadow/Standard` tokens per hierarchy or surface.
2. **Intent variants (additive / destructive)**  
   - We have `ButtonIntent` in the API but only `neutral` is implemented.
3. **Surface‑specific grad tokens**  
   - Today we conceptually use `Grad_secondary`, etc. We may want explicit per‑surface grad tokens.
4. **Focus vs selection**  
   - HW focus is currently tied to state `hover` and `pressed`. If we introduce a persistent “selected” state, mapping has to be updated.

---

This PRD now matches the current mental model:

- Two boxes (`Shape` outer, `bg` inner).
- Outer plate only changes color in HW hover/pressed by using the `*_hw_line` token as its fill.
- Inner box always has 4 px inside stroke, whose color is `*_line` or `*_hw_line` depending on input + state.
- All visual differences between default/hover/pressed/disabled come from tokens, not geometry.
