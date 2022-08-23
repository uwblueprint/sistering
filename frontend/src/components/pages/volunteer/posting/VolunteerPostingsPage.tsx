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
import {
  dateInRange,
  getUTCDateForDateTimeString,
  isEventPosting,
} from "../../../../utils/DateTimeUtils";
import { FilterType } from "../../../../types/DateFilterTypes";
import EmptyPostingCard from "../../../volunteer/EmptyPostingCard";
import PostingCard from "../../../volunteer/PostingCard";
import Navbar from "../../../common/Navbar";
import {
  VolunteerNavbarTabs,
  VolunteerPages,
} from "../../../../constants/Tabs";
import ErrorModal from "../../../common/ErrorModal";

type Posting = Omit<
  PostingResponseDTO,
  "employees" | "type" | "numVolunteers" | "status"
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

  const { error } = useQuery(POSTINGS, {
    variables: {
      closingDate: getUTCDateForDateTimeString(new Date().toString())
        .toISOString()
        .split("T")[0],
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
    const filteredPostings = unfilteredPostings?.filter((posting) =>
      dateInRange(posting.autoClosingDate, filter),
    );
    setPostings(filteredPostings ?? null);
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

  const volunteerOpportunities = postings?.filter(
    (posting) =>
      !isEventPosting(new Date(posting.startDate), new Date(posting.endDate)),
  );
  const events = postings?.filter((posting) =>
    isEventPosting(new Date(posting.startDate), new Date(posting.endDate)),
  );

  return (
    <div>
      {error && <ErrorModal />}
      <Navbar
        defaultIndex={VolunteerPages.VolunteerPostings}
        tabs={VolunteerNavbarTabs}
      />
      <Box bg="background.light" pt="48px" px="101px" pb="64px" minH="100vh">
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
                <option value="all">All postings</option>
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
                  type="EVENT"
                  shifts={posting.shifts}
                  navigateToDetails={() => navigateToDetails(posting.id)}
                  navigateToSubmitAvailabilities={() =>
                    navigateToSubmitAvailabilities(posting.id)
                  }
                />
              </Box>
            ))
          ) : (
            <EmptyPostingCard type="EVENT" />
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
                  type="OPPORTUNITY"
                  shifts={posting.shifts}
                  navigateToDetails={() => navigateToDetails(posting.id)}
                  navigateToSubmitAvailabilities={() =>
                    navigateToSubmitAvailabilities(posting.id)
                  }
                />
              </Box>
            ))
          ) : (
            <EmptyPostingCard type="OPPORTUNITY" />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default VolunteerPostingsPage;
