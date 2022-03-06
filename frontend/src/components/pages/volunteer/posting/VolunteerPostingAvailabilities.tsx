import React from "react";
import { Spinner, Text } from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { Redirect, useParams } from "react-router-dom";
import VolunteerAvailabilityTable from "../../../volunteer/shifts/VolunteerAvailabilityTable";

const SHIFTS = gql`
  query VolunteerPostingAvailabilities_Shifts($postingId: String!) {
    shifts(postingId: $postingId) {
      id
      postingId
      startTime
      endTime
    }
  }
`;

const VolunteerPostingAvailabilities = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line no-console
  console.log(id);
  const { loading, data: { shifts } = {} } = useQuery(SHIFTS, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  // const postingShifts: TimeBlock[] = [
  //   {
  //     startTime: new Date(),
  //     endTime: new Date(Date.now() + 2.25 * 1000 * 60 * 60),
  //   },
  //   {
  //     startTime: new Date(Date.now() + 3 * 1000 * 60 * 60),
  //     endTime: new Date(Date.now() + 4 * 1000 * 60 * 60),
  //   },
  //   {
  //     startTime: new Date(
  //       new Date(Date.now() + 2 * 1000 * 60 * 60).setDate(
  //         new Date().getDate() + 1,
  //       ),
  //     ),
  //     endTime: new Date(
  //       new Date(Date.now() + 2.5 * 1000 * 60 * 60).setDate(
  //         new Date().getDate() + 1,
  //       ),
  //     ),
  //   },
  // ];

  if (loading) {
    return <Spinner />;
  }

  return !loading && !shifts ? (
    <Redirect to="/not-found" />
  ) : (
    <div>
      <Text textStyle="display-large">Volunteer Postings</Text>
      <VolunteerAvailabilityTable postingShifts={shifts} />
    </div>
  );
};

export default VolunteerPostingAvailabilities;
