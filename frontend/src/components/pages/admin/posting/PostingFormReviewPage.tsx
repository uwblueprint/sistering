import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Box,
  HStack,
  useBoolean,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import PostingFormReview from "../../../admin/posting/PostingFormReview";
import SideNavBarWithTitle from "../../../common/SideNavbarWithTitle";
import ErrorModal from "../../../common/ErrorModal";

import { HOME_PAGE } from "../../../../constants/Routes";
import PostingContext from "../../../../contexts/admin/PostingContext";

const CREATE_POSTING = gql`
  mutation PostingFormReviewPage_CreatePosting(
    $posting: PostingWithShiftsRequestDTO!
  ) {
    createPosting(posting: $posting) {
      id
    }
  }
`;

const UPDATE_POSTING = gql`
  mutation PostingFormReviewPage_UpdatePosting(
    $id: ID!
    $posting: PostingWithShiftsRequestDTO!
  ) {
    updatePosting(id: $id, posting: $posting) {
      id
    }
  }
`;

type PostingFormPageProps = {
  navigateBack: () => void;
  isEdit?: boolean;
  isEditingDraftPosting?: boolean;
  editPostingId?: string;
  steps: string[];
  title: string;
};

const PostingFormReviewPage = ({
  navigateBack,
  isEdit = false,
  isEditingDraftPosting = false,
  editPostingId,
  steps,
  title,
}: PostingFormPageProps): React.ReactElement => {
  const { branch, skills, employees, ...rest } = useContext(PostingContext);

  const [
    createPosting,
    { loading: createPostingLoading, error: createPostingError },
  ] = useMutation(CREATE_POSTING);
  const [
    updatePosting,
    { loading: updatePostingLoading, error: updatePostingError },
  ] = useMutation(UPDATE_POSTING);

  const [isDraftClicked, setIsDraftClicked] = useBoolean();

  const postingInForm = {
    ...rest,
    branchId: branch.id,
    skills: skills.map((skill) => skill.id),
    employees: employees.map((employee) => employee.id),
  };

  const history = useHistory();
  const toast = useToast();

  const navigateToHome = () => history.push(HOME_PAGE);
  const submitPublishPostingForm = async () => {
    setIsDraftClicked.off();
    if (isEdit) {
      try {
        await updatePosting({
          variables: {
            id: editPostingId,
            posting: { ...postingInForm, status: "PUBLISHED" },
          },
        });
      } catch (error: unknown) {
        toast({
          title: "Cannot update posting",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      try {
        await createPosting({
          variables: {
            posting: { ...postingInForm, status: "PUBLISHED" },
          },
        });
      } catch (error: unknown) {
        toast({
          title: "Cannot create posting",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
    navigateToHome();
  };
  const submitDraftPostingForm = async () => {
    setIsDraftClicked.on();
    if (isEdit) {
      await updatePosting({
        variables: {
          id: editPostingId,
          posting: { ...postingInForm, status: "DRAFT" },
        },
      });
    } else {
      await createPosting({
        variables: {
          posting: { ...postingInForm, status: "DRAFT" },
        },
      });
    }
    navigateToHome();
  };

  return (
    <Box>
      {(createPostingError || updatePostingError) && <ErrorModal />}
      <HStack alignItems="flex-start" spacing={0}>
        <SideNavBarWithTitle title={title} labels={steps} activeStep={2} />
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
              {!isEditingDraftPosting && isEdit ? undefined : (
                <Button
                  variant="outline"
                  w="180px"
                  mr="5"
                  isLoading={
                    (createPostingLoading || updatePostingLoading) &&
                    isDraftClicked
                  }
                  onClick={submitDraftPostingForm}
                >
                  Save as draft
                </Button>
              )}
              <Button
                w="180px"
                isLoading={
                  (createPostingLoading || updatePostingLoading) &&
                  !isDraftClicked
                }
                onClick={submitPublishPostingForm}
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
