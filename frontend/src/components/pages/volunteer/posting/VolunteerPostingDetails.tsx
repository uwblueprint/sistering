import React, { useContext } from "react";
import { VStack, HStack, Box, Container, Button } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import {
  generatePath,
  useHistory,
  useParams,
  Redirect,
} from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import PostingDetails from "../../../common/PostingDetails";
import {
  VOLUNTEER_POSTING_AVAILABILITIES,
  VOLUNTEER_POSTINGS_PAGE,
} from "../../../../constants/Routes";
import Loading from "../../../common/Loading";
import AuthContext from "../../../../contexts/AuthContext";

const POSTING = gql`
  query VolunteerPostingDetails_Posting($id: ID!, $userId: ID!) {
    posting(id: $id, userId: $userId) {
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
        phoneNumber
      }
      autoClosingDate
    }
  }
`;

const VolunteerPostingDetails = (): React.ReactElement => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useContext(AuthContext);

  const { loading, error, data: { posting: postingDetails } = {} } = useQuery(
    POSTING,
    {
      variables: { id, userId: authenticatedUser?.id },
      fetchPolicy: "cache-and-network",
    },
  );

  const navigateToSubmitAvailabilities = () => {
    const route = generatePath(VOLUNTEER_POSTING_AVAILABILITIES, { id });
    history.push(route);
  };

  return (!loading && !postingDetails) || error ? (
    <Redirect to="/not-found" />
  ) : (
    <Box bg="background.light" py={7} px={10} minH="100vh">
      <VStack>
        <Container pt={0} pb={4} px={0} maxW="container.xl">
          <HStack justifyContent="space-between">
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="link"
              onClick={() => history.push(VOLUNTEER_POSTINGS_PAGE)}
            >
              Back to volunteer postings
            </Button>
            <Button onClick={navigateToSubmitAvailabilities}>
              Submit availability
            </Button>
          </HStack>
        </Container>

        <Container
          bg="background.white"
          maxW="container.xl"
          centerContent
          borderRadius={10}
        >
          {loading ? (
            <Loading />
          ) : (
            <PostingDetails
              postingDetails={postingDetails}
              footerButtonOnClick={navigateToSubmitAvailabilities}
            />
          )}
        </Container>
      </VStack>
    </Box>
  );
};

export default VolunteerPostingDetails;
