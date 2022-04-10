import React, { useContext } from "react";
import {
  Flex,
  GridItem,
  HStack,
  SimpleGrid,
  Stack,
  Table,
  Tag,
  Tbody,
  Text,
  VStack,
} from "@chakra-ui/react";

import FormHeader from "../../common/FormHeader";
import LabelledText from "../../common/LabelledText";
import PocCard from "../../common/PocCard";
import { ADMIN_POSTING_CREATE_REVIEW_ENTER_ALL_DETAILS } from "../../../constants/Copy";
import PostingContext from "../../../contexts/admin/PostingContext";
import ScheduledShiftsTr from "./ScheduledShiftsTr";
import RichTextDisplay from "../../common/RichText/RichTextDisplay";
import {
  formatTimeHourMinutes,
  getElapsedHours,
  getUTCDateForDateTimeString,
  getWeekday,
} from "../../../utils/DateTimeUtils";

const CreatePostingReview = (): React.ReactElement => {
  const {
    branch,
    skills,
    employees,
    title,
    description,
    autoClosingDate,
    times,
  } = useContext(PostingContext);

  return (
    <Flex p={10}>
      <VStack w="full" spacing={5} alignItems="flex-start">
        <FormHeader symbol="3" title="Review and Post" />
        <VStack w="full" spacing={9} alignItems="flex-start" px={2}>
          <Text textStyle="caption">
            {ADMIN_POSTING_CREATE_REVIEW_ENTER_ALL_DETAILS}
          </Text>
          <Stack spacing={6} w="full">
            <Text textStyle="heading">Basic Information</Text>
            <SimpleGrid columns={3} w="full">
              <GridItem colSpan={1}>
                <LabelledText label="Branch" text={branch.name} />
              </GridItem>
              <GridItem colSpan={1}>
                <LabelledText label="Title" text={title} />
              </GridItem>
              <GridItem colSpan={1}>
                <LabelledText
                  label="Posting Closing Date"
                  text={autoClosingDate}
                />
              </GridItem>
            </SimpleGrid>
            <Stack>
              <Text textStyle="subheading" color="text.gray" mt={3}>
                Description
              </Text>
              <Text textStyle="caption">
                <RichTextDisplay>{description}</RichTextDisplay>
              </Text>
            </Stack>
            <Stack spacing={4}>
              <Text textStyle="subheading" color="text.gray" mt={5}>
                Point(s) of Contact
              </Text>
              <HStack spacing={6}>
                {employees.map(
                  (
                    { firstName, lastName, email, phoneNumber, title: employeeTitle },
                    i,
                  ) => (
                    <PocCard
                      name={`${firstName} ${lastName}`}
                      title={employeeTitle}
                      email={email}
                      phoneNumber={phoneNumber ?? "Not available"}
                      key={i}
                    />
                  ),
                )}
              </HStack>
            </Stack>
            <Stack>
              <Text textStyle="subheading" color="text.gray" mt={4}>
                Skills
              </Text>
              <HStack>
                {skills.map(({ name }, i) => (
                  <Tag variant="brand" key={i}>
                    {name}
                  </Tag>
                ))}
              </HStack>
            </Stack>
          </Stack>
          <Stack spacing={3} width="full">
            <Text textStyle="heading" mt={3}>
              Scheduled Shifts
            </Text>
            <Table maxW="1000px" colorScheme="gray">
              <Tbody>
                {times.map((t, i) => {
                  const startDT = getUTCDateForDateTimeString(t.startTime);
                  const endDT = getUTCDateForDateTimeString(t.endTime);
                  const weekDay = getWeekday(startDT);
                  const startTime = formatTimeHourMinutes(
                    startDT,
                  ).toUpperCase();
                  const endTime = formatTimeHourMinutes(endDT).toUpperCase();
                  const elapsedHours = getElapsedHours(startDT, endDT);
                  const elapsedHoursString = `${elapsedHours} hour${
                    elapsedHours <= 1 ? "" : "s"
                  }`;
                  const time = `${startTime} - ${endTime} (${elapsedHoursString})`;
                  return (
                    <ScheduledShiftsTr
                      date={`${weekDay}s`}
                      time={time}
                      key={i}
                    />
                  );
                })}
              </Tbody>
            </Table>
          </Stack>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default CreatePostingReview;
