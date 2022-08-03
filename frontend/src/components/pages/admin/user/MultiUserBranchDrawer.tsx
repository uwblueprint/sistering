import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";
import MultiUserBranchSelectAdder from "./MultiUserBranchSelectAdder";

type MultiUserBranchDrawerProps = {
  userEmails: string[];
  isOpen: boolean;
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  onClose: () => void;
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
};

const MultiUserBranchDrawer = ({
  userEmails,
  isOpen,
  branches,
  selectedBranches,
  onClose,
  handleBranchMenuItemClicked,
}: MultiUserBranchDrawerProps): React.ReactElement => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>{userEmails.length} User(s) Selected</DrawerHeader>
        <DrawerBody>
          <MultiUserBranchSelectAdder
            onSave={onClose}
            userEmails={userEmails}
            branches={branches}
            selectedBranches={selectedBranches}
            handleBranchMenuItemClicked={handleBranchMenuItemClicked}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MultiUserBranchDrawer;
