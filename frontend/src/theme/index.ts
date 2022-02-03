import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";

import colors from "./colors";

const customTheme = extendTheme(
  {
    styles: {
      global: (props: { colorMode: string; theme: Dict }) => ({
        "html, body": props.theme.textStyles["body-regular"],
      }),
    },
    textStyles: {
      "display-large": {
        fontFamily: "Raleway",
        fontSize: "28px",
        fontWeight: "semibold",
        lineHeight: "140%",
        color: "text.default",
      },
      "display-medium": {
        fontFamily: "Raleway",
        fontSize: "26px",
        fontWeight: "semibold",
        lineHeight: "140%",
        color: "text.default",
      },
      "display-small-semibold": {
        fontFamily: "Raleway",
        fontSize: "24px",
        fontWeight: "semibold",
        lineHeight: "150%",
        color: "text.default",
      },
      "display-small-regular": {
        fontFamily: "Raleway",
        fontSize: "24px",
        fontWeight: "normal",
        lineHeight: "150%",
        color: "text.default",
      },
      heading: {
        fontFamily: "Raleway",
        fontSize: "20px",
        fontWeight: "semibold",
        lineHeight: "150%",
        color: "text.default",
      },
      subheading: {
        fontFamily: "Raleway",
        fontSize: "16px",
        fontWeight: "semibold",
        lineHeight: "130%",
        textTransform: "uppercase",
        color: "text.default",
      },
      "button-semibold": {
        fontFamily: "Raleway",
        fontSize: "18px",
        fontWeight: "semibold",
        lineHeight: "24px",
        color: "text.default",
      },
      "button-regular": {
        fontFamily: "Raleway",
        fontSize: "18px",
        fontWeight: "normal",
        lineHeight: "24px",
        color: "text.default",
      },
      "body-regular": {
        fontFamily: "Inter",
        fontSize: "18px",
        fontWeight: "normal",
        lineHeight: "150%",
        color: "text.default",
      },
      "body-bold": {
        fontFamily: "Inter",
        fontSize: "18px",
        fontWeight: "bold",
        lineHeight: "150%",
        color: "text.default",
      },
      caption: {
        fontFamily: "Inter",
        fontSize: "16px",
        fontWeight: "normal",
        lineHeight: "150%",
        color: "text.default",
      },
    },
    config: {
      useSystemColorMode: false,
      initialColorMode: "light",
    },
    colors,
    components: {
      Tabs: {
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
      Button: {
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
