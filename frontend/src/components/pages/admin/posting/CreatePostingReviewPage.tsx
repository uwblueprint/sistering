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
  mutation CreatePosting($posting: PostingRequestDTO!) {
    createPosting(posting: $posting) {
      id
      title
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
  const [createPosting, { loading, error }] = useMutation(CREATE_POSTING);
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

  // eslint-disable-next-line no-alert
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
              isLoading={loading && isDraftClicked}
              onClick={() => {
                setIsDraftClicked.on();
                createPosting({
                  variables: {
                    posting: { ...postingToCreate, status: "DRAFT" },
                  },
                });
                navigateToHome();
              }}
            >
              Save as Draft
            </Button>
            <Button
              isLoading={loading && !isDraftClicked}
              onClick={() => {
                setIsDraftClicked.off();
                createPosting({
                  variables: {
                    posting: { ...postingToCreate, status: "PUBLISHED" },
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
