// Note: This ProfileDrawer is just to test UserManagementTableRow in ticket #453.
// Feel free to overwrite everything as needed.

import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import React from "react";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
};

const ProfileDrawer = ({
  isOpen,
  onClose,
  firstName,
  lastName,
}: ProfileDrawerProps): React.ReactElement => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          Sample user drawer for {firstName} {lastName}{" "}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileDrawer;
