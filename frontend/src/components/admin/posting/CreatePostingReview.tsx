import React, { useContext, useState } from "react";
import {
  Container,
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
import PostingContext from "../../../contexts/admin/PostingContext";
import { ADMIN_POSTING_CREATE_REVIEW_ENTER_ALL_DETAILS } from "../../../constants/Copy";
import ScheduledShiftsTr from "./ScheduledShiftsTr";
import RichTextDisplay from "./RichTextDisplay";

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

  // richText test cases provided by Albert
  const richTextSample1  = '{"blocks":[{"key":"2ggjh","text":"ajsfiosdjfioaweiofewofjaoij ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":10,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"8annk","text":"asdfasdfasdfasdfasdf jasodifjioasdjf asjdifojasoidfoajsd","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":21,"style":"ITALIC"},{"offset":37,"length":19,"style":"ITALIC"},{"offset":21,"length":35,"style":"UNDERLINE"},{"offset":37,"length":19,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}'
  const richTextSample2 = '{"blocks":[{"key":"2ggjh","text":"hi","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2nlb2","text":"aewf","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"6a81d","text":"asf","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"BOLD"},{"offset":0,"length":3,"style":"UNDERLINE"}],"entityRanges":[],"data":{}}],"entityMap":{}}'
  const richTextSample3 = '{"blocks":[{"key":"2ggjh","text":"ajwefiojeio","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"80c8b","text":"jasidf","type":"unordered-list-item","depth":0,"inlineStyleRanges":[{"offset":0,"length":6,"style":"BOLD"},{"offset":0,"length":6,"style":"UNDERLINE"},{"offset":0,"length":6,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"4qepd","text":"ajewoifjwejo","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":12,"style":"BOLD"},{"offset":0,"length":12,"style":"UNDERLINE"},{"offset":0,"length":12,"style":"ITALIC"}],"entityRanges":[],"data":{}}],"entityMap":{}}'
  const richTextSample4 = '{"blocks":[{"key":"bqs0t","text":"ajsdfaisdofjoiadsj","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3mlen","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6vqdk","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7pgum","text":"asfd","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"chfmd","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"956gi","text":"asdfdsf","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":0,"length":7,"style":"ITALIC"}],"entityRanges":[],"data":{}},{"key":"6thnm","text":"asdf","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"nv84","text":"f","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'

  return (
    <Container maxW="container.xl" p={0}>
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
                  <RichTextDisplay>{richTextSample4}</RichTextDisplay>
                </Text>
              </Stack>
              <Stack spacing={4}>
                <Text textStyle="subheading" color="text.gray" mt={5}>
                  Point(s) of Contact
                </Text>
                <HStack spacing={6}>
                  {employees.map(
                    ({ firstName, lastName, email, phoneNumber }, i) => (
                      <PocCard
                        name={`${firstName} ${lastName}`}
                        title="REPLACE WITH TITLE"
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
