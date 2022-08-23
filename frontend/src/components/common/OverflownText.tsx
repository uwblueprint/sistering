import React, { useRef, useState, useEffect } from "react";
import { Tooltip, Text } from "@chakra-ui/react";

type OverflownTextProps = {
  children: React.ReactNode;
  maxW?: string;
};

const OverflownText: React.FC<OverflownTextProps> = ({
  children,
  maxW,
}: OverflownTextProps) => {
  // eslint-disable-next-line
  const ref = useRef<any>(null);
  const [isOverflown, setIsOverflown] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line
    const element = ref.current!;
    setIsOverflown(element.scrollWidth > element.clientWidth);
  }, []);

  return (
    <Tooltip
      label={children}
      isDisabled={!isOverflown}
      placement="bottom-start"
    >
      {/*  eslint-disable-next-line */}
      <Text position="relative" isTruncated ref={ref} maxW={maxW}>
        {children}
      </Text>
    </Tooltip>
  );
};

export default OverflownText;
