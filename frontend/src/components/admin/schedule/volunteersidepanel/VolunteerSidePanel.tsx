import React from "react";
import { VStack } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import VolunteerSkillsSection from "./VolunteerSkillsSection";
import VolunteerShiftsTable from "./VolunteerShiftsTable";
import VolunteerNameHeader from "./VolunteerNameHeader";
import ErrorModal from "../../../common/ErrorModal";

const PROFILE = gql`
  query VolunteerProfile($userId: ID!) {
    volunteerUserById(id: $userId) {
      firstName
      lastName
      skills {
        id
        name
      }
    }
    getShiftSignupsForUser(userId: $userId) {
      postingTitle
      shiftStartTime
      shiftEndTime
      note
      status
    }
  }
`;

type VolunteerSidePanelProps = {
  onVolunteerProfileClick: (
    isDisplayingVolunteer: boolean,
    userId: string,
  ) => void;
  volunteerId: string;
};

const VolunteerSidePanel: React.FC<VolunteerSidePanelProps> = ({
  onVolunteerProfileClick,
  volunteerId,
}: VolunteerSidePanelProps): React.ReactElement => {
  const {
    error: profileError,
    loading: profileLoading,
    data: {
      volunteerUserById: volunteerDetails,
      getShiftSignupsForUser: shiftDetails,
    } = {},
  } = useQuery(PROFILE, {
    variables: { userId: volunteerId },
    fetchPolicy: "cache-and-network",
  });

  return (
    <VStack
      w="full"
      h="full"
      spacing={0}
      borderLeft="2px"
      borderColor="background.dark"
      alignItems="flex-start"
    >
      {profileError && <ErrorModal />}

      <VolunteerNameHeader
        profileLoading={profileLoading}
        firstName={volunteerDetails?.firstName}
        lastName={volunteerDetails?.lastName}
        onVolunteerProfileClick={onVolunteerProfileClick}
      />

      {profileLoading ? (
        <VStack
          spacing="0px"
          w="full"
          h="full"
          px="32px"
          py="16px"
          alignItems="flex-start"
          borderTop="1px"
          borderLeft="1px"
          borderBottom="1px"
          borderColor="background.dark"
        />
      ) : (
        <>
          <VolunteerSkillsSection skills={volunteerDetails?.skills} />
          <VolunteerShiftsTable
            firstName={volunteerDetails?.firstName}
            shifts={shiftDetails}
          />
        </>
      )}
    </VStack>
  );
};

export default VolunteerSidePanel;
