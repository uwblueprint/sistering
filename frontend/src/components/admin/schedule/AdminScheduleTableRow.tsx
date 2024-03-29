import { Button, Td, Text, Tr, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { getElapsedHours, getTime } from "../../../utils/DateTimeUtils";
import RemoveVolunteerModal from "../RemoveVolunteerModal";

type AdminScheduleTableRowProps = {
  volunteer?: { name: string; userId: string };
  postingStart?: Date;
  postingEnd?: Date;
  numVolunteers?: number;
  note?: string;
  shiftId: string;
  removeSignup: (shiftId: string, userId: string) => void;
};

const AdminScheduleTableRow = ({
  volunteer,
  postingStart,
  postingEnd,
  numVolunteers,
  note,
  shiftId,
  removeSignup,
}: AdminScheduleTableRowProps): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const elapsedHours =
    postingStart && postingEnd ? getElapsedHours(postingStart, postingEnd) : 0;

  // No shifts available
  if (postingStart && postingEnd) {
    return (
      <>
        {volunteer && numVolunteers && note && (
          <RemoveVolunteerModal
            name={volunteer.name}
            isOpen={isOpen}
            shiftId={shiftId}
            userId={volunteer.userId}
            numVolunteers={numVolunteers}
            status="CANCELED"
            note={note}
            onClose={onClose}
            removeSignup={removeSignup}
          />
        )}
        <Tr h="74px" bg="white">
          <Td>
            <Text>
              {getTime(postingStart)} - {getTime(postingEnd)} ({elapsedHours}{" "}
              {elapsedHours > 1 ? "hrs" : "hr"})
            </Text>
          </Td>
          <Td>
            {!volunteer ? (
              <Text color="text.gray">No volunteers</Text>
            ) : (
              <Text>{volunteer.name}</Text>
            )}
          </Td>
          <Td textAlign="right">
            {volunteer && (
              <Button
                color="text.critical"
                variant="none"
                size="sm"
                onClick={onOpen}
              >
                Remove
              </Button>
            )}
          </Td>
        </Tr>
      </>
    );
  }
  return (
    <Tr h="74px" bg="white">
      <Td colSpan={3}>
        <Text color="text.gray">No shifts available</Text>
      </Td>
    </Tr>
  );
};

export default AdminScheduleTableRow;
