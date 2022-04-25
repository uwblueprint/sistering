import React from "react";
import { VStack, HStack, Box, Container, Button } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { useParams, Redirect } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import PostingDetails from "../../../common/PostingDetails";

const POSTING = gql`
  query VolunteerPostingDetails_Posting($id: ID!) {
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
        firstName
        lastName
        email
        title
        phoneNumber
      }
      autoClosingDate
    }
  }
`;

const VolunteerPostingDetails = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { loading, data: { posting: postingDetails } = {} } = useQuery(
    POSTING,
    {
      variables: { id },
      fetchPolicy: "cache-and-network",
    },
  );

  return !loading && !postingDetails ? (
    <Redirect to="/not-found" />
  ) : (
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
