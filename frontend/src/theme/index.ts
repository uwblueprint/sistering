import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";

import colors from "./colors";
import textStyles from "./textStyles";
import CustomStepsTheme from "./stepsTheme";

const customTheme = extendTheme(
  {
    styles: {
      global: (props: { colorMode: string; theme: Dict }) => ({
        "html, body": props.theme.textStyles["body-regular"],
      }),
    },
    fonts: {
      heading: "Raleway",
      body: "Inter",
    },
    textStyles,
    config: {
      useSystemColorMode: false,
      initialColorMode: "light",
    },
    colors,
    components: {
      Steps: CustomStepsTheme,
      Tabs: {
        baseStyle: {
          tab: {
            textStyle: "button-semibold",
          },
        },
        variants: {
          line: {
            tab: {
              _selected: {
                color: "brand.500",
              },
            },
          },
        },
      },
      Tag: {
        baseStyle: {
          container: {
            ...textStyles.caption,
          },
        },
        variants: {
          brand: {
            container: {
              size: "md",
              bgColor: "violet",
              border: "2px",
              borderColor: "violet",
              borderRadius: "full",
              color: "text.white",
            },
          },
          subtle: {
            container: {
              backgroundColor: "green.light",
              color: "green.dark",
              borderRadius: "full",
            },
          },
          outline: {
            container: {
              color: "text.gray",
              boxShadow: `inset 0 0 0px 1px ${colors.text.gray}`,
              borderRadius: "full",
            },
          },
        },
      },
      Button: {
        baseStyle: {
          textStyle: "button-regular",
        },
        variants: {
          outline: {
            ringColor: "brand.500",
            color: "brand.500",
          },
          ghost: {
            color: "brand.500",
          },
          link: {
            _hover: {
              textDecoration: "none",
            },
          },
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" }),
);

export default customTheme;
