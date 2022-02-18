import React, { useContext } from "react";
import { Button, useBoolean } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

import CreatePostingReview from "../../../admin/posting/CreatePostingReview";
import MainPageButton from "../../../common/MainPageButton";

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

  // eslint-disable-next-line no-alert
  if (error) window.alert(error);

  return (
    <div>
      <CreatePostingReview />
      <MainPageButton />
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
        }}
      >
        Post
      </Button>
    </div>
  );
};

export default CreatePostingReviewPage;
