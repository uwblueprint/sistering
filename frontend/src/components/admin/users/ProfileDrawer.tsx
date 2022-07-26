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

import DeleteModal from "../DeleteModal";
import BranchSelector from "../../pages/admin/user/MultiBranchSelector";

import { BranchResponseDTO } from "../../../types/api/BranchTypes";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  pronouns: string;
  email: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  totalHours?: string;
  languages: string[];
  skills?: string[];
  isVolunteer?: boolean;
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
};

const ProfileDrawer = ({
  isOpen,
  onClose,
  firstName,
  lastName,
  pronouns,
  email,
  phoneNumber,
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactEmail,
  totalHours,
  languages,
  skills,
  isVolunteer,
  branches,
  selectedBranches,
  handleBranchMenuItemClicked,
}: ProfileDrawerProps): React.ReactElement => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <Box mt="2">
          <Box mx="6">
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
            <BranchSelector
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
                <Text>Email Address</Text>
                <Text>Phone Number</Text>
                <Text pb="70px">Emergency Contact</Text>
                {isVolunteer ? <Text>Total Hours</Text> : <></>}
                <Text>Language(s) Spoken</Text>
              </VStack>
              <VStack align="start" spacing="8px">
                <Text>{firstName}</Text>
                <Text>{lastName}</Text>
                <Text>{pronouns}</Text>
                <Text>{email}</Text>
                <Text>{phoneNumber}</Text>
                <Text>{emergencyContactName}</Text>
                <Text>{emergencyContactEmail}</Text>
                <Text>{emergencyContactPhone}</Text>
                {isVolunteer ? <Text>{totalHours}</Text> : <></>}
                <Text>{languages.join(", ")}</Text>
              </VStack>
            </HStack>
          </Box>
        </Box>
        <DrawerBody />
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
        title="insert title here"
        body="insert text here"
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => {}}
      />
    </Drawer>
  );
};

export default ProfileDrawer;
