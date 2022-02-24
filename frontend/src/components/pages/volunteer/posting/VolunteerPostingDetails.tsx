import React, { useState } from "react";
import { VStack, HStack, Box, Container, Button } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
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
          {postingDetails ? (
            <PostingDetails postingDetails={postingDetails} showFooterButton />
          ) : null}
        </Container>
      </VStack>
    </Box>
  );
};

export default VolunteerPostingDetails;
