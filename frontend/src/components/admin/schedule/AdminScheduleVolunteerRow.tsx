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
};

const AdminScheduleVolunteerRow: React.FC<AdminScheduleVolunteerRowProps> = ({
  volunteerID,
  volunteerName,
  note,
  isConfirmed,
}: AdminScheduleVolunteerRowProps): React.ReactElement => {
  const [checked, setChecked] = useState(isConfirmed);

  return (
    <Box
      w="400px"
      pl="32px"
      pr="20px"
      pb={note === "" ? "4px" : "12px"}
      pt="4px"
      bg={checked ? "purple.50" : "white"}
      border="1px"
      borderColor="background.dark"
    >
      <VStack alignItems="flex-start" spacing={0} w="full">
        <HStack alignItems="center" justifyContent="space-between" w="full">
          <Checkbox
            isChecked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setChecked(e.target.checked)
            }
            alignItems="center"
            mb={0}
            spacing={2}
          >
            <Text
              textStyle="body-regular"
              fontSize="14px"
              fontWeight="600"
              align="start"
            >
              {volunteerName}
            </Text>
          </Checkbox>
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
