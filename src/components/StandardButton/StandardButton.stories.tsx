import type { Meta, StoryObj } from "@storybook/react";
import StandardButton, {
  type StandardButtonProps,
} from "./StandardButton";

const meta: Meta<StandardButtonProps> = {
  title: "Components/StandardButton",
  component: StandardButton,
  args: {
    label: "Button",
    surface: "bright_solid",
    hierarchy: "primary",
    state: "default",
    size: "large",
    input: "hw",
    intent: "neutral",
    highPriority: false,
  },
  argTypes: {
    surface: {
      control: "radio",
      options: ["bright_solid", "dark_solid", "dark_dynamic", "bright_dynamic"],
    },
    hierarchy: {
      control: "radio",
      options: ["primary", "secondary", "tertiary"],
    },
    state: {
      control: "radio",
      options: ["default", "hover", "pressed", "disabled"],
    },
    size: {
      control: "radio",
      options: ["large", "medium", "small"],
    },
    input: {
      control: "radio",
      options: ["sw", "hw"],
    },
    intent: {
      control: "radio",
      options: ["neutral", "additive", "destructive"],
    },
    highPriority: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<StandardButtonProps>;

export const Playground: Story = {};
