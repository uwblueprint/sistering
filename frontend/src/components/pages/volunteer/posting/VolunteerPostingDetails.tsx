import React, { useState } from "react";
import {
  Text,
  VStack,
  HStack,
  Box,
  Container,
  Divider,
  Button,
} from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import { formatDateString } from "../../../../utils/DateUtils";
import PostingDetails from "../../../common/PostingDetails";

const POSTING = gql`
  query Posting($id: ID!) {
    posting(id: $id) {
      title
      description
      branch {
        name
      }
      startDate
      endDate
      numVolunteers
      skills {
        name
      }
      employees {
        id
      }
      autoClosingDate
    }
  }
`;

const VolunteerPostingDetails = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [
    postingDetails,
    setPostingDetails,
  ] = useState<PostingResponseDTO | null>(null);
  useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostingDetails(data.posting);
    },
  });
  return (
    <Box bg="background.light" py={7} px={10} minH="100vh">
      <VStack>
        <Container pt={0} pb={4} px={0} maxW="container.xl">
          <HStack justifyContent="space-between">
            <Button leftIcon={<ChevronLeftIcon />} variant="link">
              Back to volunteer postings
            </Button>
            <Button>Submit availability</Button>
          </HStack>
        </Container>

        <Container
          bg="background.white"
          maxW="container.xl"
          centerContent
          borderRadius={10}
        >
          <VStack w="full">
            {postingDetails ? (
              <Box p={6} w="full">
                <VStack alignItems="start" w="full">
                  <PostingDetails postingDetails={postingDetails} />
                  <Divider />
                  <HStack justifyContent="space-between" pt={4} w="full">
                    <Text textStyle="caption" color="text.gray">
                      Deadline:{" "}
                      {formatDateString(postingDetails.autoClosingDate)}
                    </Text>
                    <Button>Submit availability</Button>
                  </HStack>
                </VStack>
              </Box>
            ) : null}
          </VStack>
        </Container>
      </VStack>
    </Box>
  );
};

export default VolunteerPostingDetails;
