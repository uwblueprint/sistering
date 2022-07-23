import { gql, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import PostingContext from "../../../../contexts/admin/PostingContext";
import PostingContextDispatcherContext from "../../../../contexts/admin/PostingContextDispatcherContext";
import {
  PostingDataQueryInput,
  PostingDataQueryResponse,
} from "../../../../types/api/PostingTypes";
import { Shift } from "../../../../types/PostingContextTypes";
import { getISOStringDateTime } from "../../../../utils/DateTimeUtils";
import ErrorModal from "../../../common/ErrorModal";
import Loading from "../../../common/Loading";
import PostingFormBasicInfoPage from "./PostingFormBasicInfoPage";
import PostingFormReviewPage from "./PostingFormReviewPage";
import PostingFormShiftsPage from "./PostingFormShiftsPage";

const EDIT_POSTING_TITLE = "Edit Existing Posting";

// TODO: this can be extracted to common
export enum PostingPageStep {
  BasicInfo,
  Shifts,
  ReviewAndPost,
}

export const defaultSteps = [
  "Basic Information",
  "Time Slots",
  "Review and Post",
];
const nonDraftEditSteps = ["Basic Information", "Review and Post"];

// TODO: we also need info about all the shifts
const POSTING = gql`
  query EditPostingForm_Posting($id: ID!) {
    posting(id: $id) {
      title
      description
      status
      branch {
        id
        name
      }
      shifts {
        startTime
        endTime
      }
      startDate
      endDate
      numVolunteers
      skills {
        id
        name
      }
      employees {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      autoClosingDate
      recurrenceInterval
    }
  }
`;

const EditPostingPage = (): React.ReactElement => {
  // TODO: should take query param of posting id and use it to query
  const { id } = useParams<{ id: string }>();
  const { title: titleFromCtx } = useContext(PostingContext);
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  const [step, setStep] = React.useState<PostingPageStep>(
    PostingPageStep.BasicInfo,
  );

  const [isDraft, setIsDraft] = useState(false);

  const { error: postingError, loading: isPostingLoading } = useQuery<
    PostingDataQueryResponse,
    PostingDataQueryInput
  >(POSTING, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    onCompleted: ({ posting }) => {
      setIsDraft(posting.status === "DRAFT");
      // TODO: on load, we want to dispatch all actions here
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_TITLE",
        value: posting.title,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_NUM_VOLUNTEERS",
        value: posting.numVolunteers,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_BRANCH",
        value: posting.branch,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_AUTO_CLOSING_DATE",
        value: posting.autoClosingDate,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_DESCRIPTION",
        value: posting.description,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_SKILLS",
        value: posting.skills,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_EMPLOYEES",
        value: posting.employees,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_START_DATE",
        value: posting.startDate,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_END_DATE",
        value: posting.endDate,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_RECURRENCE_INTERVAL",
        value: posting.recurrenceInterval,
      });
      dispatchPostingUpdate({
        type: "ADMIN_POSTING_EDIT_TIMES",
        value: posting.shifts.map((shift) => {
          return {
            startTime: getISOStringDateTime(new Date(shift.startTime)),
            endTime: getISOStringDateTime(new Date(shift.endTime)),
          } as Shift;
        }),
      });
    },
  });

  // These navigate depends on draft vs non-draft edits
  const navigateToNext = () => {
    switch (step) {
      case PostingPageStep.BasicInfo:
        setStep(
          isDraft ? PostingPageStep.Shifts : PostingPageStep.ReviewAndPost,
        );
        break;
      case PostingPageStep.Shifts:
        setStep(PostingPageStep.ReviewAndPost);
        break;
      case PostingPageStep.ReviewAndPost:
        break;
      default:
        break;
    }
  };

  const navigateBack = () => {
    switch (step) {
      case PostingPageStep.BasicInfo:
        break;
      case PostingPageStep.Shifts:
        setStep(PostingPageStep.BasicInfo);
        break;
      case PostingPageStep.ReviewAndPost:
        setStep(isDraft ? PostingPageStep.Shifts : PostingPageStep.BasicInfo);
        break;
      default:
        break;
    }
  };

  if (isPostingLoading || titleFromCtx.length < 1) {
    return <Loading />;
  }
  if (postingError) {
    return <ErrorModal />;
  }

  // TODO: we should query data, write to context, and then continue.
  // TODO: Change forms to take optional data from for init data to use if context is empty
  // TODO: For the review page, if on edit mode, use mutation instead
  switch (step) {
    case PostingPageStep.BasicInfo:
      return (
        <PostingFormBasicInfoPage
          navigateToNext={navigateToNext}
          steps={!isDraft ? nonDraftEditSteps : defaultSteps}
          title={EDIT_POSTING_TITLE}
        />
      );
    case PostingPageStep.Shifts:
      // This will only be rendered if our posting is a draft
      return (
        <PostingFormShiftsPage
          navigateToNext={navigateToNext}
          navigateBack={navigateBack}
          steps={defaultSteps}
          title={EDIT_POSTING_TITLE}
        />
      );
    case PostingPageStep.ReviewAndPost:
      return (
        <PostingFormReviewPage
          navigateBack={navigateBack}
          steps={!isDraft ? nonDraftEditSteps : defaultSteps}
          isEdit
          isEditingDraftPosting={isDraft}
          editPostingId={id}
          title={EDIT_POSTING_TITLE}
        />
      );
    default:
      return <>Unknown step</>;
  }
};

export default EditPostingPage;
