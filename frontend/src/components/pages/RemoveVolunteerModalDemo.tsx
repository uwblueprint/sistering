import {
  Button,
  Flex,
  Input,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import RemoveVolunteerModal from "../admin/RemoveVolunteerModal";

const RemoveVolunteerModalDemo = (): React.ReactElement => {
  const [name, setName] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      flexDir="column"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#F3F3F3"
    >
      <VStack width="400px" spacing={4}>
        <Text>Name</Text>
        <Input onChange={handleChange} placeholder="name" />
        <Button onClick={onOpen}>Remove</Button>
        <RemoveVolunteerModal name={name} isOpen={isOpen} onClose={onClose} />
      </VStack>
    </Flex>
  );
};

export default RemoveVolunteerModalDemo;
