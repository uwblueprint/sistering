import { Formik, Form } from "formik";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Link,
  ListItem,
  SimpleGrid,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import moment from "moment";

import { useHistory } from "react-router-dom";
import {
  SkillResponseDTO,
  SkillQueryResponse,
} from "../../types/api/SkillTypes";
import {
  CreateEmployeeUserDTO,
  CreateVolunteerUserDTO,
  UpdateEmployeeUserDTO,
  UpdateVolunteerUserDTO,
} from "../../types/api/UserType";
import {
  LanguageResponseDTO,
  LanguageQueryResponse,
} from "../../types/api/LanguageTypes";
import TextField from "./fields/TextField";
import SelectorField from "./fields/SelectorField";
import SearchSelectorField from "./fields/SearchSelectorField";

export enum AccountFormMode {
  CREATE,
  EDIT,
}

const SKILLS = gql`
  query AccountForm_Skills {
    skills {
      id
      name
    }
  }
`;

const CREATE_SKILL = gql`
  mutation AccountForm_CreateSkill($skill: SkillRequestDTO!) {
    createSkill(skill: $skill) {
      id
    }
  }
`;

const LANGUAGES = gql`
  query AccountForm_Languages {
    languages {
      id
      name
    }
  }
`;

const CREATE_LANGUAGE = gql`
  mutation AccountForm_CreateLanguage($language: LanguageRequestDTO!) {
    createLanguage(language: $language) {
      id
    }
  }
`;

type AccountFormProps = {
  mode: AccountFormMode;
  isAdmin: boolean; // False if user is a volunteer
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string | null;
  pronouns?: string | null;
  phoneNumber?: string | null;
  emergencyNumber?: string | null;
  emergencyName?: string | null;
  emergencyEmail?: string | null;
  prevSkills?: SkillResponseDTO[];
  prevLanguages?: LanguageResponseDTO[];
  onEmployeeCreate?: (employee: CreateEmployeeUserDTO) => void;
  onVolunteerCreate?: (volunteer: CreateVolunteerUserDTO) => void;
  onEmployeeEdit?: (employee: UpdateEmployeeUserDTO) => void;
  onVolunteerEdit?: (volunteer: UpdateVolunteerUserDTO) => void;
};

type CreateAccountFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pronouns: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  emergencyNumber: string;
  emergencyName: string;
  emergencyEmail: string;
  skills: SkillResponseDTO[];
  languages: LanguageResponseDTO[];
  token: string | null;
};

type EditAccountFormValues = Omit<
  CreateAccountFormValues,
  "password" | "passwordConfirm"
>;

