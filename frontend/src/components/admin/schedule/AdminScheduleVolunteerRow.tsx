import React from "react";
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
  onSignupCheckboxClick: (id: string, isChecked: boolean) => void;
  isReadOnly: boolean;
  onVolunteerProfileClick: (
    isDisplayingVolunteer: boolean,
    userId: string,
  ) => void;
};

const AdminScheduleVolunteerRow: React.FC<AdminScheduleVolunteerRowProps> = ({
  volunteerID,
  volunteerName,
  note,
  isConfirmed,
  isDisabled,
  onSignupCheckboxClick,
  isReadOnly,
  onVolunteerProfileClick,
}: AdminScheduleVolunteerRowProps): React.ReactElement => {
  return (
    <Box
      w="full"
      pl="32px"
      pr="20px"
      pb={note === "" ? "4px" : "12px"}
      pt="4px"
      bg={isConfirmed && !isReadOnly ? "purple.50" : "white"}
      borderBottom="1px"
      borderColor="background.dark"
    >
      <VStack alignItems="flex-start" spacing={0} w="full">
        <HStack alignItems="center" justifyContent="space-between" w="full">
          <HStack spacing={2}>
            {isReadOnly ? undefined : (
              <Checkbox
                isChecked={isConfirmed}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSignupCheckboxClick(volunteerID, e.target.checked)
                }
                alignItems="center"
                mb={0}
                isDisabled={isDisabled}
              />
            )}
            <Text textStyle="body-regular" fontSize="14px" fontWeight="600">
              {volunteerName}
            </Text>
          </HStack>
          <IconButton
            colorScheme="none"
            aria-label="Person Icon"
            icon={<Image src={PersonIcon} alt="Person Icon" h={4} />}
            onClick={() => {
              onVolunteerProfileClick(true, volunteerID);
            }}
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
