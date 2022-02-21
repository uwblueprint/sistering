import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Text, Box, HStack, Select } from "@chakra-ui/react";
import PostingCard from "../../../volunteer/PostingCard";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import EmptyPostingCard from "../../../volunteer/EmptyPostingCard";

// delete before merging to main
// const postingsArr = [
//   {
//     id: "1",
//     skills: [
//       { id: "1", name: "CPR" },
//       { id: "2", name: "WHMIS" },
//       { id: "3", name: "Photocopying" },
//     ],
//     branch: {
//       id: "1",
//       name: "branch name",
//     },
//     title: "Medical Reception Volunteer",
//     startDate: new Date("Feb 28, 2022"),
//     endDate: new Date("March 20, 2022"),
//     autoClosingDate: new Date("Monday, November 30"),
//     isSignedUp: false,
//     description:
//       "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
//   },
//   {
//     id: "2",
//     skills: [
//       { id: "1", name: "CPR" },
//       { id: "2", name: "WHMIS" },
//       { id: "3", name: "Photocopying" },
//     ],
//     branch: {
//       id: "1",
//       name: "sample text",
//     },
//     title: "Medical Reception Volunteer",
//     startDate: new Date("February 14, 2022"),
//     endDate: new Date("March 20, 2022"),
//     autoClosingDate: new Date("Monday, November 30"),
//     isSignedUp: false,
//     description:
//       "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
//   },
//   {
//     id: "3",
//     skills: [
//       { id: "1", name: "CPR" },
//       { id: "2", name: "WHMIS" },
//       { id: "3", name: "Photocopying" },
//     ],
//     branch: {
//       id: "1",
//       name: "sample text",
//     },
//     title: "Medical Reception Volunteer",
//     startDate: new Date("March 18, 2022"),
//     endDate: new Date("March 20, 2022"),
//     autoClosingDate: new Date("Monday, November 30"),
//     isSignedUp: false,
//     description:
//       "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
//   },
// ];

// can refactor this query in the future to be more specific (depending on the data this page needs)
const POSTINGS = gql`
  query VolunteerPostingsPage_postings {
    postings {
      id
      branch {
        id
        name
      }
      shifts {
        id
        postingId
        startTime
        endTime
      }
      skills {
        id
        name
      }
      employees {
        id
        branchId
      }
      title
      type
      status
      description
      startDate
      endDate
      autoClosingDate
      numVolunteers
    }
  }
`;

const MS_PER_WEEK = 604800000;


const VolunteerPostingsPage = (): React.ReactElement => {

  const [postings, setPostings] = useState<PostingResponseDTO[] | null>(null);
  const [unfilteredPostings, setUnfilteredPostings] = useState<PostingResponseDTO[] | null>(null);
  const [filter, setFilter] = useState<string>('week')

  useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings)
      setUnfilteredPostings(data.postings)
  }}
  );


  // should posting.startDate type be declared as string instead on frontend?
  const dateCompareUtil = (start: Date, filterType: string):boolean => {
    const startDate = new Date(start);
    return startDate.getTime() - Date.now() > 0 && startDate.getTime() - Date.now() < (filterType === 'week' ? MS_PER_WEEK : MS_PER_WEEK * 4)
  }

  useEffect(() => {
    let filteredPostings;
      switch (filter) {
        case 'month': 
          filteredPostings = unfilteredPostings?.filter(posting => dateCompareUtil(posting.startDate, 'month'))
          setPostings(filteredPostings ?? null)
          break;
        case 'all':
          setPostings(unfilteredPostings);
          break;
        default:
          filteredPostings = unfilteredPostings?.filter(posting => dateCompareUtil(posting.startDate, 'week'))
          setPostings(filteredPostings ?? null)
          break;
      }
      console.log(filteredPostings)
  }, [filter, unfilteredPostings])

  const changeFilter = (e:React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setFilter(e.target.value)
    } else {
      setFilter('week')
    }
  }

  // need to refactor this function based on definition of what is an opportunity / event
  const isVolunteerOpportunity = (start: Date, end: Date): boolean => {
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
    <Box bg="background.light" pt="48px" minHeight="100vh">
      <Box maxW="1280px" mx="auto">
        <HStack justify="space-between" bg="#F4F4F4" pb="36px">
          <Text textStyle="display-small-semibold">Events</Text>
          <HStack>
            <Text>Showing: </Text>
            <Select
              width="194px"
              placeholder="This week"
              size="sm"
              bg="white"
              borderRadius="4px"
              onChange={changeFilter}
            >
              <option value="month">This month</option>
              <option value="all">All shifts</option>
            </Select>
          </HStack>
        </HStack>
        {events && events.length > 0 ? (
          events.map((posting) => (
            <Box key={posting.id} pt="36px">
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
        <Text textStyle="display-small-semibold" pb="36px">
          Volunteer Opportunities
        </Text>
        {volunteerOpportunities && volunteerOpportunities.length > 0 ? (
          volunteerOpportunities.map((posting) => (
            <Box key={posting.id} pb="36px">
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
          <EmptyPostingCard type="volunteer" />
        )}
      </Box>
    </Box>
  );
};

export default VolunteerPostingsPage;
