import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Container,
  HStack,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import CreatePostingReview from "../../../admin/posting/CreatePostingReview";
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
  const { status, times, recurrenceInterval, ...postingToCreate } = useContext(
    PostingContext,
  );
  const [createPosting, { loading, error }] = useMutation(CREATE_POSTING);
  const [isDraftClicked, setIsDraftClicked] = useBoolean();

  const history = useHistory();
  const navigateToHome = () => history.push(HOME_PAGE);

  // eslint-disable-next-line no-alert
  if (error) window.alert(error);

  return (
    <div>
      <CreatePostingReview />
      <Container maxW="container.xl" p={0}>
        <VStack alignItems="flex-end">
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
      </Container>
    </div>
  );
};

export default CreatePostingReviewPage;
