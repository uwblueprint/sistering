import { StyleFunctionProps, PartsStyleObject } from "@chakra-ui/theme-tools";
import { StepsStyleConfig } from "chakra-ui-steps";

const CustomStepsTheme = {
  ...StepsStyleConfig,
  baseStyle: (props: StyleFunctionProps): PartsStyleObject => ({
    ...StepsStyleConfig.baseStyle(props),
    connector: {
      ...StepsStyleConfig.baseStyle(props).connector,
      paddingTop: '30px',
      borderColor: "violet",
      opacity: "0.5",
      minHeight: '50px',
      _highlighted: {
        opacity: "1",
      },
    },
    label: {
      ...StepsStyleConfig.baseStyle(props).label,
      color: "currentColor",
      fontFamily: 'Open Sans'
    },
    stepIconContainer: {
      ...StepsStyleConfig.baseStyle(props).stepIconContainer,
      bg: "transparent",
      color: "violet",
      borderColor: "violet",
      opacity: "0.5",
      _activeStep: {
        bg: "violet",
        borderColor: "violet",
        color: "white",
        opacity: "1",
        _invalid: {
          bg: "red.500",
          borderColor: "red.500",
        },
      },
      _highlighted: {
        bg: "violet",
        borderColor: "violet",
        opacity: "1",
      },
      "&[data-clickable]:hover": {
        borderColor: "violet",
        opacity: "1",
      },
    },
  }),
  sizes: {
    ...StepsStyleConfig.sizes,
    sm: {
      ...StepsStyleConfig.sizes.sm,
      stepIconContainer: {
        ...StepsStyleConfig.sizes.sm.stepIconContainer,
        borderWidth: '3px',
      }
    },
    md: {
      ...StepsStyleConfig.sizes.md,
      stepIconContainer: {
        ...StepsStyleConfig.sizes.md.stepIconContainer,
        borderWidth: '3px',
      }
    },
  }
};

export default CustomStepsTheme;
