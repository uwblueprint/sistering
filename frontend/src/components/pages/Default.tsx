import React, { useContext, useState } from "react";
import { generatePath, Redirect, useHistory } from "react-router-dom";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import Logout from "../auth/Logout";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import { PostingResponseDTO } from "../../types/api/PostingTypes";
import PostingCard from "../volunteer/PostingCard";
import EditModal from "../admin/EditModal";

const POSTINGS = gql`
  query Default_postings {
    postings {
      id
      branch {
        id
        name
      }
      skills {
        id
        name
      }
      title
      description
      startDate
      endDate
      autoClosingDate
    }
  }
`;

type Posting = Omit<
  PostingResponseDTO,
  "shifts" | "employees" | "type" | "numVolunteers" | "status"
>;

const Default = (): React.ReactElement => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);
  const [postings, setPostings] = useState<Posting[] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings);
    },
  });

  if (authenticatedUser?.role === Role.Volunteer) {
    return <Redirect to={Routes.VOLUNTEER_POSTINGS_PAGE} />;
  }

  const navigateToDetails = (id: string) => {
    const route = generatePath(Routes.ADMIN_POSTING_DETAILS, { id });
    history.push(route);
  };

  const navigateToAdminSchedule = (id: string) => {
    const route = generatePath(Routes.ADMIN_SCHEDULE_POSTING_PAGE, { id });
    history.push(route);
  };
  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <Button onClick={onOpen}>Open Modal</Button>
      <EditModal
        title="heyo"
        isOpen={isOpen}
        content="this is the body. wow much text!"
        onClose={onClose}
        onEdit={() => alert("wow!")}
      />
      <Text textStyle="display-large">Welcome to Sistering</Text>
      <div className="btn-group" style={{ paddingRight: "10px" }}>
        <Logout />
        <Button
          onClick={() =>
            history.push(Routes.ADMIN_POSTING_CREATE_BASIC_INFO_PAGE)
          }
        >
          Create Posting
        </Button>
      </div>
      {postings?.map((posting) => (
        <Box key={posting.id} pb="24px">
          <PostingCard
            key={posting.id}
            id={posting.id}
            skills={posting.skills}
            title={posting.title}
            startDate={posting.startDate}
            endDate={posting.endDate}
            autoClosingDate={posting.autoClosingDate}
            description={posting.description}
            branchName={posting.branch.name}
            navigateToDetails={() => navigateToDetails(posting.id)}
            navigateToAdminSchedule={() => navigateToAdminSchedule(posting.id)}
          />
        </Box>
      ))}
    </div>
  );
};

export default Default;
