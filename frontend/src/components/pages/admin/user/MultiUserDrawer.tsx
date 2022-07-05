import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { BranchResponseDTO } from "../../../../types/api/BranchTypes";
import BranchSelector from "./MultiBranchSelector";

type ProfileDrawerProps = {
  isOpen: boolean;
  branches: BranchResponseDTO[];
  selectedBranches: BranchResponseDTO[];
  onClose: () => void;
  handleBranchMenuItemClicked: (item: BranchResponseDTO) => void;
};

const MultiUserDrawer = ({
  isOpen,
  branches,
  selectedBranches,
  onClose,
  handleBranchMenuItemClicked,
}: ProfileDrawerProps): React.ReactElement => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>[#] User(s) Selected</DrawerHeader>
        <DrawerBody>
          <BranchSelector
            branches={branches}
            selectedBranches={selectedBranches}
            handleBranchMenuItemClicked={handleBranchMenuItemClicked}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MultiUserDrawer;
