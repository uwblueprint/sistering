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
                boxShadow: "none",
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
          textStyle: "button-semibold",
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
          menuButton: {
            color: "text.gray",
            _hover: {
              color: "teal",
            },
            _active: {
              color: "teal",
            },
            mr: "20px",
          },
        },
      },
      Table: {
        variants: {
          brand: {
            table: {
              borderSpacing: "0",
              borderColor: "background.dark",
              overflow: "hidden",
            },
            th: {
              ...textStyles["button-semibold"],
              textTransform: "inherit",
              letterSpacing: "inherit",
              borderBottom: "2px",
              borderColor: "background.dark",
              borderCollapse: "collapse",
            },
            td: {
              borderBottom: "2px",
              borderColor: "background.dark",
              borderCollapse: "collapse",
            },
            tr: {
              _last: {
                td: {
                  borderBottom: "none",
                },
              },
            },
            caption: {
              borderTop: "2px",
              borderColor: "background.dark",
              borderCollapse: "collapse",
            },
          },
        },
      },
      Link: {
        baseStyle: {
          textStyle: "button-semibold",
          _hover: {
            textDecoration: "none",
          },
          color: "violet",
        },
      },
      Checkbox: {
        baseStyle: {
          control: {
            _checked: {
              _disabled: {
                borderColor: "violet",
                bg: "violet",
                color: "white",
                opacity: 0.5,
              },
            },
            _disabled: { bg: "" },
          },
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" }),
);

export default customTheme;
