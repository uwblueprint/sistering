import React from "react";
import {
  Container,
  Flex,
  Box,
  SimpleGrid,
  GridItem,
  Stack,
  VStack,
  HStack,
  Text,
  Tag,
  Circle,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

type BasicInfoGridItemProps = { title: string; info: string };
type PocCardProps = {
  name: string;
  title: string;
  email: string;
  phoneNumber: string;
};
type SkillTagProps = { name: string };

const BasicInfoGridItem: React.FC<BasicInfoGridItemProps> = ({
  title,
  info,
}: BasicInfoGridItemProps) => {
  return (
    <GridItem colSpan={1}>
      <Stack spacing={1}>
        <Text
          fontFamily="Raleway"
          fontSize="18px"
          fontWeight="medium"
          color="#737B7D"
        >
          {title}
        </Text>
        <Text fontFamily="Inter" fontSize="18px" fontWeight="medium">
          {info}
        </Text>
      </Stack>
    </GridItem>
  );
};

const PocCard: React.FC<PocCardProps> = ({
  name,
  title,
  email,
  phoneNumber,
}: PocCardProps) => {
  return (
    <Stack
      minW={260}
      px={4}
      py={3}
      border="1px"
      borderColor="#E5E5E5"
      borderRadius={3}
      shadow="base"
    >
      <HStack spacing={0} alignItems="baseline">
        <Text textStyle="caption" fontWeight="medium">
          {name}
        </Text>
        <Text textStyle="caption" fontSize="14px">
          &nbsp;– {title}
        </Text>
      </HStack>
      <HStack spacing={3}>
        <EmailIcon color="#C4C4C4" />
        <Text textStyle="caption" fontSize="14px">
          {email}
        </Text>
      </HStack>
      <HStack spacing={3}>
        <PhoneIcon color="#C4C4C4" />
        <Text textStyle="caption" fontSize="14px">
          {phoneNumber}
        </Text>
      </HStack>
    </Stack>
  );
};

const SkillTag: React.FC<SkillTagProps> = ({ name }: SkillTagProps) => {
  return (
    <Tag
      size="md"
      bgColor="violet"
      borderRadius={100}
      border="2px"
      borderColor="violet"
    >
      <Text textStyle="caption" color="text.white">
        {name}
      </Text>
    </Tag>
  );
};

const CreatePostingReview = (): React.ReactElement => {
  return (
    <Container border="1px" maxW="container.xl" p={0}>
      <Flex p={10}>
        <VStack w="full" spacing={5} alignItems="flex-start">
          <HStack spacing={5}>
            <Circle
              size="46px"
              bg="transparent"
              color="violet"
              borderWidth="3px"
              borderColor="violet"
            >
              <Text fontFamily="Open Sans" fontSize="20px" fontWeight="bold">
                3
              </Text>
            </Circle>
            <Text textStyle="heading">Review and Post</Text>
          </HStack>
          <VStack w="full" spacing={8} alignItems="flex-start" px={2}>
            <Text textStyle="caption">
              Enter all the details of your volunteer posting. Please take
              advantage of the Role Description section and add any information
              that will help. Once you have completed filling it out, press
              next.
            </Text>
            <Stack spacing={6}>
              <Text textStyle="heading" color="#333" mt={1}>
                Basic Information
              </Text>
              <SimpleGrid columns={3} w="full">
                <BasicInfoGridItem title="Branch" info="Kitchen" />
                <BasicInfoGridItem title="Title" info="Kitchen Volunteer" />
                <BasicInfoGridItem
                  title="Posting Closing Date"
                  info="22/11/2021"
                />
              </SimpleGrid>
              <Stack>
                <Text
                  fontFamily="Raleway"
                  fontSize="18px"
                  fontWeight="medium"
                  color="#737B7D"
                  mt={3}
                >
                  Description
                </Text>
                <Text textStyle="body-regular">
                  A job for the biggest people <br />
                  <br /> This role will require someone who is paitent,
                  energetic, and understanding. You will be asked to find Zuko’s
                  honour and stay moving. Majority of your time will be spent
                  engaging with customers and serving food. Ocassionally you
                  maybe asked to cook. First Aid and CPR experience is also
                  required.
                </Text>
              </Stack>
              <Stack spacing={4}>
                <Text
                  fontFamily="Raleway"
                  fontSize="18px"
                  fontWeight="medium"
                  color="#737B7D"
                  mt={5}
                >
                  Point(s) of Contact
                </Text>
                <HStack spacing={6}>
                  <PocCard
                    name="Amanda Du"
                    title="Kitchen Manager"
                    email="atdu@uwblueprint.org"
                    phoneNumber="6131234579"
                  />
                  <PocCard
                    name="Amanda Du"
                    title="Kitchen Manager"
                    email="atdu@uwblueprint.org"
                    phoneNumber="6131234579"
                  />
                </HStack>
              </Stack>
              <Stack>
                <Text
                  fontFamily="Raleway"
                  fontSize="18px"
                  fontWeight="medium"
                  color="#737B7D"
                  mt={4}
                >
                  Skills
                </Text>
                <HStack>
                  <SkillTag name="CPR" />
                  <SkillTag name="First Aid" />
                  <SkillTag name="Being Fun" />
                </HStack>
              </Stack>
            </Stack>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default CreatePostingReview;
