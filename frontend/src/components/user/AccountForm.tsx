import { Formik, Field, Form } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  ListItem,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import moment from "moment";
import { SkillResponseDTO } from "../../types/api/SkillTypes";
import {
  CreateVolunteerDTO,
  CreateEmployeeDTO,
} from "../../types/api/UserType";

type AccountFormProps = {
  isAdmin: boolean; // False if user is a volunteer
  profilePhoto: string;
  onVolunteerCreate: (volunteer: CreateVolunteerDTO) => void;
  onEmployeeCreate: (employee: CreateEmployeeDTO) => void;
};

const TEST_SKILLS: SkillResponseDTO[] = [
  {
    id: "1",
    name: "CPR",
  },
  {
    id: "2",
    name: "First Aid",
  },
  {
    id: "3",
    name: "Cooking",
  },
];

interface AccountFormValues {
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
}

const AccountForm = ({
  isAdmin,
  profilePhoto,
  onVolunteerCreate,
  onEmployeeCreate,
}: AccountFormProps): React.ReactElement => {
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const toggleAgreeToTerms = (): void => {
    setAgreeToTerms(!agreeToTerms);
  };

  const selectSkill = (
    skill: string,
    currentSkills: SkillResponseDTO[],
    setFieldValue: (field: string, value: SkillResponseDTO[]) => void,
  ) => {
    // If the skill is not already selected, add it to the list of skills
    if (!currentSkills.some((s) => s.id === skill)) {
      const skillName = TEST_SKILLS.find((s) => s.id === skill)?.name || "";
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

  const initialValues: AccountFormValues = {
    profilePhoto: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    pronouns: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
    emergencyNumber: "",
    skills: [],
  };

  return (
    <Box my={12}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const formValues = {
            ...values,
            profilePhoto,
          };

          // eslint-disable-next-line no-console
          console.log(formValues);

          // If submitting form for admin, omit the skills field.

          // TODO: Handle form submission
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <SimpleGrid columns={2} spacing={10}>
              <FormControl>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Field
                  as={Input}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Field
                  as={Input}
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                <Field
                  as={Input}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
                <Field
                  as={Input}
                  id="pronouns"
                  name="pronouns"
                  type="text"
                  placeholder="She/Her, He/Him, They/Them, etc"
                />
              </FormControl>
              <FormControl isRequired>
                <Flex alignItems="center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Tooltip
                    placement="right"
                    label={
                      <UnorderedList>
                        <ListItem>At least 8 characters </ListItem>
                        <ListItem>At least one capital letter</ListItem>
                        <ListItem>At least one number </ListItem>
                        <ListItem>At least one special character</ListItem>
                      </UnorderedList>
                    }
                  >
                    <QuestionOutlineIcon mb={2} boxSize={3} color="gray.500" />
                  </Tooltip>
                </Flex>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="passwordConfirm">
                  Confirm Password
                </FormLabel>
                <Field
                  as={Input}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="Confirm Password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                <Field
                  as={Input}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="(123) 456-7890"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="emergencyNumber">
                  Emergency Contact Phone Number
                </FormLabel>
                <Field
                  as={Input}
                  id="emergencyNumber"
                  name="emergencyNumber"
                  type="tel"
                  placeholder="(123) 456-7890"
                />
              </FormControl>

              {/* Volunteer fields */}
              {!isAdmin && (
                <>
                  <FormControl>
                    <Flex alignItems="center">
                      <FormLabel htmlFor="password">Skills</FormLabel>
                      <Tooltip
                        placement="right"
                        label={<Text>Search and select skills you have.</Text>}
                      >
                        <QuestionOutlineIcon
                          mb={2}
                          boxSize={3}
                          color="gray.500"
                        />
                      </Tooltip>
                    </Flex>
                    <Field
                      as={Select}
                      id="skills"
                      name="skills"
                      placeholder="Select Skills"
                      value={0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        selectSkill(
                          e.target.value,
                          values.skills,
                          setFieldValue,
                        );
                      }}
                    >
                      {TEST_SKILLS.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </Field>
                  </FormControl>
                  <Flex direction="column">
                    <Text fontWeight="medium" mb={3}>
                      Selected Skills
                    </Text>
                    <Flex>
                      {values.skills.length > 0 ? (
                        values.skills.map((skill) => (
                          <Tag
                            variant="brand"
                            key={skill.id}
                            mr={3}
                            py={1}
                            px={3}
                          >
                            {skill.name}
                            <TagCloseButton
                              onClick={() =>
                                deselectSkill(
                                  skill.id,
                                  values.skills,
                                  setFieldValue,
                                )
                              }
                            />
                          </Tag>
                        ))
                      ) : (
                        <Text>No skills selected.</Text>
                      )}
                    </Flex>
                  </Flex>
                </>
              )}
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
              onClick={
                isAdmin
                  ? () =>
                      onEmployeeCreate({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: "email123@gmail.com",
                        phoneNumber: values.phoneNumber,
                        password: values.password,
                        branchId: 0,
                        title: "",
                      })
                  : () =>
                      onVolunteerCreate({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: "johndoe@uwblueprint.org",
                        password: values.password,
                        phoneNumber: values.phoneNumber,
                        hireDate: moment(new Date()).format("YYYY-MM-DD"),
                        dateOfBirth: values.dateOfBirth,
                        skills: values.skills.map((skill) => skill.id),
                        branches: [],
                      })
              }
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
