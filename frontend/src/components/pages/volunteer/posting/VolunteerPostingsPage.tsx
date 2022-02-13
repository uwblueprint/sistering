import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Text, Box, HStack, Select,} from "@chakra-ui/react";
import PostingCard from "../../../volunteer/PostingCard";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";

// delete before merging to main
const postingArr = [
  {
    id: "1",
    skills: [
      { id: "1", name: "CPR" },
      { id: "2", name: "WHMIS" },
      { id: "3", name: "Photocopying" },
    ],
    branch: {
      id: "1",
      name: "branch name",
    },
    title: "Medical Reception Volunteer",
    startDate: new Date("December 17, 2021"),
    endDate: new Date("January 20, 2022"),
    autoClosingDate: new Date("Monday, November 30"),
    isSignedUp: false,
    description:
      "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
  },
  {
    id: "2",
    skills: [
      { id: "1", name: "CPR" },
      { id: "2", name: "WHMIS" },
      { id: "3", name: "Photocopying" },
    ],
    branch: {
      id: "1",
      name: "sample text",
    },
    title: "Medical Reception Volunteer",
    startDate: new Date("December 17, 2021"),
    endDate: new Date("January 20, 2022"),
    autoClosingDate: new Date("Monday, November 30"),
    isSignedUp: false,
    description:
      "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
  },
  {
    id: "3",
    skills: [
      { id: "1", name: "CPR" },
      { id: "2", name: "WHMIS" },
      { id: "3", name: "Photocopying" },
    ],
    branch: {
      id: "1",
      name: "sample text",
    },
    title: "Medical Reception Volunteer",
    startDate: new Date("December 17, 2021"),
    endDate: new Date("January 20, 2022"),
    autoClosingDate: new Date("Monday, November 30"),
    isSignedUp: false,
    description:
      "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
  },
];


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
        userId
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

const VolunteerPostingsPage = (): React.ReactElement => {
  const [postings, setPostings] = useState<PostingResponseDTO[] | null>(null);
  console.log(postings)
  useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => setPostings(data.postings),
  });


  // need to refactor this function based on definition of what is an opportunity / event
  const isVolunteerOpportunity = (start: Date, end: Date): boolean => {
    return end.getTime() - start.getTime() > 1000 * 60 * 60 * 24;
  };

  const volunteerOpportunities = postingArr?.filter((posting) =>
    isVolunteerOpportunity(posting.startDate, posting.endDate),
  );
  const events = postingArr?.filter(
    (posting) => !isVolunteerOpportunity(posting.startDate, posting.endDate),
  );

  return (
    <Box bg="background.light" pt="48px" minHeight="100vh">
      <Box maxW="1280px" mx="auto">
        <HStack justify="space-between" bg="#F4F4F4" pb="36px">
          <Text textStyle="display-small-semibold">
            Events
          </Text>
          <HStack>
            <Text>
              Showing:{" "}
            </Text>
            <Select
            width="194px"
              placeholder="This week"
              size="sm"
              bg="white"
              borderRadius="4px"
            >
              <option value="option2">Next week</option>
              <option value="option3">This month</option>
              <option value="option3">All shifts</option>
            </Select>
          </HStack>
        </HStack>
        {events?.map((posting) => (
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
              type="EVENT"
            />
          </Box>
        ))}
        <Text textStyle="display-small-semibold" pb="36px">
          Volunteer Opportunities
        </Text>
        {volunteerOpportunities?.map((posting) => (
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
                type="OPPORTUNITY"
              />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default VolunteerPostingsPage;
