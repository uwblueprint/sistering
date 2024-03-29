import React from "react";
import { defaultSteps, PostingPageStep } from "./EditPostingPage";
import PostingFormBasicInfoPage from "./PostingFormBasicInfoPage";
import PostingFormReviewPage from "./PostingFormReviewPage";
import PostingFormShiftsPage from "./PostingFormShiftsPage";

const CREATE_POSTING_TITLE = "Create New Posting";

const CreatePostingPage = (): React.ReactElement => {
  const [step, setStep] = React.useState<PostingPageStep>(
    PostingPageStep.BasicInfo,
  );

  const navigateToNext = () => {
    switch (step) {
      case PostingPageStep.BasicInfo:
        setStep(PostingPageStep.Shifts);
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
        setStep(PostingPageStep.Shifts);
        break;
      default:
        break;
    }
  };

  switch (step) {
    case PostingPageStep.BasicInfo:
      return (
        <PostingFormBasicInfoPage
          navigateToNext={navigateToNext}
          steps={defaultSteps}
          title={CREATE_POSTING_TITLE}
        />
      );
    case PostingPageStep.Shifts:
      return (
        <PostingFormShiftsPage
          navigateToNext={navigateToNext}
          navigateBack={navigateBack}
          steps={defaultSteps}
          title={CREATE_POSTING_TITLE}
        />
      );
    case PostingPageStep.ReviewAndPost:
      return (
        <PostingFormReviewPage
          navigateBack={navigateBack}
          steps={defaultSteps}
          title={CREATE_POSTING_TITLE}
        />
      );
    default:
      return <>Unknown step</>;
  }
};

export default CreatePostingPage;
