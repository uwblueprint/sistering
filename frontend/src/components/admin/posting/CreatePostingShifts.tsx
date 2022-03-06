import React, { useContext, useState } from "react";
import {
  Container,
  Flex,
  HStack,
  VStack,
  Text,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Circle,
} from "@chakra-ui/react";
import PostingContextDispatcherContext from "../../../contexts/admin/PostingContextDispatcherContext";
import { RecurrenceInterval } from "../../../types/PostingTypes";
import {
  ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS,
  ADMIN_POSTING_CREATE_SHIFTS_TIME,
} from "../../../constants/Copy";

const CreatePostingShifts = (): React.ReactElement => {
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [
    recurrenceInterval,
    setRecurrenceInterval,
  ] = useState<RecurrenceInterval>("" as RecurrenceInterval);

  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [recurrenceIntervalError, setRecurrenceIntervalError] = useState(false);

  const addStartDate = (date: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_START_DATE",
      value: date,
    });
  };

  const addEndDate = (date: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_END_DATE",
      value: date,
    });
  };

  const addRecurrenceInterval = (interval: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_RECURRENCE_INTERVAL",
      value: interval as RecurrenceInterval,
    });
  };

  const handleNext = () => {
    // field validations
    setStartDateError(!startDate);
    setEndDateError(!endDate);
    setRecurrenceIntervalError(!recurrenceInterval);

    if (startDate > endDate) {
      setStartDateError(true);
      setEndDateError(true);
    }

    if (startDate && endDate && recurrenceInterval) {
      addStartDate(startDate);
      addEndDate(endDate);
      addRecurrenceInterval(recurrenceInterval);
    }
  };

  const recurrenceOptions = [
    { label: "None", value: "NONE" },
    { label: "Weekly", value: "WEEKLY" },
    { label: "Bi-weekly", value: "BIWEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
  ];

  return (
    <Container maxW="container.xl">
      <VStack w="full" spacing={5} alignItems="flex-start" p={10}>
        <HStack spacing={5}>
          <Circle
            size="46px"
            bg="transparent"
            borderWidth="3px"
            borderColor="violet"
            pb={1}
          >
            <Text textStyle="heading" fontWeight="bold" color="violet">
              2
            </Text>
          </Circle>
          <Text textStyle="heading">Scheduling Time Slots</Text>
        </HStack>
        <VStack spacing={30} alignItems="flex-start" px={2}>
          <Text textStyle="caption">
            {ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS}
          </Text>
          <FormControl isRequired isInvalid={recurrenceIntervalError}>
            <FormLabel textStyle="body-regular">Recurrence Frequency</FormLabel>
            <Flex alignItems="flex-start">
              <VStack spacing={2} alignItems="flex-end">
                <Select
                  placeholder="How often will this occur?"
                  size="sm"
                  width="425px"
                  onChange={(e) =>
                    setRecurrenceInterval(e.target.value as RecurrenceInterval)
                  }
                >
                  {recurrenceOptions.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Please select a frequency.</FormErrorMessage>
              </VStack>
            </Flex>
          </FormControl>
          <VStack spacing={2} alignItems="flex-start">
            <Text textStyle="body-regular" fontWeight="medium">
              Select Start and End Dates
            </Text>
            <HStack spacing={5} alignItems="flex-start">
              <FormControl isRequired isInvalid={startDateError}>
                <Flex>
                  <FormLabel textStyle="caption">From</FormLabel>
                  <VStack spacing={2} alignItems="flex-end">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      size="sm"
                      style={{
                        maxWidth: "278px",
                      }}
                    />
                    <FormErrorMessage>
                      Please enter a valid date.
                    </FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
              <FormControl isRequired isInvalid={endDateError}>
                <Flex>
                  <FormLabel textStyle="caption">To</FormLabel>
                  <VStack spacing={2} alignItems="flex-end">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      size="sm"
                      style={{
                        maxWidth: "278px",
                      }}
                    />
                    <FormErrorMessage>
                      Please enter a valid date.
                    </FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
            </HStack>
          </VStack>
          <VStack spacing={2}>
            <FormControl isRequired>
              <FormLabel textStyle="body-regular">Select Shift Times</FormLabel>
            </FormControl>
            <Text textStyle="caption">{ADMIN_POSTING_CREATE_SHIFTS_TIME}</Text>
          </VStack>
        </VStack>
        <Button onClick={handleNext}>Next</Button>
      </VStack>
    </Container>
  );
};

export default CreatePostingShifts;