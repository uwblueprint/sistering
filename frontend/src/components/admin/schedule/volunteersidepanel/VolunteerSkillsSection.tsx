import React from "react";
import { Box, Tag, Text, VStack } from "@chakra-ui/react";
import { SkillResponseDTO } from "../../../../types/api/SkillTypes";

type VolunteerSkillsSectionProps = {
  skills: SkillResponseDTO[];
};

const VolunteerSkillsSection: React.FC<VolunteerSkillsSectionProps> = ({
  skills,
}: VolunteerSkillsSectionProps): React.ReactElement => {
  return (
    <VStack
      spacing="0px"
      w="full"
      px="32px"
      py="16px"
      alignItems="flex-start"
      borderTop="1px"
      borderLeft="1px"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <Text textStyle="body-bold">Skills</Text>
      <Box>
        {skills?.map((skill) => (
          <Tag key={skill.name} variant="outline" mr={2} mt={2}>
            {skill.name}
          </Tag>
        ))}
      </Box>
    </VStack>
  );
};

export default VolunteerSkillsSection;
