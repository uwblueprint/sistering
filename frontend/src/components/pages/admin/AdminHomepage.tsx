import React, { useContext, useEffect, useState } from "react";
import { Flex, Box, SimpleGrid } from "@chakra-ui/react";
import { generatePath, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import AuthContext from "../../../contexts/AuthContext";
import * as Routes from "../../../constants/Routes";

import Navbar from "../../common/Navbar";
import AdminHomepageHeader from "../../admin/AdminHomepageHeader";
import AdminPostingCard from "../../admin/AdminPostingCard";
import Loading from "../../common/Loading";
import ErrorModal from "../../common/ErrorModal";
import { AdminNavbarTabs, AdminPages } from "../../../constants/Tabs";
import { Role } from "../../../types/AuthTypes";
import { PostingResponseDTO } from "../../../types/api/PostingTypes";
import getPostingFilterStatus from "../../../utils/TypeUtils";
import { PostingFilterStatus } from "../../../types/PostingTypes";

type SimplePostingResponseDTO = Omit<PostingResponseDTO, "employees" | "type">;

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
  const [postings, setPostings] = useState<SimplePostingResponseDTO[] | null>(
    null,
  );
  const [postingsByStatus, setPostingsByStatus] = useState<
    SimplePostingResponseDTO[][]
  >([
    [], // unscheduled => 0
    [], // scheduled => 1
    [], // past => 2
    [], // drafts => 3
  ]);
  const [postingStatusIndex, setPostingStatusIndex] = useState<number>(0); // refer to above for index

  const { loading, error } = useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings);
    },
  });

  const navigateToAdminSchedule = (id: string) => {
    const route = generatePath(Routes.ADMIN_SCHEDULE_POSTING_PAGE, { id });
    history.push(route);
  };

  // update postingsByStatus 2d array
  useEffect(() => {
    if (postings) {
      const sortedPostings: SimplePostingResponseDTO[][] = [[], [], [], []];
      postings.forEach((posting) => {
        const postingStatus = getPostingFilterStatus(
          posting.status,
          new Date(posting.endDate),
          posting.shifts,
        );
        if (postingStatus === PostingFilterStatus.UNSCHEDULED) {
          sortedPostings[0].push(posting);
        } else if (postingStatus === PostingFilterStatus.SCHEDULED) {
          sortedPostings[1].push(posting);
        } else if (postingStatus === PostingFilterStatus.PAST) {
          sortedPostings[2].push(posting);
        } else {
          sortedPostings[3].push(posting);
        }
      });
      setPostingsByStatus(sortedPostings);
    }
  }, [postings]);

  return (
    <>
      {loading && <Loading />}
      {error && <ErrorModal />}
      <Flex flexFlow="column" width="100%" height="100vh">
        <Navbar
          defaultIndex={Number(AdminPages.AdminSchedulePosting)}
          tabs={AdminNavbarTabs}
        />
        <AdminHomepageHeader
          isSuperAdmin={authenticatedUser?.role === Role.Admin}
          selectStatusTab={setPostingStatusIndex}
          postingStatusNums={postingsByStatus.map(
            (postingsArr) => postingsArr.length,
          )}
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
              postingsByStatus[postingStatusIndex].map((posting) => (
                <Box key={posting.id} pb="24px">
                  <AdminPostingCard
                    key={posting.id}
                    status={getPostingFilterStatus(
                      posting.status,
                      new Date(posting.endDate),
                      posting.shifts,
                    )}
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
    </>
  );
};

export default AdminHomepage;
