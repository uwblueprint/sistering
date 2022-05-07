import React from "react";
import { TimeIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  VStack,
  HStack,
  Divider,
  Button,
  ButtonGroup,
  Tag,
} from "@chakra-ui/react";

import RichTextDisplay from "../common/RichText/RichTextDisplay";
import { formatDateStringYear } from "../../utils/DateTimeUtils";
import { SkillResponseDTO } from "../../types/api/SkillTypes";

type PostingCardProps = {
  id: string;
  title: string;
  skills: SkillResponseDTO[];
  description: string;
  startDate: string;
  endDate: string;
  autoClosingDate: string;
  branchName: string;
  navigateToDetails: () => void;
  navigateToSubmitAvailabilities: () => void;
};

const PostingCard = ({
  id,
  title,
  skills,
  description,
  startDate,
  endDate,
  autoClosingDate,
  branchName,
  navigateToDetails,
  navigateToSubmitAvailabilities,
}: PostingCardProps): React.ReactElement => {
  return (
    <Box
      bg="white"
      borderRadius="8px"
      border="2px solid"
      borderColor="background.dark"
      id={id}
    >
      <VStack px="40px" py="36px" align="start" spacing="12px">
        <Tag>{branchName}</Tag>
        <Text textStyle="heading">{title}</Text>
        <HStack spacing={4}>
          {/* TODO: conditionally displaying time for event listings */}
          <Text textStyle="caption" noOfLines={2}>
            <TimeIcon w={4} pr={1} />
            See Posting Details
          </Text>
          <Box textStyle="caption">
            <CalendarIcon w={4} pr={1} />
            {`${formatDateStringYear(startDate)} - ${formatDateStringYear(
              endDate,
            )}`}
          </Box>
        </HStack>
        <Box textStyle="body-regular" noOfLines={2}>
          <RichTextDisplay>{description}</RichTextDisplay>
        </Box>
        <HStack>
          <Text textStyle="body-regular">Skills: </Text>
          {skills.slice(0, 5).map((skill) => (
            <Tag variant="outline" key={skill.id}>
              {skill.name}
            </Tag>
          ))}
        </HStack>
        <Box w="100%" h="100%" mt="16px !important" mb="4px !important">
          <Divider />
        </Box>
        <HStack justifyContent="space-between" w="100%">
          <Text textStyle="caption" color="text.gray">
            Deadline: {formatDateStringYear(autoClosingDate)}
          </Text>
          <ButtonGroup spacing="10px" size="md">
            <Button variant="ghost" onClick={navigateToDetails}>
              View Details
            </Button>
            <Button variant="solid" onClick={navigateToSubmitAvailabilities}>
              Submit Availability
            </Button>
          </ButtonGroup>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PostingCard;
