import React, { Dispatch, SetStateAction, useContext, useState } from "react";
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
import { useHistory } from "react-router-dom";
import BranchManagerModal from "./BranchManagerModal";
import {
  ADMIN_CREATE_POSTING_PAGE,
  ADMIN_ORG_WIDE_CALENDAR,
} from "../../constants/Routes";
import PostingContextDispatcherContext from "../../contexts/admin/PostingContextDispatcherContext";
import { BranchResponseDTO } from "../../types/api/BranchTypes";

type AdminHomepageHeaderProps = {
  isSuperAdmin: boolean;
  selectStatusTab: (index: number) => void;
  postingStatusNums: number[]; // [unscheduled, scheduled, past, drafts]
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  branches: BranchResponseDTO[];
  setBranchFilter: Dispatch<SetStateAction<BranchResponseDTO | undefined>>;
};

const AdminHomepageHeader = ({
  isSuperAdmin,
  selectStatusTab,
  postingStatusNums,
  searchFilter,
  setSearchFilter,
  branches,
  setBranchFilter,
}: AdminHomepageHeaderProps): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();
  const dispatchPostingUpdate = useContext(PostingContextDispatcherContext);

  return (
    <>
      {!isSuperAdmin ? undefined : (
        <BranchManagerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <VStack alignItems="flex-start" px="100px" pt="48px" spacing={0}>
        <HStack w="full" mb="16px">
          <Text textStyle="display-small-semibold">Volunteer Postings</Text>
          <Spacer />
          <HStack>
            <Button
              variant="outline"
              onClick={() => history.push(ADMIN_ORG_WIDE_CALENDAR)}
            >
              View Calendar
            </Button>
            {isSuperAdmin && (
              <Button
                onClick={() => {
                  dispatchPostingUpdate({ type: "ADMIN_POSTING_RESET" });
                  history.push(ADMIN_CREATE_POSTING_PAGE);
                }}
              >
                <AddIcon boxSize={3} mr={3} />
                Create new posting
              </Button>
            )}
          </HStack>
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
                  onClick={() => selectStatusTab(0)}
                >
                  Unscheduled ({postingStatusNums[0]})
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
                onClick={() => selectStatusTab(1)}
              >
                Scheduled ({postingStatusNums[1]})
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
                onClick={() => selectStatusTab(2)}
              >
                Past ({postingStatusNums[2]})
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
                  onClick={() => selectStatusTab(3)}
                >
                  Drafts ({postingStatusNums[3]})
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
              <Input
                type="text"
                placeholder="Search"
                w="368px"
                value={searchFilter}
                onChange={(event) => setSearchFilter(event.target.value)}
              />
            </InputGroup>
            {/* // TODO: This should actually filter  */}
            <Select
              placeholder="All branches"
              onChange={(event) =>
                setBranchFilter(
                  branches.find((branch) => branch.id === event.target.value),
                )
              }
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Select>
            {!isSuperAdmin ? undefined : (
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
            )}
          </HStack>
        </HStack>
      </VStack>
    </>
  );
};

export default AdminHomepageHeader;
