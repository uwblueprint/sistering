import React, { useContext, useState } from "react";
import {
  Text,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import PostingContextDispatcherContext from "../../../contexts/admin/PostingContextDispatcherContext";
import { RecurrenceInterval } from "../../../types/PostingTypes";

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
    <div
      style={{
        padding: "65px 62px",
      }}
    >
      <div
        style={{
          display: "flex",
          paddingBottom: "24px",
        }}
      >
        <div
          style={{
            border: "3px solid #7600E3",
            borderRadius: "50%",
            width: "46px",
            height: "46px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            marginRight: "24px",
          }}
        >
          <Text
            textStyle="display-large"
            fontSize="20px"
            style={{
              color: "#7600E3",
              alignSelf: "center",
            }}
          >
            2
          </Text>
        </div>
        <Text
          textStyle="display-large"
          fontSize="20px"
          style={{
            alignSelf: "center",
          }}
        >
          Scheduling time slots
        </Text>
      </div>

      <Text textStyle="body-regular" fontSize="16px">
        Enter all the details of your volunteer posting. Please take advantage
        of the Role Description section and add any information that will help.
        Once you have completed filling it out, press next.
      </Text>

      <FormControl isRequired isInvalid={recurrenceIntervalError}>
        <FormLabel fontSize="16px" style={{ margin: "56px 0 8px" }}>
          Recurrence Frequency
        </FormLabel>

        <Select
          // placeholder="How often will this occur?"
          size="sm"
          maxWidth="425px"
          isRequired
        >
          {recurrenceOptions.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>Please select a frequency.</FormErrorMessage>
      </FormControl>

      <Text fontSize="16px" style={{ margin: "60px 0 0" }}>
        Select Start and End Dates
      </Text>

      <div style={{ display: "flex", padding: "26px 0 0" }}>
        <FormControl isRequired isInvalid={startDateError}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <FormLabel
              textStyle="body-regular"
              fontSize="16px"
              style={{
                alignSelf: "center",
                marginRight: "22px",
              }}
            >
              From
            </FormLabel>
            <div style={{ display: "flex", flexDirection: "column" }}>
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
            </div>
          </div>
        </FormControl>
        <FormControl isRequired isInvalid={endDateError}>
          <div style={{ display: "flex" }}>
            <FormLabel
              textStyle="body-regular"
              fontSize="16px"
              style={{
                alignSelf: "center",
              }}
            >
              To
            </FormLabel>
            <div style={{ display: "flex", flexDirection: "column" }}>
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
            </div>
          </div>
        </FormControl>
      </div>

      <FormControl isRequired>
        <FormLabel fontSize="16px" style={{ margin: "60px 0 17px" }}>
          Select Shift times
        </FormLabel>
      </FormControl>

      <Text fontSize="16px">
        Please select all the times volunteers are required. Every purple block
        is one bookable shift.
      </Text>
      <Button onClick={handleNext}>Next</Button>
    </div>
  );
};

export default CreatePostingShifts;
