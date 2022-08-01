import { Box, Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { MdMoreHoriz } from "react-icons/md";
import React from "react";
import ProfileDrawer from "./ProfileDrawer";
import { BranchResponseDTO } from "../../../types/api/BranchTypes";

type UserManagementTableProfileCellProps = {
  firstName: string;
  lastName: string;
  pronouns: string;
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
  // TODO: Replace param type
};

const UserManagementTableProfileCell = ({
  firstName,
  lastName,
  pronouns,
  email,
  phoneNumber,
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactEmail,
  languages,
  isVolunteer,
  skills,
  branches,
  selectedBranches,
  handleBranchMenuItemClicked,
}: UserManagementTableProfileCellProps): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Tooltip label="View details" placement="bottom-start">
        <Box as="span">
          <Icon
            as={MdMoreHoriz}
            w={6}
            h={6}
            onClick={onOpen}
            cursor="pointer"
          />
        </Box>
      </Tooltip>
      <ProfileDrawer
        isOpen={isOpen}
        onClose={onClose}
        firstName={firstName}
        lastName={lastName}
        pronouns={pronouns}
        email={email}
        phoneNumber={phoneNumber}
        emergencyContactName={emergencyContactName}
        emergencyContactPhone={emergencyContactPhone}
        emergencyContactEmail={emergencyContactEmail}
        languages={languages}
        skills={skills}
        isVolunteer={isVolunteer}
        branches={branches}
        selectedBranches={selectedBranches}
        handleBranchMenuItemClicked={handleBranchMenuItemClicked}
      />
    </>
  );
};

export default UserManagementTableProfileCell;
