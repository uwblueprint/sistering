import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Box, HStack, useBoolean, VStack } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import PostingFormReview from "../../../admin/posting/PostingFormReview";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";
import ErrorModal from "../../../common/ErrorModal";

import { HOME_PAGE } from "../../../../constants/Routes";
import PostingContext from "../../../../contexts/admin/PostingContext";

const CREATE_POSTING = gql`
  mutation CreatePostingReviewPage_CreatePosting(
    $posting: PostingWithShiftsRequestDTO!
  ) {
    createPosting(posting: $posting) {
      id
    }
  }
`;

type PostingFormPageProps = {
  navigateBack: () => void;
  isEdit?: boolean;
  steps: string[];
};

// TODO: we need to just make this a posting review page, with 2 modes
const PostingFormReviewPage = ({
  navigateBack,
  isEdit = false,
  steps,
}: PostingFormPageProps): React.ReactElement => {
  const { branch, skills, employees, ...rest } = useContext(PostingContext);

  // TODO: add edit mutation here as well
  const [
    createPosting,
    { loading: createPostingLoading, error: createPostingError },
  ] = useMutation(CREATE_POSTING);

  const [isDraftClicked, setIsDraftClicked] = useBoolean();

  const postingToCreate = {
    ...rest,
    branchId: branch.id,
    skills: skills.map((skill) => skill.id),
    employees: employees.map((employee) => employee.id),
  };

  const history = useHistory();
  const navigateToHome = () => history.push(HOME_PAGE);

  return (
    <Box>
      {createPostingError && <ErrorModal />}
      <HStack alignItems="flex-start" spacing={0}>
        <SideNavBarWithTitle
          title="Create New Posting"
          labels={steps}
          activeStep={2}
        />
        <VStack alignItems="flex-end">
          <PostingFormReview />
          <Box minH="75px">
            <Box
              position="fixed"
              bgColor="white"
              minW="100vw"
              align="end"
              zIndex={1}
              bottom={0}
              left={0}
              boxShadow="2px -4px 10px 0px #0000001A"
              py={4}
              px={24}
            >
              <Button variant="link" onClick={navigateBack} mr="10">
                Back
              </Button>
              <Button
                variant="outline"
                w="180px"
                mr="5"
                isLoading={createPostingLoading && isDraftClicked}
                onClick={async () => {
                  setIsDraftClicked.on();
                  // TODO: this should depend on form mode
                  await createPosting({
                    variables: {
                      posting: { ...postingToCreate, status: "DRAFT" },
                    },
                  });
                  navigateToHome();
                }}
              >
                Save as draft
              </Button>
              <Button
                w="180px"
                isLoading={createPostingLoading && !isDraftClicked}
                onClick={async () => {
                  setIsDraftClicked.off();
                  // TODO: this should depend on form mode
                  await createPosting({
                    variables: {
                      posting: { ...postingToCreate, status: "PUBLISHED" },
                    },
                  });
                  navigateToHome();
                }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PostingFormReviewPage;
