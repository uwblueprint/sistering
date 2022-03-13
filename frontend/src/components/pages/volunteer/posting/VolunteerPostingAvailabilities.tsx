import React from "react";
import { Spinner, Text } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";
import { ShiftResponseDTO } from "../../../../types/api/ShiftTypes";

// TODO: A filter should be added to the backend, currently, no filter is supported
const SHIFTS = gql`
  query VolunteerPostingAvailabilities_Shifts {
    shifts {
      id
      postingId
      startTime
      endTime
    }
  }
`;

// TODO: Get posting for posting start and end time

const VolunteerPostingAvailabilities = (): React.ReactElement => {
  // posting id
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line no-console
  console.log(id);
  const { loading, data: { shifts } = {} } = useQuery(SHIFTS, {
    fetchPolicy: "cache-and-network",
  });
  console.log(shifts);

  // Sample data
  const postingShifts: ShiftResponseDTO[] = [
    {
      id: "1",
      postingId: "1",
      startTime: new Date(),
      endTime: new Date(Date.now() + 2.25 * 1000 * 60 * 60),
    },
    {
      id: "1",
      postingId: "1",
      startTime: new Date(Date.now() + 3 * 1000 * 60 * 60),
      endTime: new Date(Date.now() + 4 * 1000 * 60 * 60),
    },
    {
      id: "1",
      postingId: "1",
      startTime: new Date(
        new Date(Date.now() + 2 * 1000 * 60 * 60).setDate(
          new Date().getDate() + 1,
        ),
      ),
      endTime: new Date(
        new Date(Date.now() + 2.5 * 1000 * 60 * 60).setDate(
          new Date().getDate() + 1,
        ),
      ),
    },
  ];

  const postingStartDate = new Date(
    new Date().setDate(new Date().getDate() - 14),
  );

  const postingEndDate = new Date(
    new Date().setDate(new Date().getDate() + 14),
  );
  // End of sample data

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Text textStyle="display-large">Volunteer Postings</Text>
      <VolunteerAvailabilityTable
        postingShifts={postingShifts}
        postingStartDate={postingStartDate}
        postingEndDate={postingEndDate}
      />
    </div>
  );
  //   return !loading && !shifts ? (
  //     <Redirect to="/not-found" />
  //   ) : (
  //     <div>
  //       <Text textStyle="display-large">Volunteer Postings</Text>
  //       <VolunteerAvailabilityTable postingShifts={postingShifts} />
  //     </div>
  //   );
};

export default VolunteerPostingAvailabilities;
