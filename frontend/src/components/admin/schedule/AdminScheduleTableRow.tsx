import { Button, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";
import { ShiftSignupStatus } from "../../../types/api/SignupTypes";
import { getElapsedHours, getTime } from "../../../utils/DateTimeUtils";
import RemoveVolunteerModal from "../RemoveVolunteerModal";

type AdminScheduleTableRowProps = {
  volunteer?: { name: string; userId: string };
  postingStart?: Date;
  postingEnd?: Date;
  status?: ShiftSignupStatus;
  shiftId: string;
};

const AdminScheduleTableRow = ({
  volunteer,
  postingStart,
  postingEnd,
  status,
  shiftId,
}: AdminScheduleTableRowProps): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const elapsedHours =
    postingStart && postingEnd ? getElapsedHours(postingStart, postingEnd) : 0;

  // No shifts available
  if (postingStart && postingEnd) {
    return (
      <>
        {volunteer && status && (
          <RemoveVolunteerModal
            name={volunteer.name}
            isOpen={isModalOpen}
            shiftId={shiftId}
            userId={volunteer.userId}
            status={status}
            onClose={() => setIsModalOpen(false)}
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
                onClick={() => setIsModalOpen(true)}
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
