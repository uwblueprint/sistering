import React from "react";
import CreatePostingBasicInfoPage from "./CreatePostingBasicInfoPage";
import CreatePostingReviewPage from "./CreatePostingReviewPage";
import CreatePostingShiftsPage from "./CreatePostingShiftsPage";

enum CreatePostingPageStep {
  BasicInfo,
  Shifts,
  ReviewAndPost,
}

const CreatePostingPage = (): React.ReactElement => {
  const [step, setStep] = React.useState<CreatePostingPageStep>(
    CreatePostingPageStep.BasicInfo,
  );

  const navigateToNext = () => {
    switch (step) {
      case CreatePostingPageStep.BasicInfo:
        setStep(CreatePostingPageStep.Shifts);
        break;
      case CreatePostingPageStep.Shifts:
        setStep(CreatePostingPageStep.ReviewAndPost);
        break;
      case CreatePostingPageStep.ReviewAndPost:
        break;
      default:
        break;
    }
  };

  const navigateBack = () => {
    switch (step) {
      case CreatePostingPageStep.BasicInfo:
        break;
      case CreatePostingPageStep.Shifts:
        setStep(CreatePostingPageStep.BasicInfo);
        break;
      case CreatePostingPageStep.ReviewAndPost:
        setStep(CreatePostingPageStep.Shifts);
        break;
      default:
        break;
    }
  };

  switch (step) {
    case CreatePostingPageStep.BasicInfo:
      return <CreatePostingBasicInfoPage navigateToNext={navigateToNext} />;
    case CreatePostingPageStep.Shifts:
      return (
        <CreatePostingShiftsPage
          navigateToNext={navigateToNext}
          navigateBack={navigateBack}
        />
      );
    case CreatePostingPageStep.ReviewAndPost:
      return <CreatePostingReviewPage navigateBack={navigateBack} />;
    default:
      return <>Unknown step</>;
  }
};

export default CreatePostingPage;
