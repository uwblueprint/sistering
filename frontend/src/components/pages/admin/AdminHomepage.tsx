import React, { useContext, useEffect, useState } from "react";
import { Flex, Box, SimpleGrid, useToast } from "@chakra-ui/react";
import { generatePath, useHistory } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import AuthContext from "../../../contexts/AuthContext";
import PostingContextDispatcherContext from "../../../contexts/admin/PostingContextDispatcherContext";
import * as Routes from "../../../constants/Routes";

import Navbar from "../../common/Navbar";
import AdminHomepageHeader from "../../admin/AdminHomepageHeader";
import AdminPostingCard from "../../admin/AdminPostingCard";
import Loading from "../../common/Loading";
import ErrorModal from "../../common/ErrorModal";
import {
  AdminNavbarTabs,
  AdminPages,
  EmployeeNavbarTabs,
} from "../../../constants/Tabs";
import { Role } from "../../../types/AuthTypes";
import { PostingResponseDTO } from "../../../types/api/PostingTypes";
import { getPostingFilterStatus } from "../../../utils/TypeUtils";
import { PostingFilterStatus } from "../../../types/PostingTypes";
import {
  BranchQueryResponse,
  BranchResponseDTO,
} from "../../../types/api/BranchTypes";

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
      isScheduled
    }
  }
`;

const BRANCHES = gql`
  query AdminHomepageHeader_Branches {
    branches {
      id
      name
    }
  }
`;

const DUPLICATE_POSTING = gql`
  mutation AdminHomepage_DuplicatePosting($postingId: ID!) {
    duplicatePosting(id: $postingId)
  }
`;

const DELETE_POSTING = gql`
  mutation AdminHomepage_DeletePosting($postingId: ID!) {
    deletePosting(id: $postingId)
  }
`;

const filterAdminPosting = (
  postings: SimplePostingResponseDTO[],
  searchFilter: string,
  branchFilter: BranchResponseDTO | undefined,
): SimplePostingResponseDTO[] => {
  return postings.filter(
    (posting) =>
      posting.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
      (branchFilter === undefined || branchFilter.id === posting.branch.id),
  );
};

const AdminHomepage = (): React.ReactElement => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);
  const [isSuperAdmin] = useState(authenticatedUser?.role === Role.Admin);
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
  const [postingStatusIndex, setPostingStatusIndex] = useState<number>(
    isSuperAdmin ? 0 : 1,
  ); // refer to above for index
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [branches, setBranches] = useState<BranchResponseDTO[]>([]);
  const [branchFilter, setBranchFilter] = useState<
    BranchResponseDTO | undefined
  >(undefined);

  const { loading, error } = useQuery(POSTINGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPostings(data.postings);
    },
  });

  const toast = useToast();

  const navigateToAdminSchedule = (id: string) => {
    const route = generatePath(Routes.ADMIN_SCHEDULE_POSTING_PAGE, { id });
    history.push(route);
  };

  const navigateToEditPosting = (id: string) => {
    dispatchPostingUpdate({ type: "ADMIN_POSTING_RESET" });
    const route = generatePath(Routes.ADMIN_EDIT_POSTING_PAGE, { id });
    history.push(route);
  };

  const navigateToPostingDetails = (id: string) => {
    const route = generatePath(Routes.ADMIN_POSTING_DETAILS, { id });
    history.push(route);
  };

  useQuery<BranchQueryResponse>(BRANCHES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setBranches(data.branches);
    },
  });

  const [duplicatePosting] = useMutation(DUPLICATE_POSTING, {
    refetchQueries: () => [
      {
        query: POSTINGS,
      },
    ],
    awaitRefetchQueries: true,
  });

  const [deletePosting] = useMutation(DELETE_POSTING, {
    refetchQueries: () => [
      {
        query: POSTINGS,
      },
    ],
    awaitRefetchQueries: true,
  });

  const duplicatePostingById = async (postingId: string) => {
    try {
      await duplicatePosting({
        variables: {
          postingId,
        },
      });
    } catch (err: unknown) {
      toast({
        title: "Cannot duplicate posting",
        description: `${err}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const deletePostingById = async (postingId: string) => {
    try {
      await deletePosting({
        variables: {
          postingId,
        },
      });
    } catch (err: unknown) {
      toast({
        title: "Cannot delete posting",
        description: `${err}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // update postingsByStatus 2d array
  useEffect(() => {
    if (postings) {
      const sortedPostings: SimplePostingResponseDTO[][] = [[], [], [], []];
      postings.forEach((posting) => {
        const postingStatus = getPostingFilterStatus(
          posting.status,
          new Date(posting.endDate),
          posting.isScheduled,
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
      {error && <ErrorModal />}
      <Flex flexFlow="column" width="100%" minH="100vh">
        <Navbar
          defaultIndex={Number(AdminPages.AdminSchedulePosting)}
          tabs={isSuperAdmin ? AdminNavbarTabs : EmployeeNavbarTabs}
        />
        <AdminHomepageHeader
          isSuperAdmin={isSuperAdmin}
          selectStatusTab={setPostingStatusIndex}
          postingStatusNums={postingsByStatus.map(
            (postingsArr) => postingsArr.length,
          )}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          branches={branches}
          setBranchFilter={setBranchFilter}
        />
        <Box
          flex={1}
          backgroundColor="background.light"
          width="100%"
          px="100px"
          pt="32px"
        >
          {loading ? (
            <Loading />
          ) : (
            <SimpleGrid columns={2} spacing={4}>
              {authenticatedUser &&
                filterAdminPosting(
                  postingsByStatus[postingStatusIndex],
                  searchFilter,
                  branchFilter,
                ).map((posting) => (
                  <Box key={posting.id} pb="24px">
                    <AdminPostingCard
                      key={posting.id}
                      status={getPostingFilterStatus(
                        posting.status,
                        new Date(posting.endDate),
                        posting.isScheduled,
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
                      navigateToEditPosting={() =>
                        navigateToEditPosting(posting.id)
                      }
                      navigateToPostingDetails={() =>
                        navigateToPostingDetails(posting.id)
                      }
                      onDuplicate={() => duplicatePostingById(posting.id)}
                      onDelete={() => deletePostingById(posting.id)}
                    />
                  </Box>
                ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default AdminHomepage;
