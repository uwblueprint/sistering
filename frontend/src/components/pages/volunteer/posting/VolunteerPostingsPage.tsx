import React, { useState, useLayoutEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";

import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import { dateInRange } from "../../../../utils/DateTimeUtils";
import { FilterType } from "../../../../types/DateFilterTypes";
import NoShiftsAvailableTableRow from "../../../volunteer/shifts/NoShiftsAvailableTableRow";
import VolunteerAvailabilityTableRow from "../../../volunteer/shifts/VolunteerAvailabilityTableRow";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";

type Posting = Omit<
  PostingResponseDTO,
  "shifts" | "employees" | "type" | "numVolunteers" | "status"
>;

const POSTINGS = gql`
  query VolunteerPostingsPage_postings {
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
      title
      description
      startDate
      endDate
      autoClosingDate
    }
  }
`;

const VolunteerPostingsPage = (): React.ReactElement => {
  const [postings, setPostings] = useState<Posting[] | null>(null);
  const [unfilteredPostings, setUnfilteredPostings] = useState<
    Posting[] | null
  >(null);
  const [filter, setFilter] = useState<FilterType>("week");

  useQuery(POSTINGS, {
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
      {/* <VolunteerNavbar defaultIndex={1} />
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
                />
              </Box>
            ))
          ) : (
            <EmptyPostingCard type="opportunity" />
          )}
        </Box>
      </Box> */}
      {/* Temp */}
      <Box p={25}>
        <VolunteerAvailabilityTable postingId={1} />
      </Box>
    </div>
  );
};

export default VolunteerPostingsPage;
