import { Formik, Field } from "formik";
import { FormControl, FormLabel, Input, SimpleGrid } from "@chakra-ui/react";
import React from "react";

const AccountForm = (): React.ReactElement => {
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        pronouns: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        emergencyNumber: "",
      }}
      onSubmit={(values) => {
        // eslint-disable-next-line no-console
        console.log(values);
      }}
    >
      <form>
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
            <Field as={Input} id="dateOfBirth" name="dateOfBirth" type="date" />
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
            <FormLabel htmlFor="password">Password</FormLabel>
            <Field
              as={Input}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
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
        </SimpleGrid>
      </form>
    </Formik>
  );
};

export default AccountForm;
