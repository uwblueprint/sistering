import React from "react";
import { Circle, HStack, Text } from "@chakra-ui/react";

type FormHeaderProps = { symbol: string; title: string };

const FormHeader: React.FC<FormHeaderProps> = ({
  symbol,
  title,
}: FormHeaderProps): React.ReactElement => {
  return (
    <HStack spacing={5}>
      <Circle
        size="46px"
        bg="transparent"
        borderWidth="3px"
        borderColor="violet"
        pb={1}
      >
        <Text textStyle="heading" color="violet" fontWeight="bold">
          {symbol}
        </Text>
      </Circle>
      <Text textStyle="heading">{title}</Text>
    </HStack>
  );
};

export default FormHeader;
