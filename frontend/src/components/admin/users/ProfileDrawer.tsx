import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

import React from "react";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileDrawer = ({
  isOpen,
  onClose,
}: ProfileDrawerProps): React.ReactElement => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>[Sample user drawer]</DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileDrawer;