const AccountForm = ({
  mode,
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  firstName,
  lastName,
  email,
  dateOfBirth,
  pronouns,
  phoneNumber,
  emergencyNumber,
  emergencyName,
  emergencyEmail,
  prevSkills,
  prevLanguages,
  onVolunteerCreate,
  onEmployeeCreate,
  onVolunteerEdit,
  onEmployeeEdit,
}: AccountFormProps): React.ReactElement => {
  const history = useHistory();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [skills, setSkills] = useState<SkillResponseDTO[]>([]);
  const [languages, setLanguages] = useState<LanguageResponseDTO[]>([]);

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const toast = useToast();

  const createInitialValues: CreateAccountFormValues = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    pronouns: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    emergencyNumber: "",
    emergencyName: "",
    emergencyEmail: "",
    skills: [],
    languages: [],
    token,
  };

  const editInitialValues: EditAccountFormValues = {
    firstName: firstName || "",
    lastName: lastName || "",
    dateOfBirth: dateOfBirth || "",
    pronouns: pronouns || "",
    phoneNumber: phoneNumber || "",
    emergencyName: emergencyName || "",
    emergencyEmail: emergencyEmail || "",
    emergencyNumber: emergencyNumber || "",
    skills: prevSkills || [],
    languages: prevLanguages || [],
    token,
  };

  const toggleAgreeToTerms = (): void => {
    setAgreeToTerms(!agreeToTerms);
  };

  useQuery<SkillQueryResponse>(SKILLS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setSkills(data.skills);
    },
  });

  useQuery<LanguageQueryResponse>(LANGUAGES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setLanguages(data.languages);
    },
  });

  const createAccount = (values: CreateAccountFormValues): void => {
    if (onVolunteerCreate && onEmployeeCreate) {
      if (isAdmin) {
        onEmployeeCreate({
          firstName: values.firstName,
          lastName: values.lastName,
          email,
          phoneNumber: values.phoneNumber,
          emergencyContactEmail: values.emergencyEmail,
          emergencyContactName: values.emergencyName,
          emergencyContactPhone: values.emergencyNumber,
          pronouns: values.pronouns,
          dateOfBirth: values.dateOfBirth,
          password: values.password,
          languages: values.languages.map((language) => language.id),
          branches: [],
          token: values.token,
        });
      } else {
        onVolunteerCreate({
          firstName: values.firstName,
          lastName: values.lastName,
          email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          pronouns: values.pronouns,
          emergencyContactEmail: values.emergencyEmail,
          emergencyContactName: values.emergencyName,
          emergencyContactPhone: values.emergencyNumber,
          hireDate: moment(new Date()).format("YYYY-MM-DD"),
          dateOfBirth: moment(values.dateOfBirth).format("YYYY-MM-DD"),
          skills: values.skills.map((skill) => skill.id),
          languages: values.languages.map((language) => language.id),
          branches: [],
          token: values.token,
        });
      }
    }
  };

  const editAccount = (values: EditAccountFormValues): void => {
    if (onVolunteerEdit && onEmployeeEdit) {
      if (isAdmin) {
        onEmployeeEdit({
          firstName: values.firstName,
          lastName: values.lastName,
          email,
          phoneNumber: values.phoneNumber,
          emergencyContactEmail: values.emergencyEmail,
          emergencyContactName: values.emergencyName,
          emergencyContactPhone: values.emergencyNumber,
          pronouns: values.pronouns,
          dateOfBirth: values.dateOfBirth,
          languages: values.languages.map((language) => language.id),
          branches: [],
        });
      } else {
        onVolunteerEdit({
          firstName: values.firstName,
          lastName: values.lastName,
          email,
          phoneNumber: values.phoneNumber,
          pronouns: values.pronouns,
          emergencyContactEmail: values.emergencyEmail,
          emergencyContactName: values.emergencyName,
          emergencyContactPhone: values.emergencyNumber,
          hireDate: moment(new Date()).format("YYYY-MM-DD"),
          dateOfBirth: moment(values.dateOfBirth).format("YYYY-MM-DD"),
          skills: values.skills.map((skill) => skill.id),
          languages: values.languages.map((language) => language.id),
          branches: [],
        });
      }
    }
  };

  const [createSkill] = useMutation(CREATE_SKILL, {
    refetchQueries: ["AccountForm_Skills"],
  });

  // A set to store skills (strings) added by the user
  const [addedSkills, setAddedSkills] = useState<Set<string>>(
    new Set<string>(),
  );
  const addNewSkill = (newSkill: string) => {
    setAddedSkills(new Set(addedSkills.add(newSkill)));
  };
  const deleteNewSkill = (newSkill: string) => {
    setAddedSkills(
      new Set(Array.from(addedSkills).filter((s) => s !== newSkill)),
    );
  };

  const selectSkill = (
    skill: string,
    currentSkills: SkillResponseDTO[],
    setFieldValue: (field: string, value: SkillResponseDTO[]) => void,
  ) => {
    // If the skill is not already selected, add it to the list of skills
    if (!currentSkills.some((s) => s.id === skill)) {
      const skillName = skills.find((s) => s.id === skill)?.name || "";
      setFieldValue("skills", [
        ...currentSkills,
        {
          id: skill,
          name: skillName,
        },
      ]);
    }
  };

  const deselectSkill = (
    skill: string,
    currentSkills: SkillResponseDTO[],
    setFieldValue: (field: string, value: SkillResponseDTO[]) => void,
  ) => {
    // Remove the skill from the list of skills
    setFieldValue(
      "skills",
      currentSkills.filter((s) => s.id !== skill),
    );
  };

  const handleAddSkillToDB = async (name: string) => {
    let createdSkill;
    try {
      createdSkill = await createSkill({
        variables: {
          skill: { name },
        },
      });
    } catch (error: unknown) {
      toast({
        title: `Cannot create skill`,
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    return createdSkill;
  };

  const [createLanguage] = useMutation(CREATE_LANGUAGE, {
    refetchQueries: ["AccountForm_Languages"],
  });

  // A set to store languages (strings) added by the user
  const [addedLanguages, setAddedLanguages] = useState<Set<string>>(
    new Set<string>(),
  );
  const addNewLanguage = (newLanguage: string) => {
    setAddedLanguages(new Set(addedLanguages.add(newLanguage)));
  };
  const deleteNewLanguage = (newLanguage: string) => {
    setAddedLanguages(
      new Set(Array.from(addedLanguages).filter((l) => l !== newLanguage)),
    );
  };

  const selectLanguage = (
    language: string,
    currentLanguages: LanguageResponseDTO[],
    setFieldValue: (field: string, value: LanguageResponseDTO[]) => void,
  ) => {
    // If the language is not already selected, add it to the list of languages
    if (!currentLanguages.some((l) => l.id === language)) {
      const languageName = languages.find((l) => l.id === language)?.name || "";
      setFieldValue("languages", [
        ...currentLanguages,
        {
          id: language,
          name: languageName,
        },
      ]);
    }
  };

  const deselectLanguage = (
    language: string,
    currentLanguages: LanguageResponseDTO[],
    setFieldValue: (field: string, value: LanguageResponseDTO[]) => void,
  ) => {
    // Remove the language from the list of languages
    setFieldValue(
      "languages",
      currentLanguages.filter((l) => l.id !== language),
    );
  };

  const handleAddLanguageToDB = async (name: string) => {
    let createdLanguage;
    try {
      createdLanguage = await createLanguage({
        variables: {
          language: { name },
        },
      });
    } catch (error: unknown) {
      toast({
        title: `Cannot create language`,
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    return createdLanguage;
  };

  const handleSubmit = async (
    values: CreateAccountFormValues | EditAccountFormValues,
  ) => {
    const newSkillsArr: string[] = Array.from(addedSkills);
    const newLanguagesArr: string[] = Array.from(addedLanguages);

    const newSkillsInDB: SkillResponseDTO[] = [];
    const newLanguagesInDB: LanguageResponseDTO[] = [];

    // Add all skills to DB
    for (let i = 0; i < newSkillsArr.length; i += 1) {
      /* eslint-disable-next-line no-await-in-loop */
      const newSkill = await handleAddSkillToDB(newSkillsArr[i]);
      newSkillsInDB.push({
        id: newSkill?.data.createSkill.id.toString(),
        name: newSkillsArr[i],
      });
    }

    // Add all languages to DB
    for (let i = 0; i < newLanguagesArr.length; i += 1) {
      /* eslint-disable-next-line no-await-in-loop */
      const newLanguage = await handleAddLanguageToDB(newLanguagesArr[i]);
      newLanguagesInDB.push({
        id: newLanguage?.data.createLanguage.id.toString(),
        name: newLanguagesArr[i],
      });
    }

    const valuesToBeSubmitted = {
      ...values,
      skills: [...values.skills, ...newSkillsInDB],
      languages: [...values.languages, ...newLanguagesInDB],
    };

    if (mode === AccountFormMode.CREATE) {
      createAccount(valuesToBeSubmitted as CreateAccountFormValues);
    } else {
      editAccount(valuesToBeSubmitted as EditAccountFormValues);
    }
  };

  return (
    <Box my={12}>
      <Formik
        initialValues={
          mode === AccountFormMode.CREATE
            ? createInitialValues
            : editInitialValues
        }
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <SimpleGrid columns={2} spacing={10}>
              <TextField
                id="firstName"
                label="First Name"
                placeholder="First Name"
              />
              <TextField
                id="lastName"
                label="Last Name"
                placeholder="Last Name"
                isRequired
              />
              <TextField
                id="dateOfBirth"
                label="Date of Birth"
                placeholder="Date of Birth"
                type="date"
                isRequired
              />
              <TextField
                id="pronouns"
                label="Pronouns"
                placeholder="She/Her, He/Him, They/Them, etc."
                isRequired
              />
              {mode === AccountFormMode.CREATE && (
                <>
                  <TextField
                    id="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    tooltip={
                      <UnorderedList>
                        <ListItem>At least 8 characters </ListItem>
                        <ListItem>At least one capital letter</ListItem>
                        <ListItem>At least one number </ListItem>
                        <ListItem>At least one special character</ListItem>
                      </UnorderedList>
                    }
                    isRequired
                  />
                  <TextField
                    id="passwordConfirm"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    type="password"
                    isRequired
                  />
                </>
              )}
              <TextField
                id="phoneNumber"
                label="Phone Number"
                placeholder="(123) 456-7890"
                type="tel"
                isRequired
              />
              {/* Volunteer fields */}
              <Box />
              {!isAdmin && (
                <SearchSelectorField
                  id="skills"
                  label="Skills"
                  values={values.skills}
                  options={skills}
                  addedValues={addedSkills}
                  placeholder="Add Skills"
                  tooltip={<Text>Search and select skills you have.</Text>}
                  onSelect={(skill) =>
                    selectSkill(skill, values.skills, setFieldValue)
                  }
                  onDeselect={(skill) =>
                    deselectSkill(skill, values.skills, setFieldValue)
                  }
                  onCreateNewOption={(newSkill) => addNewSkill(newSkill)}
                  onDeleteNewOption={(newSkill) => deleteNewSkill(newSkill)}
                />
              )}
              <SearchSelectorField
                id="languages"
                label="Languages"
                values={values.languages}
                options={languages}
                addedValues={addedLanguages}
                placeholder="Add Languages"
                tooltip={
                  <Text>Search and select languages you understand.</Text>
                }
                onSelect={(language) =>
                  selectLanguage(language, values.languages, setFieldValue)
                }
                onDeselect={(language) =>
                  deselectLanguage(language, values.languages, setFieldValue)
                }
                onCreateNewOption={(newLanguage) => addNewLanguage(newLanguage)}
                onDeleteNewOption={(newLanguage) =>
                  deleteNewLanguage(newLanguage)
                }
              />
              <TextField
                id="emergencyName"
                label="Emergency Contact Name"
                placeholder="First name"
                isRequired
              />
              <TextField
                id="emergencyNumber"
                label="Emergency Contact Phone Number"
                placeholder="(123) 456-7890"
                type="tel"
                isRequired
              />
              <TextField
                id="emergencyEmail"
                label="Emergency Contact Email"
                placeholder="name@gmail.com"
                isRequired
              />
            </SimpleGrid>
            {mode === AccountFormMode.CREATE && (
              <Flex mt={8}>
                <Checkbox onChange={() => toggleAgreeToTerms()}>
                  <Link
                    href="https://firebasestorage.googleapis.com/v0/b/sistering-dev.appspot.com/o/sistering-confidentiality-policy.pdf?alt=media&token=0ce8f2d1-6e6f-4ece-9a4f-5358790b5db6"
                    target="_blank"
                  >
                    I have read and agree to the terms and conditions&nbsp;
                  </Link>
                  <Box as="span" color="red">
                    *
                  </Box>
                </Checkbox>
              </Flex>
            )}
            <Flex mt={8}>
              {mode === AccountFormMode.EDIT && (
                <Button
                  mr={4}
                  colorScheme="gray"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </Button>
              )}
              <Button
                colorScheme="brand"
                isDisabled={mode === AccountFormMode.CREATE && !agreeToTerms}
                type="submit"
              >
                {mode === AccountFormMode.CREATE ? "Create" : "Save Changes"}
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AccountForm;
