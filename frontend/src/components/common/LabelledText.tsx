import React from "react";
import { Stack, Text } from "@chakra-ui/react";

type LabelledTextProps = { label: string; text: string };

const LabelledText: React.FC<LabelledTextProps> = ({
  label,
  text,
}: LabelledTextProps) => {
  return (
    <Stack spacing={1}>
      <Text textStyle="subheading" color="text.gray">
        {label}
      </Text>
      <Text textStyle="body-regular" fontWeight="medium">
        {text}
      </Text>
    </Stack>
  );
};

export default LabelledText;
