// src/tokens/buttonSizeTokens.ts

export const BUTTON_SIZES = ['large', 'medium', 'small'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export type ButtonSizeToken = {
  outlineRadius: number;   // outer shape radius
  radius: number;          // inner bg radius
  paddingX: number;
  paddingY: number;
  paddingBottom: number;
  fontSize: number;
  iconBoxSize: number;
  iconSize: number;
  gap: number;
};

// 🔹 Dessa värden kommer direkt från din React Native-dump (Large)
export const buttonSizeTokens: Record<ButtonSize, ButtonSizeToken> = {
  large: {
    outlineRadius: 16,
    radius: 8,
    paddingX: 56,
    paddingY: 24,
    paddingBottom: 20,
    fontSize: 50,
    iconBoxSize: 64,
    iconSize: 52,
    gap: 16,
  },

  // Medium/Small kan du justera senare – jag sätter rimliga startvärden
  medium: {
    outlineRadius: 12,
    radius: 6,
    paddingX: 40,
    paddingY: 20,
    paddingBottom: 16,
    fontSize: 32,
    iconBoxSize: 48,
    iconSize: 40,
    gap: 12,
  },

  small: {
    outlineRadius: 10,
    radius: 4,
    paddingX: 32,
    paddingY: 16,
    paddingBottom: 12,
    fontSize: 24,
    iconBoxSize: 40,
    iconSize: 32,
    gap: 8,
  },
};
