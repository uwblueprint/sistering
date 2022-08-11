// Note: This ProfileDrawer is just to test UserManagementTableRow in ticket #453.
// Feel free to overwrite everything as needed.

import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  Button,
  Avatar,
  Text,
  Divider,
  Box,
  Tag,
  VStack,
  HStack,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import DeleteModal from "../DeleteModal";
import { BranchResponseDTO } from "../../../types/api/BranchTypes";
import MultiBranchSelector from "../../pages/admin/user/MultiBranchSelector";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  pronouns: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  languages: string[];
  skills?: string[];
  isVolunteer?: boolean;
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
};

const DELETE_VOLUNTEER_USER_BY_EMAIL = gql`
  mutation deleteVolunteerUserByEmail($email: String!) {
    deleteVolunteerUserByEmail(email: $email)
  }
`;

const DELETE_EMPLOYEE_USER_BY_EMAIL = gql`
  mutation deleteEmployeeUserByEmail($email: String!) {
    deleteEmployeeUserByEmail(email: $email)
  }
`;

const ProfileDrawer = ({
  isOpen,
  onClose,
  firstName,
  lastName,
  pronouns,
  dateOfBirth,
  email,
  phoneNumber,
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactEmail,
  languages,
  skills,
  isVolunteer,
  branches,
  selectedBranches,
  handleBranchMenuItemClicked,
}: ProfileDrawerProps): React.ReactElement => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteUserByEmail] = useMutation(
    isVolunteer
      ? DELETE_VOLUNTEER_USER_BY_EMAIL
      : DELETE_EMPLOYEE_USER_BY_EMAIL,
  );

  const onDeleteUser = async () => {
    await deleteUserByEmail({
      variables: {
        email,
      },
    });
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p={0}>
          <Box>
            <Box m="6">
              <Text mb="2" textStyle="heading">
                {firstName} {lastName}
              </Text>
              <Avatar size="lg" />
            </Box>
            <Divider my="2" />
            {isVolunteer ? (
              <>
                <Box mx="6">
                  <Text textStyle="body-bold" mb="2">
                    Skills
                  </Text>
                  <>
                    {skills?.map((skill) => (
                      <Tag variant="outline" key={skill} mb="10px" mr="10px">
                        {skill}
                      </Tag>
                    ))}
                  </>
                </Box>
                <Divider my="2" />
              </>
            ) : (
              <></>
            )}
            <Box mx="6">
              <MultiBranchSelector
                userEmail={email}
                branches={branches}
                selectedBranches={selectedBranches}
                handleBranchMenuItemClicked={handleBranchMenuItemClicked}
              />
            </Box>
            <Divider my="2" />
            <Box mx="6">
              <Text textStyle="body-bold" mb="2">
                Personal Information
              </Text>
              <HStack fontSize="14px" spacing="24px" align="start">
                <VStack fontWeight="600" align="start" spacing="8px">
                  <Text>First Name</Text>
                  <Text>Last Name</Text>
                  <Text>Pronouns</Text>
                  <Text>Date of Birth</Text>
                  <Text>Email Address</Text>
                  <Text>Phone Number</Text>
                  <Text pb="70px">Emergency Contact</Text>
                  <Text>Language(s) Spoken</Text>
                </VStack>
                <VStack align="start" spacing="8px">
                  <Text>{firstName}</Text>
                  <Text>{lastName}</Text>
                  <Text>{pronouns}</Text>
                  <Text>{dateOfBirth}</Text>
                  <Text>{email}</Text>
                  <Text>{phoneNumber}</Text>
                  <Text>{emergencyContactName}</Text>
                  <Text>{emergencyContactEmail}</Text>
                  <Text>{emergencyContactPhone}</Text>
                  <Text>{languages.join(", ")}</Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        </DrawerBody>
        <Divider />
        <DrawerFooter>
          {/* this button might be removed depending on reset pw flow */}
          <Button variant="outline" mr={3}>
            Reset password
          </Button>
          <Button colorScheme="red" onClick={() => setOpenDeleteModal(true)}>
            Remove user
          </Button>
        </DrawerFooter>
      </DrawerContent>
      <DeleteModal
        title="Remove User?"
        body="Are you sure you want to permanently remove this user? This action cannot be undone."
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => onDeleteUser()}
      />
    </Drawer>
  );
};

export default ProfileDrawer;
