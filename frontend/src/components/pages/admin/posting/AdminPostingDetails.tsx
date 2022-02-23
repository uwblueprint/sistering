import React, { useState } from "react";
import {
    Text,
    VStack,
    HStack,
    Box,
    Container,
    Divider,
    Button,
    Flex,
} from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { PostingResponseDTO } from "../../../../types/api/PostingTypes";
import { formatDateString } from "../../../../utils/DateUtils";
import PostingDetails from "../../../common/PostingDetails";

const POSTING = gql`
  query Posting($id: ID!) {
    posting(id: $id) {
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

const AdminPostingDetails = (): React.ReactElement => {
    const { id } = useParams<{ id: string }>();
    const [
        postingDetails,
        setPostingDetails,
    ] = useState<PostingResponseDTO | null>(null);
    useQuery(POSTING, {
        variables: { id },
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            setPostingDetails(data.posting);
        },
    });
    return (
        <Box bg="background.light" py={7} px={10} minH="100vh">
            <VStack>
                <Container pt={3} pb={6} px={0} maxW="container.xl">
                    <Flex justifyContent="flex-start">
                        <Button leftIcon={<ChevronLeftIcon />} variant="link">
                            Back to editing
                        </Button>
                    </Flex>
                </Container>

                <Container
                    bg="background.white"
                    maxW="container.xl"
                    centerContent
                    borderRadius={10}
                >
                    {postingDetails ? (
                        <Box p={6} w="full">
                            <PostingDetails postingDetails={postingDetails} />
                        </Box>
                    ) : null}
                </Container>
            </VStack>
        </Box>
    );
};

export default AdminPostingDetails;
