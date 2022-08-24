import React, { useContext, useState } from "react";
import { VStack, Box, Container, Button, Flex } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import PostingDetails from "../../../common/PostingDetails";
import ErrorModal from "../../../common/ErrorModal";
import Navbar from "../../../common/Navbar";
import {
  AdminNavbarTabs,
  AdminPages,
  EmployeeNavbarTabs,
} from "../../../../constants/Tabs";
import AuthContext from "../../../../contexts/AuthContext";
import { Role } from "../../../../types/AuthTypes";
import Loading from "../../../common/Loading";

const POSTING = gql`
  query AdminPostingDetails_Posting($id: ID!) {
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

const AdminPostingDetails = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useContext(AuthContext);
  const [isSuperAdmin] = useState(authenticatedUser?.role === Role.Admin);
  const {
    loading: postingLoading,
    error: postingError,
    data: { posting: postingDetails } = {},
  } = useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });
  const history = useHistory();
  return (!postingLoading && !postingDetails) || postingError ? (
    <Redirect to="/not-found" />
  ) : (
    <Box minH="100vh">
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={isSuperAdmin ? AdminNavbarTabs : EmployeeNavbarTabs}
      />
      <Box bg="background.light" py={7} px={10}>
        {postingError && <ErrorModal />}
        <VStack>
          <Container pt={3} pb={6} px={0} maxW="container.xl">
            <Flex justifyContent="flex-start">
              <Button
                leftIcon={<ChevronLeftIcon />}
                variant="link"
                onClick={() => history.goBack()}
              >
                Back
              </Button>
            </Flex>
          </Container>

          <Container
            bg="background.white"
            maxW="container.xl"
            centerContent
            borderRadius={10}
          >
            {postingLoading ? (
              <Loading />
            ) : (
              <PostingDetails postingDetails={postingDetails} />
            )}
          </Container>
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminPostingDetails;
