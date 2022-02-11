import React from "react";
import { Text, Tag } from "@chakra-ui/react";

type SkillTagProps = { name: string };

const SkillTag: React.FC<SkillTagProps> = ({ name }: SkillTagProps) => {
  return (
    <Tag variant="brand">
      <Text textStyle="caption" color="text.white">
        {name}
      </Text>
    </Tag>
  );
};

export default SkillTag;
