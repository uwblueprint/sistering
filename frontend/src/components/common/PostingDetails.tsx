import React from "react";
import { Text, VStack, HStack, Box, Tag, Divider } from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import PocCard from "./PocCard";
import { PostingResponseDTO } from "../../types/api/PostingTypes";
import { formatDateString } from "../../utils/DateUtils";

type PostingDetailsProps = { postingDetails: PostingResponseDTO };

const PostingDetails = ({
  postingDetails,
}: PostingDetailsProps): React.ReactElement => {
  return (
    <Box w="full">
      <VStack alignItems="start" marginBottom={4} w="full">
        <HStack justifyContent="space-between" w="full">
          <Tag>{postingDetails.branch.name}</Tag>
          <Text textStyle="caption" color="text.gray">
            Deadline: {formatDateString(postingDetails.autoClosingDate)}
          </Text>
        </HStack>
        <Text textStyle="display-large">{postingDetails.title}</Text>
        <HStack>
          <CalendarIcon />
          <Text textStyle="caption">
            {formatDateString(postingDetails.startDate)} -{" "}
            {formatDateString(postingDetails.endDate)}
          </Text>
        </HStack>
        <HStack>
          <TimeIcon />
          <Text textStyle="caption">See posting details</Text>
        </HStack>
      </VStack>
      <Divider />
      <HStack w="100%" pt={4}>
        <Text textStyle="caption">Skills:</Text>
        {postingDetails.skills.map((skill) => (
          <Tag key={skill.id} variant="outline">
            {skill.name}
          </Tag>
        ))}
      </HStack>
      <Text textStyle="body-regular" py={4}>
        {postingDetails.description}
      </Text>
      <Text textStyle="body-regular">Point(s) of contact:</Text>
      <HStack pb={4}>
        <PocCard
          name="John Doe"
          title="hard code"
          email="hard code"
          phoneNumber="hard code"
          key={1}
        />
        <PocCard
          name="John Doe"
          title="hard code"
          email="hard code"
          phoneNumber="hard code"
          key={1}
        />
      </HStack>
    </Box>
  );
};

export default PostingDetails;
