import React, { useContext, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

import FormHeader from "../../common/FormHeader";
import {
  ADMIN_POSTING_CREATE_BASIC_INFO_CLOSING_DATE_TOOLTIP,
  ADMIN_POSTING_CREATE_BASIC_INFO_ENTER_ALL_DETAILS,
  ADMIN_POSTING_CREATE_BASIC_INFO_ROLE_DESCRIPTION_PLACEHOLDER,
  ADMIN_POSTING_CREATE_BASIC_INFO_SKILLS_TOOLTIP,
} from "../../../constants/Copy";
import PostingContextDispatcherContext from "../../../contexts/admin/PostingContextDispatcherContext";

import { BranchDTO, BranchResponseDTO } from "../../../types/api/BranchTypes";
import {
  EmployeeUserDTO,
  EmployeeUserResponseDTO,
} from "../../../types/api/EmployeeTypes";
import { SkillDTO, SkillResponseDTO } from "../../../types/api/SkillTypes";

type CreatePostingBasicInfoProps = { navigateToNext: () => void };
type GraphQLTypeName = { __typename: string };
type Option = { id: string; name: string };

const BRANCHES_SKILLS_EMPLOYEES = gql`
  query CreatePostingBasicInfo_BranchesSkillsEmployees {
    branches {
      id
      name
    }
    skills {
      id
      name
    }
    employeeUsers {
      id
      firstName
      lastName
      email
      phoneNumber
      branchId
    }
  }
`;

const ERROR_MESSAGE_HEIGHT = "35px";

const CreatePostingBasicInfo: React.FC<CreatePostingBasicInfoProps> = ({
  navigateToNext,
}: CreatePostingBasicInfoProps): React.ReactElement => {
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  // #region state variables
  const [branchOptions, setBranchOptions] = useState<Option[]>([]);
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeUserDTO[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    undefined,
  );
  const [numVolunteers, setNumVolunteers] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [autoClosingDate, setAutoClosingDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const [branchError, setBranchError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [autoClosingDateError, setAutoClosingDateError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [skillsError, setSkillsError] = useState(false);
  const [employeesError, setEmployeesError] = useState(false);
  // #endregion

  // #region GraphQL query
  useQuery(BRANCHES_SKILLS_EMPLOYEES, {
    fetchPolicy: "cache-and-network",
    onCompleted: ({ branches, skills, employeeUsers }) => {
      setBranchOptions(
        branches.map((branch: BranchResponseDTO & GraphQLTypeName) => ({
          id: branch.id,
          name: branch.name,
        })),
      );
      setSkillOptions(
        skills.map((skill: SkillResponseDTO & GraphQLTypeName) => ({
          id: skill.id,
          name: skill.name,
        })),
      );
      setEmployeeOptions(
        employeeUsers.map(
          (employee: EmployeeUserResponseDTO & GraphQLTypeName) => {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            const { __typename, ...rest } = employee;
            return rest;
          },
        ),
      );
    },
  });
  // #endregion

  const getOptionNameFromId = (options: Option[], id: string): string => {
    const option = options.find((opt) => opt.id === id);
    if (!option) {
      throw new Error(`Option with id = ${id} not found.`);
    }
    return option.name;
  };

  const getEmployeeInfoFromId = (
    options: EmployeeUserDTO[],
    id: string,
  ): EmployeeUserDTO => {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const employee = options.find((option) => option.id === id);
    if (!employee) {
      throw new Error(`Employee with id = ${id} not found.`);
    }
    return employee;
  };

  // #region posting update dispatchers
  const addBranch = (branchId: string): void => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_BRANCH",
      value: {
        id: branchId,
        name: getOptionNameFromId(branchOptions, branchId),
      } as BranchDTO,
    });
  };

  const addNumVolunteers = (num: number) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_NUM_VOLUNTEERS",
      value: num,
    });
  };

  const addTitle = (t: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_TITLE",
      value: t,
    });
  };

  const addAutoClosingDate = (date: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_AUTO_CLOSING_DATE",
      value: date,
    });
  };

  const addDescription = (desc: string) => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_DESCRIPTION",
      value: desc,
    });
  };

  const addSkills = (skillIds: string[]): void => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_SKILLS",
      value: skillIds.map(
        (skillId) =>
          ({
            id: skillId,
            name: getOptionNameFromId(skillOptions, skillId),
          } as SkillDTO),
      ),
    });
  };

  const addEmployees = (employeeIds: string[]): void => {
    dispatchPostingUpdate({
      type: "ADMIN_POSTING_EDIT_EMPLOYEES",
      value: employeeIds.map((employeeId) =>
        getEmployeeInfoFromId(employeeOptions, employeeId),
      ),
    });
  };
  // #endregion

  // #region event handlers
  const handleSkillAddition = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const skillId = e.target.value;
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    // reset to placeholder
    e.target.value = "";
  };

  const handleSkillRemoval = (skillIdToRemove: string): void => {
    setSelectedSkills(
      selectedSkills.filter((skillId) => skillId !== skillIdToRemove),
    );
  };

  const handleEmployeeAddition = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    const employeeId = e.target.value;
    if (employeeId && !selectedEmployees.includes(employeeId)) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
    // reset to placeholder
    e.target.value = "";
  };

  const handleEmployeeRemoval = (employeeIdToRemove: string): void => {
    setSelectedEmployees(
      selectedEmployees.filter(
        (employeeId) => employeeId !== employeeIdToRemove,
      ),
    );
  };

  const handleNext = () => {
    setBranchError(!selectedBranch);
    setTitleError(!title);
    setAutoClosingDateError(!autoClosingDate);
    setDescriptionError(!description);
    setSkillsError(selectedSkills.length < 1);
    setEmployeesError(selectedEmployees.length < 1);

    if (
      selectedBranch &&
      title &&
      autoClosingDate &&
      description &&
      selectedSkills &&
      selectedEmployees
    ) {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      addBranch(selectedBranch!);
      addNumVolunteers(numVolunteers);
      addTitle(title);
      addAutoClosingDate(autoClosingDate);
      addDescription(description);
      addSkills(selectedSkills);
      addEmployees(selectedEmployees);
      navigateToNext();
    }
  };
  // #endregion

  // #region element
  return (
    <Flex p={10}>
      <VStack spacing={5} alignItems="flex-start">
        <FormHeader symbol="1" title="Basic Info" />
        <VStack w="full" spacing={5} alignItems="flex-end">
          <VStack w="full" spacing={9} alignItems="flex-start" px={2}>
            <Text textStyle="caption">
              {ADMIN_POSTING_CREATE_BASIC_INFO_ENTER_ALL_DETAILS}
            </Text>
            <HStack spacing={7} w="full">
              <FormControl isRequired isInvalid={branchError}>
                <FormLabel textStyle="body-regular">Branch</FormLabel>
                <Select
                  placeholder="Select option"
                  size="sm"
                  value={selectedBranch}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedBranch(e.target.value)
                  }
                >
                  {branchOptions.map(({ id, name }) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Please select a branch.</FormErrorMessage>
              </FormControl>
              <FormControl isRequired>
                <FormLabel textStyle="body-regular">
                  Total Number of Volunteers
                </FormLabel>
                <NumberInput
                  size="sm"
                  mb={branchError ? ERROR_MESSAGE_HEIGHT : "0px"}
                  value={numVolunteers}
                  min={1}
                  onChange={(_valueAsString, valueAsNumber) =>
                    setNumVolunteers(valueAsNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>
            <HStack spacing={7} w="full">
              <FormControl isRequired isInvalid={titleError}>
                <FormLabel textStyle="body-regular">Role Title</FormLabel>
                <Input
                  placeholder="e.g. Yoga Instructor"
                  size="sm"
                  mb={
                    !titleError && autoClosingDateError
                      ? ERROR_MESSAGE_HEIGHT
                      : "0px"
                  }
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                />
                <FormErrorMessage>Please enter role title.</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={autoClosingDateError}>
                <HStack>
                  <FormLabel textStyle="body-regular" mr={0}>
                    Posting Closing Date
                  </FormLabel>
                  <Tooltip
                    label={ADMIN_POSTING_CREATE_BASIC_INFO_CLOSING_DATE_TOOLTIP}
                    fontSize="sm"
                    placement="right-end"
                    color="text.default"
                    bg="background.light"
                  >
                    <QuestionOutlineIcon
                      boxSize="15px"
                      mb="0.5rem !important"
                      color="#ADADAD"
                    />
                  </Tooltip>
                </HStack>
                <Input
                  size="sm"
                  type="date"
                  mb={
                    !autoClosingDateError && titleError
                      ? ERROR_MESSAGE_HEIGHT
                      : "0px"
                  }
                  value={autoClosingDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAutoClosingDate(e.target.value)
                  }
                />
                <FormErrorMessage>Please enter a date.</FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl isRequired isInvalid={descriptionError}>
              <FormLabel textStyle="body-regular">Role Description</FormLabel>
              {/* TODO: replace with RichTextField from Draft.js */}
              <Textarea
                placeholder={
                  ADMIN_POSTING_CREATE_BASIC_INFO_ROLE_DESCRIPTION_PLACEHOLDER
                }
                size="sm"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
              />
              <FormErrorMessage>
                Please enter role description.
              </FormErrorMessage>
            </FormControl>
            <HStack spacing={7} w="full">
              <FormControl isRequired isInvalid={skillsError}>
                <HStack>
                  <FormLabel textStyle="body-regular" mr={0}>
                    Relevant Skills
                  </FormLabel>
                  <Tooltip
                    label={ADMIN_POSTING_CREATE_BASIC_INFO_SKILLS_TOOLTIP}
                    fontSize="sm"
                    placement="right-end"
                    color="text.default"
                    bg="background.light"
                  >
                    <QuestionOutlineIcon
                      boxSize="15px"
                      mb="0.5rem !important"
                      color="#ADADAD"
                    />
                  </Tooltip>
                </HStack>
                <Select
                  placeholder="Select option"
                  size="sm"
                  onChange={handleSkillAddition}
                >
                  {skillOptions.map(({ id, name }) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  Please select at least one skill.
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel textStyle="body-regular">Selected Skills</FormLabel>
                <HStack
                  spacing={4}
                  minHeight="32px"
                  wrap="wrap"
                  mb={skillsError ? ERROR_MESSAGE_HEIGHT : "0px"}
                >
                  {selectedSkills.map((skillId) => (
                    <Tag variant="brand" height="32px" key={skillId}>
                      <TagLabel>
                        {getOptionNameFromId(skillOptions, skillId)}
                      </TagLabel>
                      <TagCloseButton
                        onClick={() => handleSkillRemoval(skillId)}
                      />
                    </Tag>
                  ))}
                </HStack>
              </FormControl>
            </HStack>
            <HStack spacing={7} w="full">
              <FormControl isRequired isInvalid={employeesError}>
                <FormLabel textStyle="body-regular">Point of Contact</FormLabel>
                <Select
                  placeholder="Select option"
                  size="sm"
                  onChange={handleEmployeeAddition}
                >
                  {employeeOptions.map(({ id, firstName, lastName }) => (
                    <option value={id} key={id}>
                      {`${firstName} ${lastName}`}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  Please select at least one contact.
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel textStyle="body-regular">
                  Appointed Contacts
                </FormLabel>
                <HStack
                  spacing={4}
                  minHeight="32px"
                  wrap="wrap"
                  mb={employeesError ? ERROR_MESSAGE_HEIGHT : "0px"}
                >
                  {selectedEmployees.map((employeeId) => (
                    <Tag variant="brand" height="32px" key={employeeId}>
                      <Avatar size="xs" mr={1} bg="violet" />
                      <TagLabel>
                        {getOptionNameFromId(
                          employeeOptions.map(
                            ({ id, firstName, lastName }) => ({
                              id,
                              name: `${firstName} ${lastName}`,
                            }),
                          ),
                          employeeId,
                        )}
                      </TagLabel>
                      <TagCloseButton
                        onClick={() => handleEmployeeRemoval(employeeId)}
                      />
                    </Tag>
                  ))}
                </HStack>
              </FormControl>
            </HStack>
          </VStack>
          <Divider mt="104px !important" mb="18px" />
          <Button onClick={handleNext}>Next</Button>
        </VStack>
      </VStack>
    </Flex>
  );
  // #endregion
};

export default CreatePostingBasicInfo;
