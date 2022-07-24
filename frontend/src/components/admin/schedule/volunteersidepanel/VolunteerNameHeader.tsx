import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

type VolunteerNameHeaderProps = {
  profileLoading: boolean;
  firstName: string;
  lastName: string;
  onVolunteerProfileClick: (
    isDisplayingVolunteer: boolean,
    userId: string,
  ) => void;
};

const VolunteerNameHeader: React.FC<VolunteerNameHeaderProps> = ({
  profileLoading,
  firstName,
  lastName,
  onVolunteerProfileClick,
}: VolunteerNameHeaderProps): React.ReactElement => {
  return (
    <Box
      w="full"
      px="32px"
      py="17px"
      borderLeft="1px"
      borderBottom="1px"
      borderColor="background.dark"
    >
      <Box position="relative">
        <ChevronLeftIcon
          position="absolute"
          mr={2}
          w={6}
          h={6}
          color="violet"
          cursor="pointer"
          onClick={() => onVolunteerProfileClick(false, "")}
        />
      </Box>
      <Text textStyle="heading" ml={8}>
        {profileLoading ? "Loading..." : `${firstName} ${lastName}`}
      </Text>
    </Box>
  );
};

export default VolunteerNameHeader;
