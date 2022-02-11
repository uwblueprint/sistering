import React, { useState } from 'react';
import { Text, VStack, HStack, Box, Tag, Container, Divider, Button } from '@chakra-ui/react';

import { gql, useQuery } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { CalendarIcon, TimeIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { PostingResponseDTO } from '../../../../types/api/PostingTypes';
import PocCard from '../../../common/PocCard';
import colors from '../../../../theme/colors';



// Description is the markdown description

const POSTING = gql`
  query Posting($id: ID!) {
    posting(id: $id){
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
      }
      autoClosingDate
    }
  }
`;

const formatDateString = (dateStringInput: Date) => {
  const date = new Date(dateStringInput);
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

const VolunteerPostingDetails = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [postingDetails, setPostingDetails] = useState<PostingResponseDTO | null>(null);
  useQuery(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostingDetails(data.posting);
    },
    onError: (error) => {
      console.error(error.message);
    }
  });
  return (
    <Box bg={colors.background.light} py={7} px={10} minH="100vh">
      <VStack>
        <Container pt={0} pb={4} px={0} maxW="container.xl">
          <HStack justifyContent="space-between">
            <Button leftIcon={<ChevronLeftIcon />} variant="link">Back to volunteer postings</Button>
            <Button>Submit availability</Button>
          </HStack>
        </Container>

        <Container bg={colors.background.white} maxW="container.xl" centerContent borderRadius={10}>
          <VStack w="full">
            {postingDetails ? (<Box p={6} w="full" >
              < VStack alignItems="start" w="full">
                <VStack alignItems="start" marginBottom={4} w="full">
                  <HStack justifyContent="space-between" w="full">
                    <Tag>{postingDetails.branch.name}</Tag>
                    <Text textStyle="caption" color={colors.text.gray}>Deadline: {formatDateString(postingDetails.autoClosingDate)}</Text>
                  </HStack>
                  <Text textStyle="display-large">{postingDetails.title}</Text>
                  <HStack>
                    <CalendarIcon />
                    <Text textStyle="caption">{formatDateString(postingDetails.startDate)} - {formatDateString(postingDetails.endDate)}</Text>
                  </HStack>
                  <HStack>
                    <TimeIcon />
                    <Text textStyle="caption">See posting details</Text>
                  </HStack>
                </VStack>
                <Divider />
                <HStack w="100%" pt={4}>
                  <Text textStyle="caption">Skills:</Text>
                  {postingDetails.skills.map((skill) => <Tag key={skill.id} variant="outline">{skill.name}</Tag>)}
                </HStack>
                <Text textStyle="body-regular" py={4}>{postingDetails.description}</Text>
                <Text textStyle="body-regular">Point(s) of contact:</Text>
                <HStack pb={4}>
                  {/* {postingDetails.employees.map((employee) => <PocCard />)} */}
                  <PocCard name="John Doe"
                    title="hard code"
                    email="hard code"
                    phoneNumber="hard code"
                    key={1} />
                  <PocCard name="John Doe"
                    title="hard code"
                    email="hard code"
                    phoneNumber="hard code"
                    key={1} />
                </HStack>
                <Divider />
                <HStack justifyContent="space-between" pt={4} w="full">
                  <Text textStyle="caption" color={colors.text.gray}>Deadline: {formatDateString(postingDetails.autoClosingDate)}</Text>
                  <Button>Submit availability</Button>
                </HStack>
              </VStack >
            </Box >) : null}
          </VStack>
        </Container>

      </VStack>
    </Box>



  );
}

export default VolunteerPostingDetails;

