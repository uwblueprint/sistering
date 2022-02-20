import React from "react";
import { Text } from "@chakra-ui/react";
import NoShiftsAvailableTableRow from "../../../volunteer/shifts/NoShiftsAvailableTableRow";
import VolunteerAvailabilityTableRow from "../../../volunteer/shifts/VolunteerAvailabilityTableRow";

const VolunteerPostingsPage = (): React.ReactElement => {
  return (
    <div>
      <Text textStyle="display-large">Volunteer Postings</Text>
      {/* Temp */}
      <NoShiftsAvailableTableRow />
      <VolunteerAvailabilityTableRow
        start={new Date()}
        end={new Date(Date.now() + 2 * 1000 * 60 * 60)}
      />
    </div>
  );
};

export default VolunteerPostingsPage;
