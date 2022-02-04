import React from 'react';
import { TimeIcon, CalendarIcon} from '@chakra-ui/icons';
import {Text, Box, VStack, HStack, Badge, Divider, Button, ButtonGroup} from "@chakra-ui/react";


type SkillResponseDTO = {
  id: string,
  name: string,
}

type PostingCardProps = {
  id: string,
  title: string, 
  skills: SkillResponseDTO[],
  description: string, 
  startDate: Date, 
  endDate: Date, 
  autoClosingDate: string, 
  isSignedUp: boolean;
}


const params = {title: "Medical Reception Volunteer"}
const PostingCard = ({id, title, skills, description, startDate, endDate, autoClosingDate, isSignedUp} :PostingCardProps) => {


  return (
    <Box m={1} mb={5} bg='white' borderRadius={2} borderColor=" #E7E7E7">
      <VStack p={6} align="flex-start" fontSize="xs" spacing='1.5'> 
        {/* how to tell type of event? */}
        <Badge px={2} borderRadius="100px" variant="subtle" bg="#DFE9B6" color="#949F6A" fontSize='12' fontWeight={400} textTransform="inherit">Placeholder text</Badge>
        <Text textStyle="heading" fontSize='lg' lineHeight="lg">{title}</Text>
        <HStack spacing={4}>
          {/* how to tell it is a single or reoccuring event  */}
          <Text fontSize='12'><TimeIcon w={4} pr={1}/>See posting details</Text>
          <Text fontSize='12'><CalendarIcon w={4} pr={1}/>{`${startDate.toLocaleDateString('en-US', { weekday: 'long', month:'long', day: '2-digit'})} - ${endDate.toLocaleDateString('en-US', { weekday: 'long', month:'long', day: '2-digit'})}`}</Text>
        </HStack>
        <Text lineHeight="1.1rem">{description}</Text>
        <HStack>
          <Text>Skills: </Text>
          {skills.map(skill => (
            <Badge color="#868686" fontSize='0.8em' fontWeight={400} borderRadius="0.5rem" variant="outline" lineHeight="200%" key={skill.id}>{skill.name}</Badge>
          ))}
        </HStack>
        <Divider mb={1}/>
        <HStack justifyContent="space-between" w='100%'>
          <Text color='gray.500' fontSize='12'>Deadline: {autoClosingDate}</Text>
          <ButtonGroup spacing='4' size="xs">
            <Button variant="ghost" color="violet" borderColor="violet">View Details</Button>
            <Button variant="solid" bg="violet" color="white" >{isSignedUp ? 'Edit availability' : 'Submit Availability'}</Button>
          </ButtonGroup>
        </HStack>
        </VStack>
    </Box>
  )
}

export default PostingCard;