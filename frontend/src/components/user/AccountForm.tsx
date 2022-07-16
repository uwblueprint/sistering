import { Formik, Form } from "formik";
import { gql, useQuery } from "@apollo/client";
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import moment from "moment";

import {
  SkillResponseDTO,
  SkillQueryResponse,
} from "../../types/api/SkillTypes";
import {
  CreateVolunteerDTO,
  CreateEmployeeDTO,
  LANGUAGES,
  EditVolunteerDTO,
  EditEmployeeDTO,
} from "../../types/api/UserType";
import TextField from "./fields/TextField";
import SelectorField from "./fields/SelectorField";
import { LanguageResponseDTO } from "../../types/api/LanguageTypes";

export enum AccountFormMode {
  CREATE,
  EDIT,
}

const SKILLS = gql`
  query BranchManagerModal_Skills {
    skills {
      id
      name
    }
  }
`;

type AccountFormProps = {
  mode: AccountFormMode;
  isAdmin: boolean; // False if user is a volunteer
  profilePhoto: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  pronouns?: string | null;
  phoneNumber?: string | null;
  emergencyNumber?: string | null;
  prevSkills?: SkillResponseDTO[];
  prevLanguages?: LanguageResponseDTO[];
  onEmployeeCreate?: (employee: CreateEmployeeDTO) => void;
  onVolunteerCreate?: (volunteer: CreateVolunteerDTO) => void;
  onEmployeeEdit?: (employee: EditEmployeeDTO) => void;
  onVolunteerEdit?: (volunteer: EditVolunteerDTO) => void;
};

type CreateAccountFormValues = {
  profilePhoto: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pronouns: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  emergencyNumber: string;
  skills: SkillResponseDTO[];
  languages: LanguageResponseDTO[];
};

type EditAccountFormValues = Omit<
  CreateAccountFormValues,
  "password" | "passwordConfirm"
>;

const AccountForm = ({
  mode,
  isAdmin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  profilePhoto, // TODO: Integrate Profile Picture into form submittion
  firstName,
  lastName,
  dateOfBirth,
  pronouns,
  phoneNumber,
  emergencyNumber,
  prevSkills,
  prevLanguages,
  onVolunteerCreate,
  onEmployeeCreate,
  onVolunteerEdit,
  onEmployeeEdit,
}: AccountFormProps): React.ReactElement => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [skills, setSkills] = useState<SkillResponseDTO[]>([]);
  const [languages, setLanguages] = useState<LanguageResponseDTO[]>([]);

  const createInitialValues: CreateAccountFormValues = {
    profilePhoto,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    pronouns: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    emergencyNumber: "",
    skills: [],
    languages: [],
  };

  const editInitialValues: EditAccountFormValues = {
    profilePhoto,
    firstName: firstName || "",
    lastName: lastName || "",
    dateOfBirth: dateOfBirth || "",
    pronouns: pronouns || "",
    phoneNumber: phoneNumber || "",
    emergencyNumber: emergencyNumber || "",
    skills: prevSkills || [],
    languages: prevLanguages || [],
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

  useEffect(() => {
    const newLanguages: LanguageResponseDTO[] = LANGUAGES.map(
      (language, i) => ({
        id: (i + 1).toString(),
        name: language,
      }),
    );
    setLanguages(newLanguages);
  }, []);

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

  const createAccount = (values: CreateAccountFormValues): void => {
    if (onVolunteerCreate && onEmployeeCreate) {
      if (isAdmin) {
        onEmployeeCreate({
          firstName: values.firstName,
          lastName: values.lastName,
          email: "email123@gmail.com",
          phoneNumber: values.phoneNumber,
          emergencyContactPhone: values.emergencyNumber,
          password: values.password,
          languages: values.languages.map((language) => language.id),
          branches: [],
        });
      } else {
        onVolunteerCreate({
          firstName: values.firstName,
          lastName: values.lastName,
          email: "johndoe@uwblueprint.org",
          password: values.password,
          phoneNumber: values.phoneNumber,
          emergencyContactPhone: values.emergencyNumber,
          hireDate: moment(new Date()).format("YYYY-MM-DD"),
          dateOfBirth: values.dateOfBirth,
          skills: values.skills.map((skill) => skill.id),
          languages: values.languages.map((language) => language.id),
          branches: [],
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
          email: "email123@gmail.com",
          phoneNumber: values.phoneNumber,
          emergencyContactPhone: values.emergencyNumber,
          languages: values.languages.map((language) => language.id),
          branches: [],
        });
      } else {
        onVolunteerEdit({
          firstName: values.firstName,
          lastName: values.lastName,
          email: "johndoe@uwblueprint.org",
          phoneNumber: values.phoneNumber,
          emergencyContactPhone: values.emergencyNumber,
          dateOfBirth: values.dateOfBirth,
          skills: values.skills.map((skill) => skill.id),
          languages: values.languages.map((language) => language.id),
          branches: [],
        });
      }
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
        onSubmit={
          mode === AccountFormMode.CREATE
            ? (values) => createAccount(values as CreateAccountFormValues)
            : (values) => editAccount(values as EditAccountFormValues)
        }
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
              <TextField
                id="emergencyNumber"
                label="Emergency Contact Phone Number"
                placeholder="(123) 456-7890"
                type="tel"
                isRequired
              />
              {/* Volunteer fields */}
              {!isAdmin && (
                <SelectorField
                  id="skills"
                  label="Skills"
                  values={values.skills}
                  options={skills}
                  placeholder="Select Skills"
                  tooltip={<Text>Search and select skills you have.</Text>}
                  onSelect={(skill) =>
                    selectSkill(skill, values.skills, setFieldValue)
                  }
                  onDeselect={(skill) =>
                    deselectSkill(skill, values.skills, setFieldValue)
                  }
                />
              )}
              <SelectorField
                id="languages"
                label="Languages"
                values={values.languages}
                options={languages}
                placeholder="Select Languages"
                tooltip={
                  <Text>Search and select languages you understand.</Text>
                }
                onSelect={(language) =>
                  selectLanguage(language, values.languages, setFieldValue)
                }
                onDeselect={(language) =>
                  deselectLanguage(language, values.languages, setFieldValue)
                }
              />
            </SimpleGrid>
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
            <Button
              mt={4}
              colorScheme="brand"
              isDisabled={!agreeToTerms}
              type="submit"
            >
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AccountForm;
