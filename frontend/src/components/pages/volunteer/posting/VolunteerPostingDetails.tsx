import React, { useState } from 'react';
import { Text } from '@chakra-ui/react';

import { gql, useQuery } from "@apollo/client";
import { PostingResponseDTO } from '../../../../types/api/PostingTypes';

type VolunteerPostingDetailsProps = { id: string };

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

const VolunteerPostingDetails = ({ id }: VolunteerPostingDetailsProps): React.ReactElement => {
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
    <div>
      <Text textStyle="display-large">Volunteer Posting Details</Text>
      <Text>{postingDetails?.branch.name}</Text>
    </div>
  );
}

export default VolunteerPostingDetails;