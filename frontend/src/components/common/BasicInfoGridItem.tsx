import React from "react";
import { Stack, GridItem, Text } from "@chakra-ui/react";

type BasicInfoGridItemProps = { title: string; info: string };

const BasicInfoGridItem: React.FC<BasicInfoGridItemProps> = ({
  title,
  info,
}: BasicInfoGridItemProps) => {
  return (
    <GridItem colSpan={1}>
      <Stack spacing={1}>
        <Text textStyle="subheading" color="text.gray">
          {title}
        </Text>
        <Text textStyle="body-regular" fontWeight="medium">
          {info}
        </Text>
      </Stack>
    </GridItem>
  );
};

export default BasicInfoGridItem;
