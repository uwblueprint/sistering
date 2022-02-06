import React, { useContext } from "react";
import {
  Container,
  Flex,
  Stack,
  VStack,
  HStack,
  SimpleGrid,
  GridItem,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  Tag,
  Circle,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

import PostingContext from "../../../contexts/admin/PostingContext";

type BasicInfoGridItemProps = { title: string; info: string };
type PocCardProps = {
  name: string;
  title: string;
  email: string;
  phoneNumber: string;
};
type SkillTagProps = { name: string };
type ScheduledShiftsTrProps = { date: string; time: string };

const BasicInfoGridItem: React.FC<BasicInfoGridItemProps> = ({
  title,
  info,
}: BasicInfoGridItemProps) => {
  return (
    <GridItem colSpan={1}>
      <Stack spacing={1}>
        <Text textStyle="subheading" color="text.gray">
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
        <EmailIcon color="#C4C4C4" w="20px" h="20px" />
        <Text textStyle="caption" fontSize="14px">
          {email}
        </Text>
      </HStack>
      <HStack spacing="18px">
        <PhoneIcon color="#C4C4C4" w="18px" h="18px" />
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

const ScheduledShiftsTr: React.FC<ScheduledShiftsTrProps> = ({
  date,
  time,
}: ScheduledShiftsTrProps) => {
  return (
    <Tbody>
      <Tr>
        <Td maxW="120px">
          <Text textStyle="caption" fontSize="14px" fontWeight="medium">
            {date}
          </Text>
        </Td>
        <Td>
          <Text textStyle="caption" fontSize="14px" fontWeight="medium">
            {time}
          </Text>
        </Td>
      </Tr>
    </Tbody>
  );
};

const CreatePostingReview = (): React.ReactElement => {
  const {
    branchId,
    skills,
    employees,
    title,
    description,
    autoClosingDate,
    times,
  } = useContext(PostingContext);
  return (
    <Container maxW="container.xl" p={0}>
      <Flex p={10}>
        <VStack w="full" spacing={5} alignItems="flex-start">
          <HStack spacing={5}>
            <Circle
              size="46px"
              bg="transparent"
              borderWidth="3px"
              borderColor="violet"
              pb={1}
            >
              <Text textStyle="heading" color="violet" fontWeight="bold">
                3
              </Text>
            </Circle>
            <Text textStyle="heading">Review and Post</Text>
          </HStack>
          <VStack w="full" spacing={9} alignItems="flex-start" px={2}>
            <Text textStyle="caption">
              Enter all the details of your volunteer posting. Please take
              advantage of the Role Description section and add any information
              that will help. Once you have completed filling it out, press
              next.
            </Text>
            <Stack spacing={6} w="full">
              <Text textStyle="heading">Basic Information</Text>
              <SimpleGrid columns={3} w="full">
                <BasicInfoGridItem title="Branch" info={branchId} />
                <BasicInfoGridItem title="Title" info={title} />
                <BasicInfoGridItem
                  title="Posting Closing Date"
                  info={autoClosingDate}
                />
              </SimpleGrid>
              <Stack>
                <Text textStyle="subheading" color="text.gray" mt={3}>
                  Description
                </Text>
                <Text textStyle="body-regular">{description}</Text>
              </Stack>
              <Stack spacing={4}>
                <Text textStyle="subheading" color="text.gray" mt={5}>
                  Point(s) of Contact
                </Text>
                <HStack spacing={6}>
                  {employees.map((name, i) => (
                    <PocCard
                      name={name}
                      title="hard code"
                      email="hard code"
                      phoneNumber="hard code"
                      key={i}
                    />
                  ))}
                </HStack>
              </Stack>
              <Stack>
                <Text textStyle="subheading" color="text.gray" mt={4}>
                  Skills
                </Text>
                <HStack>
                  {skills.map((name, i) => (
                    <SkillTag name={name} key={i} />
                  ))}
                </HStack>
              </Stack>
            </Stack>
            <Stack spacing={3} width="full">
              <Text textStyle="heading" mt={3}>
                Scheduled Shifts
              </Text>
              <Table maxW="1000px">
                {times.map((t, i) => {
                  const startDT = new Date(t.startTime);
                  const endDT = new Date(t.endTime);
                  const date = startDT.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  });
                  const startTime = startDT.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "numeric",
                  });
                  const endTime = endDT.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "numeric",
                  });
                  const hours = (endDT.valueOf() - startDT.valueOf()) / 36e5;
                  const time = `${startTime} - ${endTime} (${hours} hours)`;
                  return <ScheduledShiftsTr date={date} time={time} key={i} />;
                })}
              </Table>
            </Stack>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default CreatePostingReview;
