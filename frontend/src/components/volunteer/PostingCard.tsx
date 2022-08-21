import React, { useEffect, useState } from "react";
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

import moment from "moment";
import RichTextDisplay from "../common/RichText/RichTextDisplay";
import {
  formatDateStringYear,
  formatRawTimeHourMinutes,
} from "../../utils/DateTimeUtils";
import { SkillResponseDTO } from "../../types/api/SkillTypes";
import { PostingRecurrenceType } from "../../types/PostingTypes";
import { ShiftDTO } from "../../types/api/ShiftTypes";

type PostingCardProps = {
  id: string;
  title: string;
  skills: SkillResponseDTO[];
  description: string;
  startDate: string;
  endDate: string;
  autoClosingDate: string;
  branchName: string;
  type: PostingRecurrenceType;
  shifts: ShiftDTO[];
  navigateToDetails: () => void;
  navigateToSubmitAvailabilities?: () => void;
  navigateToAdminSchedule?: () => void;
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
  shifts,
  navigateToDetails,
  navigateToSubmitAvailabilities,
  navigateToAdminSchedule,
}: PostingCardProps): React.ReactElement => {
  const [eventFirstTime, setEventFirstTime] = useState(new Date(startDate));
  const [eventLatestTime, setEventLatestTime] = useState(new Date(endDate));

  useEffect(() => {
    if (type === "EVENT") {
      const sortedStartTimes = shifts
        .map((shift) => moment(new Date(shift.startTime)))
        .sort((a, b) => a.diff(b));
      const sortedEndTimes = shifts
        .map((shift) => moment(new Date(shift.endTime)))
        .sort((a, b) => a.diff(b));
      if (sortedStartTimes.length > 0) {
        setEventFirstTime(sortedStartTimes[0].toDate());
      }
      if (sortedEndTimes.length > 0) {
        setEventLatestTime(sortedEndTimes[sortedEndTimes.length - 1].toDate());
      }
    }
  }, [shifts, type]);

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
        <Text noOfLines={1} textStyle="heading">
          {title}
        </Text>
        <HStack spacing={4}>
          <Text textStyle="caption" noOfLines={2}>
            <TimeIcon w={4} pr={1} />
            {type === "OPPORTUNITY"
              ? "See posting details"
              : `${formatRawTimeHourMinutes(
                  new Date(eventFirstTime),
                )} - ${formatRawTimeHourMinutes(new Date(eventLatestTime))}`}
          </Text>
          <Box textStyle="caption">
            <CalendarIcon w={4} pr={1} />
            {type === "OPPORTUNITY"
              ? `${formatDateStringYear(startDate)} - ${formatDateStringYear(
                  endDate,
                )}`
              : formatDateStringYear(startDate)}
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
            {navigateToSubmitAvailabilities && (
              <Button variant="solid" onClick={navigateToSubmitAvailabilities}>
                Submit Availability
              </Button>
            )}
            {navigateToAdminSchedule && (
              <Button variant="solid" onClick={navigateToAdminSchedule}>
                Edit Schedule
              </Button>
            )}
          </ButtonGroup>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PostingCard;
