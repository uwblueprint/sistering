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
  ] = useState<RecurrenceInterval>("NONE");

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

    if (startDate && endDate && recurrenceInterval) {
      addStartDate(startDate);
      addEndDate(endDate);
      addRecurrenceInterval(recurrenceInterval);
    }

    // TODO: navigate to next section of form
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
          <Text textStyle="heading">Scheduling time slots</Text>
        </HStack>
        <VStack spacing={30} alignItems="flex-start" px={2}>
          <Text textStyle="caption">
            {ADMIN_POSTING_CREATE_SCHEDULING_TIME_SLOTS}
          </Text>
          <FormControl isRequired isInvalid={recurrenceIntervalError}>
            <FormLabel textStyle="heading">Reoccurance Frequency</FormLabel>

            <Select
              // placeholder="How often will this occur?"
              size="sm"
              maxWidth="425px"
              isRequired
              value=""
              // onChange={(e) => setRecurrenceInterval(e.target.value)}
            >
              {recurrenceOptions.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select a frequency.</FormErrorMessage>
          </FormControl>

          <VStack spacing={2} alignItems="flex-start">
            <Text textStyle="heading" fontSize="18px" fontWeight="normal">
              Select Start and End Dates
            </Text>

            <Flex>
              <FormControl isRequired isInvalid={startDateError}>
                <Flex>
                  <HStack spacing={5.5}>
                    <FormLabel textStyle="heading" fontSize="18px">
                      From
                    </FormLabel>
                    <VStack spacing={2}>
                      <Input
                        placeholder="DD-MM-YYYY"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        size="sm"
                        style={{
                          maxWidth: "278px",
                        }}
                      />
                      <FormErrorMessage>Please enter a date.</FormErrorMessage>
                    </VStack>
                  </HStack>
                </Flex>
              </FormControl>
              <FormControl isRequired isInvalid={endDateError}>
                <Flex>
                  <FormLabel textStyle="heading" fontSize="18px">
                    To
                  </FormLabel>
                  <VStack spacing={2}>
                    <Input
                      placeholder="DD-MM-YYYY"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      size="sm"
                      style={{
                        maxWidth: "278px",
                      }}
                    />
                    <FormErrorMessage>Please enter a date.</FormErrorMessage>
                  </VStack>
                </Flex>
              </FormControl>
            </Flex>
          </VStack>

          <VStack spacing={2}>
            <FormControl isRequired>
              <FormLabel textStyle="heading">Select Shift times</FormLabel>
            </FormControl>

            <Text fontSize="16px">{ADMIN_POSTING_CREATE_SHIFTS_TIME}</Text>
          </VStack>
        </VStack>
        <Button onClick={handleNext}>Next</Button>
      </VStack>
    </Container>
  );
};

export default CreatePostingShifts;
