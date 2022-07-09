import React, { useContext, useState } from "react";
import { generatePath, Redirect, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import Logout from "../auth/Logout";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import { PostingResponseDTO } from "../../types/api/PostingTypes";
import AdminPostingCard, { PostingStatus } from "../admin/AdminPostingCard";
import { isEventPosting, isPast } from "../../utils/DateTimeUtils";
import PostingCard from "../volunteer/PostingCard";

const POSTINGS = gql`
  query Default_postings {
    postings {
      id
      branch {
        id
        name
      }
      skills {
        id
        name
      }
      shifts {
        id
        postingId
        startTime
        endTime
      }
      title
      description
      startDate
      endDate
      numVolunteers
      autoClosingDate
      status
    }
  }
`;

type Posting = Omit<PostingResponseDTO, "employees" | "type">;

const Default = (): React.ReactElement => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);
  const [postings, setPostings] = useState<Posting[] | null>(null);

  useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings);
    },
  });

  if (authenticatedUser?.role === Role.Volunteer) {
    return <Redirect to={Routes.VOLUNTEER_POSTINGS_PAGE} />;
  }

  const navigateToDetails = (id: string) => {
    const route = generatePath(Routes.ADMIN_POSTING_DETAILS, { id });
    history.push(route);
  };

  const navigateToAdminSchedule = (id: string) => {
    const route = generatePath(Routes.ADMIN_SCHEDULE_POSTING_PAGE, { id });
    history.push(route);
  };

  const getPostingStatus = (posting: Posting): PostingStatus => {
    if (posting.status === "DRAFT") {
      return PostingStatus.DRAFT;
    }
    if (isPast(posting.autoClosingDate)) {
      return PostingStatus.PAST;
    }
    if (posting.shifts.length === 0) {
      return PostingStatus.UNSCHEDULED;
    }
    return PostingStatus.SCHEDULED;
  };

  return (
    <Container maxW="container.xl" textAlign="center" mt={8}>
      <Text textStyle="display-large">Welcome to Sistering</Text>
      <ButtonGroup m={8}>
        <Logout />
        <Button
          onClick={() =>
            history.push(Routes.ADMIN_POSTING_CREATE_BASIC_INFO_PAGE)
          }
        >
          Create Posting
        </Button>
      </ButtonGroup>
      <SimpleGrid columns={2} spacing={4}>
        {authenticatedUser &&
          postings?.map((posting) => (
            <Box key={posting.id} pb="24px">
              <AdminPostingCard
                key={posting.id}
                status={getPostingStatus(posting)}
                role={authenticatedUser.role}
                id={posting.id}
                title={posting.title}
                startDate={posting.startDate}
                endDate={posting.endDate}
                autoClosingDate={posting.autoClosingDate}
                branchName={posting.branch.name}
                numVolunteers={posting.numVolunteers}
                navigateToAdminSchedule={() =>
                  navigateToAdminSchedule(posting.id)
                }
              />
            </Box>
          ))}
      </SimpleGrid>
    </Container>
  );
};

export default Default;
