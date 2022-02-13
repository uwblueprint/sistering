import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
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
  const [createPosting, { data, loading, error }] = useMutation(CREATE_POSTING);

  if (loading) console.log("Submitting...");
  if (error) console.log(`Submission error! ${error}`);

  return (
    <div>
      <CreatePostingReview />
      <MainPageButton />
      <Button
        variant="outline"
        onClick={() => {
          createPosting({
            variables: {
              posting: { ...postingToCreate, ...{ status: "DRAFT" } },
            },
          });
        }}
      >
        Save as Draft
      </Button>
      <Button
        onClick={() => {
          createPosting({
            variables: {
              posting: { ...postingToCreate, ...{ status: "PUBLISHED" } },
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
