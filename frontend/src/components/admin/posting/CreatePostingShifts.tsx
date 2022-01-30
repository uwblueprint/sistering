import React, { useState } from "react";
import { Text, Select, Input } from "@chakra-ui/react";

const CreatePostingShifts = (): React.ReactElement => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reoccurence, setReoccurence] = useState<string>("");

  return (
    <div style={{ textAlign: "center" }}>
      <Text textStyle="display-large">Scheduling time slots</Text>
      <Text textStyle="body-regular">
        Enter all the details of your volunteer posting. Please take advantage
        of the Role Description section and add any information that will help.
        Once you have completed filling it out, press next.
      </Text>

      <Select />
      <Input
        placeholder="DD-MM-YYYY"
        value={startDate}
        onChange={() => setStartDate}
        size="sm"
      />
      <Input
        placeholder="DD-MM-YYYY"
        value={endDate}
        onChange={() => setEndDate}
        size="sm"
      />
      <Text>Select Shift times *</Text>
      <Text>
        Please select all the times volunteers are required. Every purple block
        is one bookable shift.
      </Text>
    </div>
  );
};

export default CreatePostingShifts;
