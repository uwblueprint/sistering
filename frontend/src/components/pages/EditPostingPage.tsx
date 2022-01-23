import React, { useContext, useState } from "react";
import { Text } from "@chakra-ui/react";

import MainPageButton from "../common/MainPageButton";
import PostingContext from "../../contexts/admin/PostingContext";
import PostingContextDispatcherContext from "../../contexts/admin/PostingContextDispatcherContext";
import {
  PostingStatus,
  PostingType,
  RecurrenceInterval,
} from "../../types/PostingTypes";

type DeleteButtonProps = { index: number; onClick: (index: number) => void };

const DeleteButton: React.FC<DeleteButtonProps> = ({
  index,
  onClick,
}: DeleteButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-link"
      onClick={() => {
        onClick(index);
      }}
    >
      Delete
    </button>
  );
};

const EditPostingPage = (): React.ReactElement => {
  const {
    branchId,
    skills,
    employees,
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
  const [newSkill, setNewSkill] = useState<string>("");
  const [newEmployee, setNewEmployee] = useState<string>("");

  const setBranchId = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_BRANCH_ID",
      value: e.currentTarget.value,
    });
  };

  const onSkillDelete = (index: number) => {
    dispatchPostingUpdate({
      type: "EDIT_SKILLS",
      value: [...skills.slice(0, index), ...skills.slice(index + 1)],
    });
  };

  const onSkillAdd = () => {
    dispatchPostingUpdate({
      type: "EDIT_SKILLS",
      value: [...skills, newSkill],
    });
  };

  const onEmployeeDelete = (index: number) => {
    dispatchPostingUpdate({
      type: "EDIT_EMPLOYEES",
      value: [...employees.slice(0, index), ...employees.slice(index + 1)],
    });
  };

  const onEmployeeAdd = () => {
    dispatchPostingUpdate({
      type: "EDIT_EMPLOYEES",
      value: [...employees, newEmployee],
    });
  };

  const setTitle = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_TITLE",
      value: e.currentTarget.value,
    });
  };

  const setType = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_TYPE",
      value: e.currentTarget.value as PostingType,
    });
  };

  const setStatus = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_STATUS",
      value: e.currentTarget.value as PostingStatus,
    });
  };

  const setDescription = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_DESCRIPTION",
      value: e.currentTarget.value,
    });
  };

  const setStartDate = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_START_DATE",
      value: e.currentTarget.value,
    });
  };

  const setEndDate = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_END_DATE",
      value: e.currentTarget.value,
    });
  };

  const setAutoClosingDate = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_AUTO_CLOSING_DATE",
      value: e.currentTarget.value,
    });
  };

  const setNumVolunteers = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_NUM_VOLUNTEERS",
      value: parseInt(e.currentTarget.value, 10),
    });
  };

  const setRecurrenceInterval = (e: React.FormEvent<HTMLInputElement>) => {
    dispatchPostingUpdate({
      type: "EDIT_RECURRENCE_INTERVAL",
      value: e.currentTarget.value as RecurrenceInterval,
    });
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto", paddingTop: "20px" }}>
      <Text textStyle="display-large">Edit Posting</Text>
      <div>
        Branch ID:{" "}
        <input
          type="text"
          value={branchId}
          onChange={setBranchId}
          style={{ border: "1px solid" }}
        />
      </div>
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
      <div style={{ marginTop: "1rem" }}>
        Skills:
        {skills.map((_name, i) => (
          <div
            key={_name}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {_name}
            <DeleteButton index={i} onClick={onSkillDelete} />
          </div>
        ))}
      </div>
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => {
            setNewSkill(e.target.value);
          }}
          style={{ border: "1px solid" }}
        />
        <button type="button" onClick={onSkillAdd} className="btn btn-link">
          Add
        </button>
      </div>
      <div style={{ marginTop: "1rem" }}>
        Employees:
        {employees.map((_name, i) => (
          <div
            key={_name}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {_name}
            <DeleteButton index={i} onClick={onEmployeeDelete} />
          </div>
        ))}
      </div>
      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          value={newEmployee}
          onChange={(e) => {
            setNewEmployee(e.target.value);
          }}
          style={{ border: "1px solid" }}
        />
        <button type="button" onClick={onEmployeeAdd} className="btn btn-link">
          Add
        </button>
      </div>
      <MainPageButton />
    </div>
  );
};

export default EditPostingPage;
