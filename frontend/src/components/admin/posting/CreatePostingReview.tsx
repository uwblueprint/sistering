import React, { useContext } from "react";
import {
  Container,
  Flex,
  Stack,
  VStack,
  HStack,
  SimpleGrid,
  GridItem,
  Table,
  Tbody,
  Text,
  Circle,
  Tag,
} from "@chakra-ui/react";

import LabelledText from "../../common/LabelledText";
import PocCard from "../../common/PocCard";
import ScheduledShiftsTr from "./ScheduledShiftsTr";

import PostingContext from "../../../contexts/admin/PostingContext";
import { ADMIN_POSTING_CREATE_REVIEW_ENTER_ALL_DETAILS } from "../../../constants/Copy";

const CreatePostingReview = (): React.ReactElement => {
  const {
    branchId,
    skills,
    employees,
    title,
    description,
    autoClosingDate,
    times,
  } = useContext(PostingContext);

  return (
    <Container maxW="container.xl" p={0}>
      <Flex p={10}>
        <VStack w="full" spacing={5} alignItems="flex-start">
          <HStack spacing={5}>
            <Circle
              size="46px"
              bg="transparent"
              borderWidth="3px"
              borderColor="violet"
              pb={1}
            >
              <Text textStyle="heading" color="violet" fontWeight="bold">
                3
              </Text>
            </Circle>
            <Text textStyle="heading">Review and Post</Text>
          </HStack>
          <VStack w="full" spacing={9} alignItems="flex-start" px={2}>
            <Text textStyle="caption">
              {ADMIN_POSTING_CREATE_REVIEW_ENTER_ALL_DETAILS}
            </Text>
            <Stack spacing={6} w="full">
              <Text textStyle="heading">Basic Information</Text>
              <SimpleGrid columns={3} w="full">
                <GridItem colSpan={1}>
                  <LabelledText label="Branch" text={branchId} />
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
                <Text textStyle="caption">{description}</Text>
              </Stack>
              <Stack spacing={4}>
                <Text textStyle="subheading" color="text.gray" mt={5}>
                  Point(s) of Contact
                </Text>
                <HStack spacing={6}>
                  {employees.map((name, i) => (
                    <PocCard
                      name={name}
                      title="hard code"
                      email="hard code"
                      phoneNumber="hard code"
                      key={i}
                    />
                  ))}
                </HStack>
              </Stack>
              <Stack>
                <Text textStyle="subheading" color="text.gray" mt={4}>
                  Skills
                </Text>
                <HStack>
                  {skills.map((name, i) => (
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
                    const startDT = new Date(t.startTime);
                    const endDT = new Date(t.endTime);
                    const date = startDT.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    });
                    const startTime = startDT.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "numeric",
                    });
                    const endTime = endDT.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "numeric",
                    });
                    const hours = (endDT.valueOf() - startDT.valueOf()) / 36e5;
                    const time = `${startTime} - ${endTime} (${hours} hours)`;
                    return (
                      <ScheduledShiftsTr date={date} time={time} key={i} />
                    );
                  })}
                </Tbody>
              </Table>
            </Stack>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default CreatePostingReview;
