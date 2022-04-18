import React, { useState, useLayoutEffect, useContext } from "react";
import { generatePath, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Box, HStack, Select, Text } from "@chakra-ui/react";
import AuthContext from "../../../../contexts/AuthContext";

import {
  VOLUNTEER_POSTING_AVAILABILITIES,
  VOLUNTEER_POSTING_DETAILS,
} from "../../../../constants/Routes";
import {
  PostingResponseDTO,
  PostingStatus,
} from "../../../../types/api/PostingTypes";
import { dateInRange } from "../../../../utils/DateTimeUtils";
import { FilterType } from "../../../../types/DateFilterTypes";
import EmptyPostingCard from "../../../volunteer/EmptyPostingCard";
import PostingCard from "../../../volunteer/PostingCard";
import VolunteerNavbar from "../../../volunteer/VolunteerNavbar";

type Posting = Omit<
  PostingResponseDTO,
  "shifts" | "employees" | "type" | "numVolunteers" | "status"
>;

const POSTINGS = gql`
  query VolunteerPostingsPage_postings(
    $closingDate: Date!
    $statuses: [PostingStatus!]!
    $userId: ID!
  ) {
    postings(closingDate: $closingDate, statuses: $statuses, userId: $userId) {
      id
      branch {
        id
        name
      }
      skills {
        id
        name
      }
      title
      description
      startDate
      endDate
      autoClosingDate
    }
  }
`;

const VolunteerPostingsPage = (): React.ReactElement => {
  const history = useHistory();
  const [postings, setPostings] = useState<Posting[] | null>(null);
  const [unfilteredPostings, setUnfilteredPostings] = useState<
    Posting[] | null
  >(null);
  const [filter, setFilter] = useState<FilterType>("week");
  const { authenticatedUser } = useContext(AuthContext);

  useQuery(POSTINGS, {
    variables: {
      closingDate: new Date().toISOString().split("T")[0],
      statuses: ["PUBLISHED" as PostingStatus],
      userId: authenticatedUser?.id,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings);
      setUnfilteredPostings(data.postings);
    },
  });

  useLayoutEffect(() => {
    let filteredPostings;
    switch (filter) {
      case "month":
        filteredPostings = unfilteredPostings?.filter((posting) =>
          dateInRange(posting.startDate, "month"),
        );
        setPostings(filteredPostings ?? null);
        break;
      case "all":
        setPostings(unfilteredPostings);
        break;
      default:
        filteredPostings = unfilteredPostings?.filter((posting) =>
          dateInRange(posting.startDate, "week"),
        );
        setPostings(filteredPostings ?? null);
        break;
    }
  }, [filter, unfilteredPostings]);

  const navigateToDetails = (id: string) => {
    const route = generatePath(VOLUNTEER_POSTING_DETAILS, { id });
    history.push(route);
  };

  const navigateToSubmitAvailabilities = (id: string) => {
    const route = generatePath(VOLUNTEER_POSTING_AVAILABILITIES, { id });
    history.push(route);
  };

  const changeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: FilterType = e.target.value as FilterType;
    setFilter(value);
  };

  // TODO: need to refactor this function based on definition of what is an opportunity / event
  const isVolunteerOpportunity = (start: string, end: string): boolean => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate.getTime() - startDate.getTime() > 1000 * 60 * 60 * 24;
  };

  const volunteerOpportunities = postings?.filter((posting) =>
    isVolunteerOpportunity(posting.startDate, posting.endDate),
  );
  const events = postings?.filter(
    (posting) => !isVolunteerOpportunity(posting.startDate, posting.endDate),
  );

  return (
    <div>
      <VolunteerNavbar defaultIndex={1} />
      <Box
        bg="background.light"
        pt="48px"
        px="101px"
        pb="64px"
        minHeight="100vh"
      >
        <Box maxW="1280px" mx="auto">
          <HStack justify="space-between" pb="24px">
            <Text textStyle="display-small-semibold">Events</Text>
            <HStack>
              <Text>Showing: </Text>
              <Select
                width="194px"
                defaultValue="week"
                size="sm"
                bg="white"
                borderRadius="4px"
                onChange={changeFilter}
              >
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="all">All shifts</option>
              </Select>
            </HStack>
          </HStack>
          {events && events.length > 0 ? (
            events.map((posting) => (
              <Box key={posting.id} pb="24px">
                <PostingCard
                  key={posting.id}
                  id={posting.id}
                  skills={posting.skills}
                  title={posting.title}
                  startDate={posting.startDate}
                  endDate={posting.endDate}
                  autoClosingDate={posting.autoClosingDate}
                  description={posting.description}
                  branchName={posting.branch.name}
                  navigateToDetails={() => navigateToDetails(posting.id)}
                  navigateToSubmitAvailabilities={() =>
                    navigateToSubmitAvailabilities(posting.id)
                  }
                />
              </Box>
            ))
          ) : (
            <EmptyPostingCard type="event" />
          )}
          <Text textStyle="display-small-semibold" pb="24px" pt="24px">
            Volunteer Opportunities
          </Text>
          {volunteerOpportunities && volunteerOpportunities.length > 0 ? (
            volunteerOpportunities.map((posting) => (
              <Box key={posting.id} pb="24px">
                <PostingCard
                  key={posting.id}
                  id={posting.id}
                  skills={posting.skills}
                  title={posting.title}
                  startDate={posting.startDate}
                  endDate={posting.endDate}
                  autoClosingDate={posting.autoClosingDate}
                  description={posting.description}
                  branchName={posting.branch.name}
                  navigateToDetails={() => navigateToDetails(posting.id)}
                  navigateToSubmitAvailabilities={() =>
                    navigateToSubmitAvailabilities(posting.id)
                  }
                />
              </Box>
            ))
          ) : (
            <EmptyPostingCard type="opportunity" />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default VolunteerPostingsPage;
