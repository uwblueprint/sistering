import React from 'react';
import { TimeIcon, CalendarIcon} from '@chakra-ui/icons';
import {Text, Box, VStack, HStack, Badge, Divider, Button, ButtonGroup, Tag} from "@chakra-ui/react";
import {PostingCardProps } from "../../../../types/PostingTypes";

const PostingCard = ({id, title, skills, description, startDate, endDate, autoClosingDate, branchName, type} :PostingCardProps) => {

  return (
    <Box m={1} mb={5} bg='white' borderRadius={2} borderColor=" #E7E7E7">
      <VStack p={6} align="flex-start" fontSize="xs" spacing='1.5'> 
        <Tag px={2} borderRadius="100px" variant="subtle" bg="green.light" color="green.dark" fontSize='12' fontWeight={400} textTransform="inherit">{branchName}</Tag>
        <Text textStyle="heading" fontSize='lg' lineHeight="lg">{title}</Text>
        <HStack spacing={4}>
          {/* toAdd: conditionally displaying time for event listings */}
          <Text fontSize='12'><TimeIcon w={4} pr={1}/>See Posting Details</Text>
          <Text fontSize='12'><CalendarIcon w={4} pr={1}/>{`${startDate.toLocaleDateString('en-US', { weekday: 'long', month:'long', day: '2-digit'})} - ${endDate.toLocaleDateString('en-US', { weekday: 'long', month:'long', day: '2-digit'})}`}</Text>
        </HStack>
        <Text lineHeight="1.1rem">{description}</Text>
        <HStack>
          <Text>Skills: </Text>
          {skills.map(skill => (
            <Badge color="gray" fontSize='0.8em' fontWeight={400} borderRadius="0.5rem" variant="outline" lineHeight="200%" key={skill.id}>{skill.name}</Badge>
          ))}
        </HStack>
        <Divider mb={1}/>
        <HStack justifyContent="space-between" w='100%'>
          <Text color='gray' fontSize='12'>Deadline: {autoClosingDate.toLocaleDateString('en-US', { weekday: 'long', month:'long', day: '2-digit'})}</Text>
          <ButtonGroup spacing='4' size="xs">
            <Button variant="ghost" color="violet" borderColor="violet">View Details</Button>
            <Button variant="solid" bg="violet" color="white" >Submit Availability</Button>
          </ButtonGroup>
        </HStack>
        </VStack>
    </Box>
  )
}

export default PostingCard;