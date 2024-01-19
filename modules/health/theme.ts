import "@fontsource/roboto";
import "@fontsource/kanit";
import { extendTheme, ThemeConfig, ComponentStyleConfig } from "@chakra-ui/react";

const ComponentStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {
    size: "",
    variant: "",
    colorScheme: "",
  },
};

const HeadingComponentStyle: ComponentStyleConfig = {
  baseStyle: {
    color: "lightblue",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
};

const TextComponentStyle: ComponentStyleConfig = {
  baseStyle: {
    color: "whiteAlpha.700",
    lineHeight: "1.8",
  },
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  fonts: { heading: "Kanit, sans-serif", body: "Roboto, sans-serif" },
  config,
  components: { Heading: HeadingComponentStyle, Text: TextComponentStyle },
});

export default theme;
