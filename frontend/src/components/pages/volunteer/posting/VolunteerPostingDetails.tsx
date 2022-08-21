import React, { useState, useContext, useRef, useEffect } from "react";
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
import ErrorModal from "../../../common/ErrorModal";
import {
  VOLUNTEER_POSTING_AVAILABILITIES,
  VOLUNTEER_POSTINGS_PAGE,
} from "../../../../constants/Routes";
import Loading from "../../../common/Loading";
import AuthContext from "../../../../contexts/AuthContext";
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";

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
        phoneNumber
      }
      autoClosingDate
    }
  }
`;

const VOLUNTEER_BY_ID = gql`
  query VolunteerPostingDetails_VolunteerUserById($id: ID!) {
    volunteerUserById(id: $id) {
      branches {
        id
        name
      }
    }
  }
`;

const VolunteerPostingDetails = (): React.ReactElement => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useContext(AuthContext);
  const [userBranches, setUserBranches] = useState<string[]>([]);
  const [
    postingDetails,
    setPostingDetails,
  ] = useState<PostingResponseDTO | null>(null);

  const isFirstRun1 = useRef(true);
  const isFirstRun2 = useRef(true);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingPosting, setLoadingPosting] = useState<boolean>(true);

  const { error } = useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostingDetails(data.posting);
    },
  });

  useQuery(VOLUNTEER_BY_ID, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: authenticatedUser?.id,
    },
    onCompleted: (data) => {
      setUserBranches(
        data.volunteerUserById.branches.map((b: BranchResponseDTO) => b.name),
      );
    },
  });

  const navigateToSubmitAvailabilities = () => {
    const route = generatePath(VOLUNTEER_POSTING_AVAILABILITIES, { id });
    history.push(route);
  };

  useEffect(() => {
    if (isFirstRun1.current) {
      isFirstRun1.current = false;
      return;
    }
    setLoadingUser(false);
  }, [userBranches]);
  useEffect(() => {
    if (isFirstRun2.current) {
      isFirstRun2.current = false;
      return;
    }
    setLoadingPosting(false);
  }, [postingDetails]);

  const NotFoundOrPostingDetails = () => {
    if (
      postingDetails &&
      userBranches.length > 0 &&
      userBranches.includes(postingDetails.branch.name)
    ) {
      return (
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
              <PostingDetails
                postingDetails={postingDetails}
                footerButtonOnClick={navigateToSubmitAvailabilities}
              />
            </Container>
          </VStack>
        </Box>
      );
    }
    return <Redirect to="/not-found" />;
  };

  return loadingPosting || loadingUser ? (
    <>
      {error && <ErrorModal />}
      <Loading />
    </>
  ) : (
    <NotFoundOrPostingDetails />
  );
};

export default VolunteerPostingDetails;
