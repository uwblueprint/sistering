import React, { useState } from "react";
import { Text, Select, Input } from "@chakra-ui/react";

const CreatePostingShifts = (): React.ReactElement => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reoccurence, setReoccurence] = useState<string>("");

  const reoccurenceOptions = ["Weekly", "Bi-weekly", "Monthly"];

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

      <Text fontSize="16px" style={{ margin: "56px 0 8px" }}>
        Reoccurance Frequency *
      </Text>

      <Select
        placeholder="How often will this occur?"
        size="sm"
        maxWidth="425px"
      >
        {reoccurenceOptions.map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
      </Select>
      <Text fontSize="16px" style={{ margin: "60px 0 0" }}>
        Select Start and End Dates *
      </Text>

      <div style={{ display: "flex", padding: "26px 0 0" }}>
        <Text
          textStyle="body-regular"
          fontSize="16px"
          style={{
            alignSelf: "center",
            marginRight: "22px",
          }}
        >
          From
        </Text>
        <Input
          placeholder="DD-MM-YYYY"
          value={startDate}
          onChange={() => setStartDate}
          size="sm"
          style={{
            maxWidth: "278px",
          }}
          isRequired
        />
        <Text
          textStyle="body-regular"
          fontSize="16px"
          style={{
            alignSelf: "center",
            margin: "0 22px",
          }}
        >
          To
        </Text>
        <Input
          placeholder="DD-MM-YYYY"
          value={endDate}
          onChange={() => setEndDate}
          size="sm"
          style={{
            maxWidth: "278px",
          }}
          isRequired
        />
      </div>

      <Text fontSize="16px" style={{ margin: "60px 0 17px" }}>
        Select Shift times *
      </Text>
      <Text fontSize="16px">
        Please select all the times volunteers are required. Every purple block
        is one bookable shift.
      </Text>
    </div>
  );
};

export default CreatePostingShifts;
