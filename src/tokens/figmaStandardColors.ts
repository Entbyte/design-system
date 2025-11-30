// src/tokens/figmaStandardColors.ts
import raw from './figma-button-tokens.json';

export type ButtonSurface =
  | 'bright_solid'
  | 'dark_solid'
  | 'dark_dynamic'
  | 'bright_dynamic';

export type ButtonState = 'default' | 'hover' | 'pressed' | 'disabled';
export type StandardHierarchy = 'high' | 'primary' | 'secondary' | 'tertiary';
export type StandardPart = 'bg' | 'label' | 'border' | 'hwOutline';

// Typen motsvarar värdena i variableCollection
type ModeRecord = {
  brightSolid: string;
  darkSolid: string;
  darkDynamic: string;
  brightDynamic: string;
};

const vc = raw.variableCollection as Record<string, ModeRecord>;

const surfaceKeyMap: Record<ButtonSurface, keyof ModeRecord> = {
  bright_solid: 'brightSolid',
  dark_solid: 'darkSolid',
  dark_dynamic: 'darkDynamic',
  bright_dynamic: 'brightDynamic',
};

function getTokenValue(name: string, surface: ButtonSurface): string {
  const token = vc[name];
  if (!token) {
    throw new Error(`Missing Figma token: ${name}`);
  }

  const modeKey = surfaceKeyMap[surface];
  return token[modeKey];
}

// OBS: vi speglar exakt nycklarna i din JSON, t.ex. "Secoundary"
const standardMap = {
  high: {
    bg: {
      default: 'buttonStandardHighDefault',
      hover: 'buttonStandardHighHover',
      pressed: 'buttonStandardHighPressed',
      disabled: 'buttonStandardHighDisable',
    },
    label: {
      default: 'buttonStandardHighCont',
      disabled: 'buttonStandardHighContDisable',
    },
    border: {
      default: 'buttonStandardHighLine',
    },
    hwOutline: {
      default: 'buttonStandardHighHwLine',
    },
  },
  primary: {
    bg: {
      default: 'buttonStandardPrimaryDefault',
      hover: 'buttonStandardPrimaryHover',
      pressed: 'buttonStandardPrimaryPressed',
      disabled: 'buttonStandardPrimaryDisable',
    },
    label: {
      default: 'buttonStandardPrimaryCont',
      disabled: 'buttonStandardPrimaryContDisable',
    },
    border: {
      default: 'buttonStandardPrimaryLine',
    },
    hwOutline: {
      default: 'buttonStandardPrimaryHwLine',
    },
  },
  secondary: {
    bg: {
      default: 'buttonStandardSecondaryDefault',
      hover: 'buttonStandardSecondaryHover',
      pressed: 'buttonStandardSecondaryPressed',
      disabled: 'buttonStandardSecondaryDisable',
    },
    label: {
      default: 'buttonStandardSecondaryCont',
      disabled: 'buttonStandardSecondaryContDisable',
    },
    border: {
      // stavfel i JSON, så vi matchar det
      default: 'buttonStandardSecoundaryLine',
    },
    hwOutline: {
      default: 'buttonStandardSecondaryHwLine',
    },
  },
  tertiary: {
    bg: {
      default: 'buttonStandardTertiaryDefault',
      hover: 'buttonStandardTertiaryHover',
      pressed: 'buttonStandardTertiaryPressed',
      disabled: 'buttonStandardTertiaryDisable',
    },
    label: {
      default: 'buttonStandardTertiaryCont',
      disabled: 'buttonStandardTertiaryContDisable',
    },
    border: {
      default: 'buttonStandardTertiaryLine',
    },
    hwOutline: {
      default: 'buttonStandardTertiaryHwLine',
    },
  },
} as const;

export function getStandardColor(
  hierarchy: StandardHierarchy,
  part: StandardPart,
  state: ButtonState,
  surface: ButtonSurface
): string {
  const h = standardMap[hierarchy];

  if (!h) {
    throw new Error(`Unknown hierarchy: ${hierarchy}`);
  }

  // border & hwOutline har bara "default" i Figma → samma i alla states
  if (part === 'border' || part === 'hwOutline') {
    const partMap = h[part] as { default: string };
    return getTokenValue(partMap.default, surface);
  }

  const partMap = h[part] as Record<ButtonState | 'default' | 'disabled', string>;
  const tokenName =
    partMap[state] ?? partMap.default ?? partMap.disabled ?? undefined;

  if (!tokenName) {
    throw new Error(
      `Missing token mapping for ${hierarchy}.${part}.${state} (surface=${surface})`
    );
  }

  return getTokenValue(tokenName, surface);
}
// 🔹 NY: scen-bakgrund baserad på surface (bgL1)
export function getSurfaceBackground(surface: ButtonSurface): string {
    const token = vc['bgL1'];
  
    if (!token) {
      throw new Error('Missing Figma token: bgL1');
    }
  
    const modeKey = surfaceKeyMap[surface];
    return token[modeKey];
  }
