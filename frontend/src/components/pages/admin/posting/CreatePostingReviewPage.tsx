import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Container,
  HStack,
  Text,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import CreatePostingReview from "../../../admin/posting/CreatePostingReview";
import SideNavBar from "../../../common/SideNavbar";
import { HOME_PAGE } from "../../../../constants/Routes";
import PostingContext from "../../../../contexts/admin/PostingContext";

const CREATE_POSTING = gql`
  mutation CreatePostingReviewPage_CreatePosting($posting: PostingRequestDTO!) {
    createPosting(posting: $posting) {
      id
      title
    }
  }
`;

const CREATE_SHIFTS = gql`
  mutation CreatePostingReviewPage_CreateShifts($shifts: ShiftBulkRequestDTO!) {
    createShifts(shifts: $shifts) {
      id
    }
  }
`;

const CreatePostingReviewPage = (): React.ReactElement => {
  const {
    status,
    times,
    recurrenceInterval,
    ...postingToCreateFromContext
  } = useContext(PostingContext);
  const [
    createPosting,
    { loading: createPostingLoading, error: createPostingError },
  ] = useMutation(CREATE_POSTING);
  const [
    createShifts,
    { loading: createShiftsLoading, error: createShiftsError },
  ] = useMutation(CREATE_SHIFTS);
  const [isDraftClicked, setIsDraftClicked] = useBoolean();

  const { branch, skills, employees, ...rest } = postingToCreateFromContext;
  const postingToCreate = {
    ...rest,
    branchId: branch.id,
    skills: skills.map((skill) => skill.id),
    employees: employees.map((employee) => employee.id),
  };

  const history = useHistory();
  const navigateToHome = () => history.push(HOME_PAGE);

  const error = createPostingError || createShiftsError;
  /* eslint-disable-next-line no-alert */
  if (error) window.alert(error);

  return (
    <Container maxW="container.xl" p={0}>
      <HStack alignItems="flex-start" spacing={0}>
        <VStack alignItems="flex-start" spacing="90px">
          <Text textStyle="display-medium" pt={10}>
            Create New Posting
          </Text>
          <SideNavBar
            activeStep={2}
            labels={["Basic Information", "Time Slots", "Review and Post"]}
          />
        </VStack>
        <VStack alignItems="flex-end">
          <CreatePostingReview />
          <HStack spacing="16px">
            <Button
              variant="outline"
              isLoading={
                (createPostingLoading || createShiftsLoading) && isDraftClicked
              }
              onClick={async () => {
                setIsDraftClicked.on();
                const createPostingResponse = await createPosting({
                  variables: {
                    posting: { ...postingToCreate, status: "DRAFT" },
                  },
                });
                const postingId = createPostingResponse.data.createPosting.id;
                await createShifts({
                  variables: {
                    shifts: {
                      postingId,
                      times,
                      endDate: postingToCreate.endDate,
                      recurrenceInterval,
                    },
                  },
                });
                navigateToHome();
              }}
            >
              Save as Draft
            </Button>
            <Button
              isLoading={
                (createPostingLoading || createShiftsLoading) && !isDraftClicked
              }
              onClick={async () => {
                setIsDraftClicked.off();
                const createPostingResponse = await createPosting({
                  variables: {
                    posting: { ...postingToCreate, status: "PUBLISHED" },
                  },
                });
                const postingId = createPostingResponse.data.createPosting.id;
                await createShifts({
                  variables: {
                    shifts: {
                      postingId,
                      times,
                      endDate: postingToCreate.endDate,
                      recurrenceInterval,
                    },
                  },
                });
                navigateToHome();
              }}
            >
              Post
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Container>
  );
};

export default CreatePostingReviewPage;
