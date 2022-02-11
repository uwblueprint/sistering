import React from "react";
import { Stack, HStack, Text } from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

type PocCardProps = {
  name: string;
  title: string;
  email: string;
  phoneNumber: string;
};

const PocCard: React.FC<PocCardProps> = ({
  name,
  title,
  email,
  phoneNumber,
}: PocCardProps) => {
  return (
    <Stack
      minW="260px"
      px={4}
      py={3}
      border="1px"
      borderColor="#E5E5E5"
      borderRadius={3}
      shadow="base"
      spacing={3.5}
    >
      <HStack spacing={0} alignItems="baseline">
        <Text textStyle="caption" fontWeight="medium">
          {name}
        </Text>
        <Text textStyle="caption" fontSize="14px">
          &nbsp;– {title}
        </Text>
      </HStack>
      <HStack spacing={4}>
        <EmailIcon color="text.gray" w="20px" h="20px" />
        <Text textStyle="caption" fontSize="14px">
          {email}
        </Text>
      </HStack>
      <HStack spacing="20px">
        <PhoneIcon color="text.gray" w="18px" h="18px" />
        <Text textStyle="caption" fontSize="14px">
          {phoneNumber}
        </Text>
      </HStack>
    </Stack>
  );
};

export default PocCard;
