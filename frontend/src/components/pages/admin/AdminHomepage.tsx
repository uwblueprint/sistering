import React, { useContext, useState } from "react";
import { Flex, Box, SimpleGrid } from "@chakra-ui/react";
import { generatePath, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import AuthContext from "../../../contexts/AuthContext";
import * as Routes from "../../../constants/Routes";

import Navbar from "../../common/Navbar";
import AdminHomepageHeader from "../../admin/AdminHomepageHeader";
import AdminPostingCard from "../../admin/AdminPostingCard";
import { AdminNavbarTabs, AdminPages } from "../../../constants/Tabs";
import { Role } from "../../../types/AuthTypes";
import { PostingResponseDTO } from "../../../types/api/PostingTypes";
import { isPast } from "../../../utils/DateTimeUtils";

type Posting = Omit<PostingResponseDTO, "employees" | "type">;

enum PostingStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  UNSCHEDULED = "UNSCHEDULED",
  PAST = "PAST",
}

const POSTINGS = gql`
  query AdminHomepage_postings {
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
      shifts {
        id
      }
      title
      description
      startDate
      endDate
      numVolunteers
      autoClosingDate
      status
    }
  }
`;

const AdminHomepage = (): React.ReactElement => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);
  const [postings, setPostings] = useState<Posting[] | null>(null);

  useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings);
    },
  });

  const navigateToAdminSchedule = (id: string) => {
    const route = generatePath(Routes.ADMIN_SCHEDULE_POSTING_PAGE, { id });
    history.push(route);
  };

  const getPostingStatus = (posting: Posting): PostingStatus => {
    if (posting.status === "DRAFT") {
      return PostingStatus.DRAFT;
    }
    if (isPast(posting.autoClosingDate)) {
      return PostingStatus.PAST;
    }
    if (posting.shifts.length === 0) {
      return PostingStatus.UNSCHEDULED;
    }
    return PostingStatus.SCHEDULED;
  };

  return (
    <Flex flexFlow="column" width="100%" height="100vh">
      <Navbar
        defaultIndex={Number(AdminPages.AdminSchedulePosting)}
        tabs={AdminNavbarTabs}
      />
      <AdminHomepageHeader
        isSuperAdmin={authenticatedUser?.role === Role.Admin}
      />
      <Box
        flex={1}
        backgroundColor="background.light"
        width="100%"
        px="100px"
        pt="32px"
      >
        <SimpleGrid columns={2} spacing={4}>
          {authenticatedUser &&
            postings?.map((posting) => (
              <Box key={posting.id} pb="24px">
                <AdminPostingCard
                  key={posting.id}
                  status={getPostingStatus(posting)}
                  role={authenticatedUser.role}
                  id={posting.id}
                  title={posting.title}
                  startDate={posting.startDate}
                  endDate={posting.endDate}
                  autoClosingDate={posting.autoClosingDate}
                  branchName={posting.branch.name}
                  numVolunteers={posting.numVolunteers}
                  navigateToAdminSchedule={() =>
                    navigateToAdminSchedule(posting.id)
                  }
                />
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default AdminHomepage;
