import React from "react";
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
import { TimeIcon, CalendarIcon } from "@chakra-ui/icons";
import { SkillResponseDTO } from "../../types/api/SkillTypes";
import { formatDateString } from "../../utils/DateUtils";

type PostingCardProps = {
  id: string;
  title: string;
  skills: SkillResponseDTO[];
  description: string;
  startDate: Date;
  endDate: Date;
  autoClosingDate: Date;
  branchName: string;
  type: "EVENT" | "OPPORTUNITY";
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
  type,
}: PostingCardProps): JSX.Element => {
  return (
    <Box
      bg="white"
      borderRadius="8px"
      border="2px solid"
      borderColor="background.dark"
      id={id}
    >
      <VStack p={6} align="start" spacing="12px">
        <Tag>{branchName}</Tag>
        <Text textStyle="heading">{title}</Text>
        <HStack spacing={4}>
          {/* toAdd: conditionally displaying time for event listings */}
          <Text textStyle="caption" noOfLines={2}>
            <TimeIcon w={4} pr={1} />
            See Posting Details
          </Text>
          <Text textStyle="caption">
            <CalendarIcon w={4} pr={1} />
            {`${formatDateString(startDate)} - ${formatDateString(endDate)}`}
          </Text>
        </HStack>
        <Text textStyle="body-regular" noOfLines={2}>
          {description}
        </Text>
        <HStack>
          <Text textStyle="body-regular">Skills: </Text>
          {skills.slice(0, 5).map((skill) => (
            <Tag variant="outline" key={skill.id}>
              {skill.name}
            </Tag>
          ))}
        </HStack>
        <Divider mb={1} />
        <HStack justifyContent="space-between" w="100%">
          <Text textStyle="caption" color="text.gray">
            Deadline: {formatDateString(autoClosingDate)}
          </Text>
          <ButtonGroup spacing="4" size="md">
            <Button variant="ghost">View Details</Button>
            <Button variant="solid">Submit Availability</Button>
          </ButtonGroup>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PostingCard;
