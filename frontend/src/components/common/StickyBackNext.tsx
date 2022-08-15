import React from "react";
import { Box, Button } from "@chakra-ui/react";

type StickyBackNextProps = {
  onBack?: () => void;
  onNext?: () => void;
};

const StickyBackNext: React.FC<StickyBackNextProps> = ({
  onBack,
  onNext,
}: StickyBackNextProps) => {
  return (
    <Box minH="75px">
      <Box
        position="fixed"
        bgColor="white"
        minW="100vw"
        textAlign="end"
        zIndex={1}
        bottom={0}
        left={0}
        boxShadow="2px -4px 10px 0px #0000001A"
        py={4}
        px={24}
      >
        {!onBack ? undefined : (
          <Button variant="link" onClick={onBack} mr="12">
            Back
          </Button>
        )}
        {!onNext ? undefined : (
          <Button w="180px" onClick={onNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default StickyBackNext;
