import React from "react";
import { Box, Tag, Text, VStack, Flex } from "@chakra-ui/react";
import { SkillResponseDTO } from "../../../../types/api/SkillTypes";
import TagsPopover from "../../../common/TagsPopover";

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
        {skills.length > 0 ? (
          <Flex>
            {skills.slice(0, 3).map((skill) => (
              <Tag key={skill.name} variant="outline" mr={2} mt={2}>
                {skill.name}
              </Tag>
            ))}
            <Box mt="auto">
              {skills.length > 3 && (
                <TagsPopover
                  variant="outline"
                  header="Skills"
                  displayLength={3}
                  tags={skills.map((skill) => (
                    <Tag variant="outline" key={skill.name} mr={2} mt={2}>
                      {skill.name}
                    </Tag>
                  ))}
                />
              )}
            </Box>
          </Flex>
        ) : (
          <Text textStyle="body-regular" fontSize="14px">
            No skills listed.
          </Text>
        )}
      </Box>
    </VStack>
  );
};

export default VolunteerSkillsSection;
