import React, { useState } from "react";
import {
  Text,
  Box,
  HStack,
  VStack,
  Checkbox,
  Image,
  IconButton,
} from "@chakra-ui/react";
import PersonIcon from "../../../assets/Person_Icon.svg";

type AdminScheduleVolunteerRowProps = {
  volunteerID: string;
  volunteerName: string;
  note: string;
  isConfirmed: boolean;
  isDisabled: boolean;
  updateSignupStatus: (id: string, isChecked: boolean) => void;
};

const AdminScheduleVolunteerRow: React.FC<AdminScheduleVolunteerRowProps> = ({
  volunteerID,
  volunteerName,
  note,
  isConfirmed,
  isDisabled,
  updateSignupStatus,
}: AdminScheduleVolunteerRowProps): React.ReactElement => {
  return (
    <Box
      w="full"
      pl="32px"
      pr="20px"
      pb={note === "" ? "4px" : "12px"}
      pt="4px"
      bg={isConfirmed ? "purple.50" : "white"}
      borderBottom="1px"
      borderColor="background.dark"
    >
      <VStack alignItems="flex-start" spacing={0} w="full">
        <HStack alignItems="center" justifyContent="space-between" w="full">
          <HStack spacing={2}>
            <Checkbox
              isChecked={isConfirmed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSignupStatus(volunteerID, e.target.checked)
              }
              alignItems="center"
              mb={0}
              isDisabled={isDisabled}
            />
            <Text textStyle="body-regular" fontSize="14px" fontWeight="600">
              {volunteerName}
            </Text>
          </HStack>
          <IconButton
            colorScheme="none"
            aria-label="Person Icon"
            icon={<Image src={PersonIcon} alt="Person Icon" h={4} />}
            // onClick to be changed later to open a panel that displays the volunteer's info
            onClick={() => console.log(volunteerID)}
          />
        </HStack>
        {note === "" ? null : (
          <Text
            textStyle="body-regular"
            fontSize="14px"
            color="text.gray"
            align="start"
            pl="24px"
            pr="48px"
          >
            Note: &quot;{note}&quot;
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default AdminScheduleVolunteerRow;
