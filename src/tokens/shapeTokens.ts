// src/tokens/shapeTokens.ts

import { buttonSizeTokens } from "./buttonSizeTokens";
import { getStandardColor } from "./figmaStandardColors";

export type ButtonSurface =
  | "bright_solid"
  | "dark_solid"
  | "dark_dynamic"
  | "bright_dynamic";

export type StandardHierarchy = "primary" | "secondary" | "tertiary" | "high";

export type ButtonInput = "sw" | "hw";

export type ButtonSize = "large" | "medium" | "small";

export type ButtonState = "default" | "hover" | "pressed" | "disabled";

export type ButtonIntent = "neutral" | "additive" | "destructive";

export interface ShapeToken {
  // outer frame
  outerRadius: number;
  outerPadding: number;
  outerBg: string;

  // inner box
  radius: number;
  bg: string;
  borderWidth: number;
  borderColor: string;

  // layout
  paddingX: number;
  paddingY: number;
  paddingBottom: number;

  // typography
  fontSize: number;
  textColor: string;

  // content / icon
  gap: number;
  iconBoxSize: number;
  iconSize: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveStandardColor(
  hierarchy: StandardHierarchy,
  role: string,
  state: ButtonState,
  surface: ButtonSurface
): string {
  const fn = getStandardColor as any;
  // signaturen i figmaStandardColors.ts är (surface, hierarchy, state, role)
  return fn(surface, hierarchy, state, role) as string;
}

export function getStandardShapeToken(
  surface: ButtonSurface,
  hierarchy: StandardHierarchy,
  highPriority: boolean,
  input: ButtonInput,
  size: ButtonSize,
  state: ButtonState,
  intent: ButtonIntent = "neutral"
): ShapeToken {
  // vi använder inte intent ännu – “consume” så TS inte klagar
  void intent;

  const effectiveHierarchy: StandardHierarchy =
    highPriority && hierarchy === "primary" ? "high" : hierarchy;

  const sizeToken = buttonSizeTokens[size];
  const s = sizeToken as any;

  const outerRadius: number = s.outlineRadius ?? sizeToken.radius;
  const outerPadding: number = s.outlinePadding ?? sizeToken.paddingY;
  const outlineWidth: number = s.outlineWidth ?? s.borderWidth ?? 0;

  const isHw = input === "hw";
  const isDisabled = state === "disabled";
  const isHover = state === "hover";
  const isPressed = state === "pressed";

  // --- färger ---

  const bgDefault = resolveStandardColor(
    effectiveHierarchy,
    "bg",
    "default",
    surface
  );
  const bgHover = resolveStandardColor(
    effectiveHierarchy,
    "bg",
    "hover",
    surface
  );
  const bgPressed = resolveStandardColor(
    effectiveHierarchy,
    "bg",
    "pressed",
    surface
  );
  const bgDisabled = resolveStandardColor(
    effectiveHierarchy,
    "bg",
    "disabled",
    surface
  );

  const frameColor = resolveStandardColor(
    effectiveHierarchy,
    "frame",
    "default",
    surface
  );
  const lineColor = resolveStandardColor(
    effectiveHierarchy,
    "border",
    "default",
    surface
  );
  const hwLineColor = resolveStandardColor(
    effectiveHierarchy,
    "hwOutline",
    "default",
    surface
  );
  void hwLineColor; // inte använd längre, men behåll om vi vill ha det senare

  const labelDefault = resolveStandardColor(
    effectiveHierarchy,
    "label",
    "default",
    surface
  );
  const labelDisabled = resolveStandardColor(
    effectiveHierarchy,
    "label",
    "disabled",
    surface
  );

  // --- inner bakgrund per state ---

  let bg = bgDefault;
  if (isHover) bg = bgHover;
  if (isPressed) bg = bgPressed;
  if (isDisabled) bg = bgDisabled;

  // --- outer + border + text ---

  let outerBg = frameColor;
  let borderColor = lineColor;
  let textColor = labelDefault;

  if (!isHw) {
    // SW: outerBg = frameColor i alla states
    outerBg = frameColor;
    borderColor = lineColor;
    if (isDisabled) textColor = labelDisabled;
  } else {
    // HW
    if (isHover || isPressed) {
      // Hover/pressed HW:
      //  - outerBg: samma som default (frameColor)
      //  - borderColor: vanliga lineColor (inte svart hwLineColor)
      outerBg = frameColor;
      borderColor = lineColor;
      textColor = labelDefault;
    } else if (isDisabled) {
      outerBg = frameColor;
      borderColor = lineColor;
      textColor = labelDisabled;
    } else {
      // default
      outerBg = frameColor;
      borderColor = lineColor;
      textColor = labelDefault;
    }
  }

  return {
    outerRadius,
    outerPadding,
    outerBg,

    radius: sizeToken.radius,
    bg,
    borderWidth: outlineWidth,
    borderColor,

    paddingX: sizeToken.paddingX,
    paddingY: sizeToken.paddingY,
    paddingBottom: sizeToken.paddingBottom,

    fontSize: sizeToken.fontSize,
    textColor,

    gap: sizeToken.gap,
    iconBoxSize: sizeToken.iconBoxSize,
    iconSize: sizeToken.iconSize,
  };
}
