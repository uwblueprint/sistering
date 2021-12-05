import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";

const REGULAR_FONT_WEIGHT = 400;
const SEMIBOLD_FONT_WEIGHT = 600;
const BOLD_FONT_WEIGHT = 700;

const customTheme = extendTheme({
  textStyles: {
    "display-large": {
      fontFamily: "Raleway",
      fontSize: "28px",
      fontWeight: SEMIBOLD_FONT_WEIGHT,
      lineHeight: "140%",
      color: "text.default",
    },
    "display-medium": {
      fontFamily: "Raleway",
      fontSize: "26px",
      fontWeight: SEMIBOLD_FONT_WEIGHT,
      lineHeight: "140%",
      color: "text.default",
    },
    "display-small-semibold": {
      fontFamily: "Raleway",
      fontSize: "24px",
      fontWeight: SEMIBOLD_FONT_WEIGHT,
      lineHeight: "150%",
      color: "text.default",
    },
    "display-small-regular": {
      fontFamily: "Raleway",
      fontSize: "24px",
      fontWeight: REGULAR_FONT_WEIGHT,
      lineHeight: "150%",
      color: "text.default",
    },
    heading: {
      fontFamily: "Raleway",
      fontSize: "20px",
      fontWeight: SEMIBOLD_FONT_WEIGHT,
      lineHeight: "150%",
      color: "text.default",
    },
    subheading: {
      fontFamily: "Raleway",
      fontSize: "16px",
      fontWeight: SEMIBOLD_FONT_WEIGHT,
      lineHeight: "130%",
      textTransform: "uppercase",
      color: "text.default",
    },
    "button-semibold": {
      fontFamily: "Raleway",
      fontSize: "18px",
      fontWeight: SEMIBOLD_FONT_WEIGHT,
      lineHeight: "24px",
      color: "text.default",
    },
    "button-regular": {
      fontFamily: "Raleway",
      fontSize: "18px",
      fontWeight: REGULAR_FONT_WEIGHT,
      lineHeight: "24px",
      color: "text.default",
    },
    "body-regular": {
      fontFamily: "Inter",
      fontSize: "18px",
      fontWeight: REGULAR_FONT_WEIGHT,
      lineHeight: "150%",
      color: "text.default",
    },
    "body-bold": {
      fontFamily: "Inter",
      fontSize: "18px",
      fontWeight: BOLD_FONT_WEIGHT,
      lineHeight: "150%",
      color: "text.default",
    },
    caption: {
      fontFamily: "Inter",
      fontSize: "16px",
      fontWeight: REGULAR_FONT_WEIGHT,
      lineHeight: "150%",
      color: "text.default",
    },
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors,
});

export default customTheme;
