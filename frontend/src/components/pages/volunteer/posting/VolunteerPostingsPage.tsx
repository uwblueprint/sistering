import React, { useState } from "react";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Text, Box, HStack, Select, Divider } from "@chakra-ui/react";
import PostingCard from "../../../volunteer/PostingCard";
import { PostingResponseDTO} from "../../../../types/api/PostingTypes";

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
  // {
  //   id: "2",
  //   skills: [
  //     { id: "1", name: "CPR" },
  //     { id: "2", name: "WHMIS" },
  //     { id: "3", name: "Photocopying" },
  //   ],
  //   branch: {
  //     id: "1",
  //     name: "sample text",
  //   },
  //   title: "Medical Reception Volunteer",
  //   startDate: new Date("December 17, 2021"),
  //   endDate: new Date("January 20, 2022"),
  //   autoClosingDate: new Date("Monday, November 30"),
  //   isSignedUp: false,
  //   description:
  //     "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
  // },
  // {
  //   id: "3",
  //   skills: [
  //     { id: "1", name: "CPR" },
  //     { id: "2", name: "WHMIS" },
  //     { id: "3", name: "Photocopying" },
  //   ],
  //   branch: {
  //     id: "1",
  //     name: "sample text",
  //   },
  //   title: "Medical Reception Volunteer",
  //   startDate: new Date("December 17, 2021"),
  //   endDate: new Date("January 20, 2022"),
  //   autoClosingDate: new Date("Monday, November 30"),
  //   isSignedUp: false,
  //   description:
  //     "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis.",
  // },
];

const POSTINGS = gql`
  query VolunteerPostingsPage_postings {
    postings {
      id
      skills {
        id
        name
      }
      employees {
        userId
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

const postingArr = [{
  id: "1",
  skills: [{id: '1', name:"CPR"}, {id: '2', name: "WHMIS"}, {id: '3', name: "Photocopying"}], 
  title: "Medical Reception Volunteer",
  startDate: new Date('December 17, 2021'),
  endDate: new Date("Monday, January 20"),
  autoClosingDate: "Monday, November 30", 
  isSignedUp: false,
  description: "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis."
}, 
{
  id: '2',
  skills: [{id: '1', name:"CPR"}, {id: '2', name: "WHMIS"}, {id: '3', name: "Photocopying"}], 
  title: "Medical Reception Volunteer",
  startDate: new Date('December 17, 2021'),
  endDate: new Date("Monday, January 20"),
  autoClosingDate: "Monday, November 30", 
  isSignedUp: false,
  description: "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis."
}, 
{
  id: '3',
  skills: [{id: '1', name:"CPR"}, {id: '2', name: "WHMIS"}, {id: '3', name: "Photocopying"}], 
  title: "Medical Reception Volunteer",
  startDate: new Date('December 17, 2021'),
  endDate: new Date("Monday, January 20"),
  autoClosingDate: "Monday, November 30", 
  isSignedUp: false,
  description: "Volunteers will be responsible for updating the inventory monthly, updating the manuals and guidelines on an ongoing basis, uploading the COVID-19 screenings on a weekly basis."
}, 
]
const VolunteerPostingsPage = (): React.ReactElement => {
  const [postings, setPostings] = useState<PostingResponseDTO[] | null>(null);

  useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => setPostings(data.postings),
  });


  const isVolunteerOpportunity = (start: Date, end: Date): boolean => {
    return end.getTime() - start.getTime() > 1000 * 60 * 60 * 24;
  };
  const volunteerOpportunities = postingArr?.filter((posting) =>
    isVolunteerOpportunity(posting.startDate, posting.endDate),
  );
  const events = postingArr?.filter(
    (posting) => !isVolunteerOpportunity(posting.startDate, posting.endDate),
  );

  // const {loading, error, postings} = useQuery(GET_POSTINGS)
  return (
    <Box bg="#D8AEFF" pt={8} minHeight="100vh">
      <Box maxW="1280px" mx="auto">
        <HStack mt={8} mb={6} mx={1} justify="space-between" bg="#F4F4F4">
          <Text fontSize="xl" fontWeight="600">
            Events
          </Text>
          <HStack>
            <Text fontSize="sm" fontWeight="400">
              Showing:{" "}
            </Text>
            <Select
              placeholder="This week"
              size="xs"
              bg="white"
              borderColor="white"
              focusBorderColor="white"
            >
              <option value="option2">Next week</option>
              <option value="option3">This month</option>
              <option value="option3">All shifts</option>
            </Select>
          </HStack>
        </HStack>
        {events?.map((posting) => (
          <>
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
            <div style={{ padding: "2rem" }} />
          </>
        ))}
        <Text fontSize="xl" fontWeight="600">
          Volunteer Opportunities
        </Text>
        {volunteerOpportunities?.map((posting) => (
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
        ))}
      </Box>
    </Box>
  );
};

export default VolunteerPostingsPage;
