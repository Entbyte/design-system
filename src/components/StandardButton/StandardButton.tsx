import React from "react";
import type { CSSProperties } from "react";
import styles from "../Shape/Shape.module.css";
import { PlusIcon64 } from "../../assets/icons/PlusIcon64";

export type ButtonSurface =
  | "bright_solid"
  | "dark_solid"
  | "dark_dynamic"
  | "bright_dynamic";

export type ButtonHierarchy = "primary" | "secondary" | "tertiary";

export type ButtonState = "default" | "hover" | "pressed" | "disabled";

export type ButtonSize = "large" | "medium" | "small";

export type ButtonInput = "sw" | "hw";

export type ButtonIntent = "neutral" | "additive" | "destructive";

export type StandardButtonProps = {
  label: string;
  surface: ButtonSurface;
  hierarchy: ButtonHierarchy;
  state: ButtonState;
  size: ButtonSize;
  input: ButtonInput;
  intent: ButtonIntent;
  highPriority?: boolean;
};

type ButtonTokens = {
  outerRadius: number;
  radius: number;
  paddingX: number;
  paddingY: number;
  paddingBottom: number;
  outerBg: string;
  bg: string;
  innerLine: string;
  hwLine: string;
  textColor: string;
};

function getButtonTokens({
  surface,
  state,
  size,
}: {
  surface: ButtonSurface;
  state: ButtonState;
  size: ButtonSize;
}): ButtonTokens {
  // --- SIZE ---
  const sizeMap: Record<
    ButtonSize,
    { paddingX: number; paddingY: number; paddingBottom: number; radius: number }
  > = {
    large: { paddingX: 56, paddingY: 24, paddingBottom: 20, radius: 8 },
    medium: { paddingX: 40, paddingY: 20, paddingBottom: 16, radius: 6 },
    small: { paddingX: 32, paddingY: 16, paddingBottom: 12, radius: 4 },
  };

  const sizeToken = sizeMap[size];

  const isDarkSurface = surface === "dark_solid" || surface === "dark_dynamic";

  // Bas-tokens för secondary (återanvänds av primary/tertiary tills vidare)
  const baseBg = isDarkSurface ? "#1A1A1A" : "#F3F3F3"; // secondary_default
  const baseText = isDarkSurface ? "#EFEFEF" : "#111111"; // Secondary_count
  const baseInnerLine = isDarkSurface ? "#404040" : "#E0E0E0"; // Grad_secondary

  let outerBg = "transparent";
  let bg = baseBg;
  let textColor = baseText;
  let innerLine = baseInnerLine;
  let hwLine = "transparent"; // används INTE längre som svart outer-border

  switch (state) {
    case "hover": {
      // Yttre ytan fylld med samma färg som innehållet
      outerBg = baseBg;
      bg = baseBg;

      // Enda synliga linjen: HW-linjen runt content
      innerLine = isDarkSurface ? "#EFEFEF" : "#111111"; // Secondary_HW_line
      hwLine = "transparent"; // 👈 ingen outer stroke

      textColor = baseText;
      break;
    }
    case "pressed": {
      outerBg = isDarkSurface ? "#404040" : "#DDDDDD"; // secondary_pressed
      bg = outerBg;

      innerLine = isDarkSurface ? "#EFEFEF" : "#111111"; // Secondary_HW_line
      hwLine = "transparent"; // 👈 ingen outer stroke här heller

      textColor = baseText;
      break;
    }
    case "disabled": {
      outerBg = "transparent";
      bg = isDarkSurface ? "#4A4A4A" : "#E9E9E9"; // secondary_disable
      innerLine = isDarkSurface ? "#5C5C5C" : "#DDDDDD";
      textColor = isDarkSurface ? "#9E9E9E" : "#B0B0B0"; // Secondary_count_disable
      hwLine = "transparent";
      break;
    }
    case "default":
    default: {
      outerBg = "transparent";
      bg = baseBg;
      innerLine = baseInnerLine;
      textColor = baseText;
      hwLine = "transparent";
      break;
    }
  }

  return {
    outerRadius: 16,
    radius: sizeToken.radius,
    paddingX: sizeToken.paddingX,
    paddingY: sizeToken.paddingY,
    paddingBottom: sizeToken.paddingBottom,
    outerBg,
    bg,
    innerLine,
    hwLine,
    textColor,
  };
}

const StandardButton: React.FC<StandardButtonProps> = (props) => {
  const tokens = getButtonTokens({
    surface: props.surface,
    state: props.state,
    size: props.size,
  });

  const styleVars: CSSProperties = {
    // shape
    ["--btn-outer-radius" as any]: `${tokens.outerRadius}px`,
    ["--btn-radius" as any]: `${tokens.radius}px`,
    ["--btn-padding-x" as any]: `${tokens.paddingX}px`,
    ["--btn-padding-y" as any]: `${tokens.paddingY}px`,
    ["--btn-padding-bottom" as any]: `${tokens.paddingBottom}px`,

    // bakgrunder + linjer
    ["--btn-outer-bg" as any]: tokens.outerBg,
    ["--btn-bg" as any]: tokens.bg,
    ["--btn-border-color" as any]: tokens.innerLine,

    // gör outer-border alltid osynlig
    ["--btn-outer-border-color" as any]: tokens.hwLine, // = "transparent" i alla states

    // content (text + ikon, _cont)
    ["--btn-text-color" as any]: tokens.textColor,
  };

  return (
    <button className={styles.shape} style={styleVars} type="button">
      <div className={styles.bg}>
        <div className={styles.content}>
          <div className={styles.holder}>
            <span className={styles.icon64px} aria-hidden="true">
              <PlusIcon64 />
            </span>
            <span className={styles.button}>{props.label}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default StandardButton;
export { StandardButton };
