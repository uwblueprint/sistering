import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  Tab,
  Button,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import BranchManagerModal from "./BranchManagerModal";
import {
  BranchResponseDTO,
  BranchQueryResponse,
} from "../../types/api/BranchTypes";

const BRANCHES = gql`
  query AdminHomepageHeader_Branches {
    branches {
      id
      name
    }
  }
`;

const AdminHomepageHeader = ({
  isSuperAdmin,
}: {
  isSuperAdmin: boolean;
}): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branches, setBranches] = useState<BranchResponseDTO[]>([]);

  useQuery<BranchQueryResponse>(BRANCHES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setBranches(data.branches);
    },
  });

  return (
    <>
      <BranchManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <VStack alignItems="flex-start" px="100px" pt="48px" spacing={0}>
        <HStack w="full" mb="16px">
          <Text textStyle="display-small-semibold">Volunteer Postings</Text>
          <Spacer />
          {isSuperAdmin && (
            <Button>
              <AddIcon boxSize={3} mr={3} />
              Create new posting
            </Button>
          )}
        </HStack>
        <HStack w="full" alignItems="flex-start" spacing={0}>
          <Tabs pt="10px">
            <TabList>
              {isSuperAdmin && (
                <Tab
                  _hover={{
                    borderColor: "currentColor",
                  }}
                  _selected={{
                    color: "violet",
                    borderColor: "currentColor",
                  }}
                  py="8px"
                >
                  Unscheduled (1)
                </Tab>
              )}
              <Tab
                _hover={{
                  borderColor: "currentColor",
                }}
                _selected={{
                  color: "violet",
                  borderColor: "currentColor",
                }}
                py="8px"
              >
                Scheduled (1)
              </Tab>
              <Tab
                _hover={{
                  borderColor: "currentColor",
                }}
                _selected={{
                  color: "violet",
                  borderColor: "currentColor",
                }}
                py="8px"
              >
                Past (1)
              </Tab>
              {isSuperAdmin && (
                <Tab
                  _hover={{
                    borderColor: "currentColor",
                  }}
                  _selected={{
                    color: "violet",
                    borderColor: "currentColor",
                  }}
                  py="8px"
                >
                  Drafts (1)
                </Tab>
              )}
            </TabList>
          </Tabs>
          <Spacer />
          <HStack>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input type="text" placeholder="Search" w="368px" />
            </InputGroup>
            <Select placeholder="All branches">
              {branches.map((branch) => (
                <option key={branch.id}>{branch.name}</option>
              ))}
            </Select>
            <IconButton
              aria-label="Settings"
              variant="ghost"
              _hover={{
                bg: "transparent",
              }}
              _active={{
                bg: "transparent",
              }}
              icon={<SettingsIcon color="text.default" boxSize={5} />}
              onClick={() => setIsModalOpen(true)}
            />
          </HStack>
        </HStack>
      </VStack>
    </>
  );
};

export default AdminHomepageHeader;
