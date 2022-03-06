import React, { useContext } from "react";
import { Text } from "@chakra-ui/react";

import MainPageButton from "../common/MainPageButton";
import PostingContext from "../../contexts/admin/PostingContext";
import PostingContextDispatcherContext from "../../contexts/admin/PostingContextDispatcherContext";
import {
  PostingStatus,
  PostingType,
  RecurrenceInterval,
} from "../../types/PostingTypes";

const EditPostingPage = (): React.ReactElement => {
  const {
    title,
    type,
    status,
    description,
    startDate,
    endDate,
    autoClosingDate,
    numVolunteers,
    recurrenceInterval,
  } = useContext(PostingContext);
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  const setTitle = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_TITLE",
      value: e.currentTarget.value,
    });
  };

  const setType = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_TYPE",
      value: e.currentTarget.value as PostingType,
    });
  };

  const setStatus = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_STATUS",
      value: e.currentTarget.value as PostingStatus,
    });
  };

  const setDescription = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_DESCRIPTION",
      value: e.currentTarget.value,
    });
  };

  const setStartDate = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_START_DATE",
      value: e.currentTarget.value,
    });
  };

  const setEndDate = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_END_DATE",
      value: e.currentTarget.value,
    });
  };

  const setAutoClosingDate = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_AUTO_CLOSING_DATE",
      value: e.currentTarget.value,
    });
  };

  const setNumVolunteers = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_NUM_VOLUNTEERS",
      value: parseInt(e.currentTarget.value, 10),
    });
  };

  const setRecurrenceInterval = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_RECURRENCE_INTERVAL",
      value: e.currentTarget.value as RecurrenceInterval,
    });
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto", paddingTop: "20px" }}>
      <Text textStyle="display-large">Edit Posting</Text>
      <div>
        Title:{" "}
        <input
          type="text"
          value={title}
          onChange={setTitle}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        Type:{" "}
        <input
          type="text"
          value={type}
          onChange={setType}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        Status:{" "}
        <input
          type="text"
          value={status}
          onChange={setStatus}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        Description:{" "}
        <input
          type="text"
          value={description}
          onChange={setDescription}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        Start Date:{" "}
        <input
          type="text"
          value={startDate}
          onChange={setStartDate}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        End Date:{" "}
        <input
          type="text"
          value={endDate}
          onChange={setEndDate}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        Auto-Closing Date:{" "}
        <input
          type="text"
          value={autoClosingDate}
          onChange={setAutoClosingDate}
          style={{ border: "1px solid" }}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        # Volunteers:{" "}
        <input
          min={0}
          type="number"
          value={numVolunteers}
          onChange={setNumVolunteers}
          style={{ border: "1px solid" }}
        />
      </div>
      <div>
        Recurrence Interval:{" "}
        <input
          type="text"
          value={recurrenceInterval}
          onChange={setRecurrenceInterval}
          style={{ border: "1px solid" }}
        />
      </div>
      <MainPageButton />
    </div>
  );
};

export default EditPostingPage;
