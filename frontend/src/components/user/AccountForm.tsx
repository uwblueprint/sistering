import { Formik, Field, Form } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { SkillResponseDTO } from "../../types/api/SkillTypes";

type AccountFormProps = {
  isAdmin: boolean; // False if user is a volunteer
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

const AccountForm = ({ isAdmin }: AccountFormProps): React.ReactElement => {
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
          // eslint-disable-next-line no-console
          console.log(values);

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
                      <Flex direction="column" p={1}>
                        <Text>• At least 8 characters </Text>
                        <Text>• At least one capital letter</Text>
                        <Text>• At least one number </Text>
                        <Text>• At least one special character</Text>
                      </Flex>
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
                I have read and agree to the terms and conditions&nbsp;
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
