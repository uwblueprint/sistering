import { PartsStyleFunction, StyleFunctionProps, SystemStyleFunction } from "@chakra-ui/theme-tools";
import { StepsStyleConfig } from "chakra-ui-steps";

const CustomStepsTheme = {
  ...StepsStyleConfig,
  baseStyle: (props: StyleFunctionProps) => ({
    ...StepsStyleConfig.baseStyle(props),
    connector: {
      ...StepsStyleConfig.baseStyle(props).connector,
      borderColor: "violet",
      _highlighted: {
        borderColor: "violet",
      },
    },
    label: {
      ...StepsStyleConfig.baseStyle(props).label,
      color: "currentColor"
    },
    stepIconContainer: {
      ...StepsStyleConfig.baseStyle(props).stepIconContainer,
      bg: "transparent",
      color: "violet",
      borderColor: "violet",
      _activeStep: {
        color: "white",
        bg: "violet",
        borderColor: "violet",
        _invalid: {
          bg: 'red.500',
          borderColor: 'red.500'
        }
      },
      _highlighted: {
        bg: "violet",
        borderColor: "violet",
      },
      '&[data-clickable]:hover': {
        borderColor: "violet",
      },
    }
  })
};

export default CustomStepsTheme;
