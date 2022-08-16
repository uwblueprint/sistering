import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  HStack,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import BranchManagerTable from "./BranchManagerTable";
import SkillsManagerTable from "./SkillsManagerTable";
import EditModal from "./EditModal";
import {
  BranchQueryResponse,
  BranchResponseDTO,
} from "../../types/api/BranchTypes";
import {
  SkillQueryResponse,
  SkillResponseDTO,
} from "../../types/api/SkillTypes";

enum SettingManagerTab {
  Branch,
  Skill,
}

type SettingManagerModalProps = {
  isOpen: boolean;
  onClose(): void;
};

const BRANCHES = gql`
  query SettingManagerModal_Branches {
    branches {
      id
      name
    }
  }
`;

const CREATE_BRANCH = gql`
  mutation SettingManagerModal_CreateBranch($branch: BranchRequestDTO!) {
    createBranch(branch: $branch) {
      id
    }
  }
`;

const SKILLS = gql`
  query SettingManagerModal_Skills {
    skills {
      id
      name
    }
  }
`;

const CREATE_SKILL = gql`
  mutation SettingManagerModal_CreateSkill($skill: SkillRequestDTO!) {
    createSkill(skill: $skill) {
      id
    }
  }
`;

const SettingManagerModal = ({
  isOpen,
  onClose,
}: SettingManagerModalProps): React.ReactElement => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useBoolean(false);
  const [selectedTab, setSelectedTab] = useState<SettingManagerTab>(
    SettingManagerTab.Branch,
  );

  const [currentBranches, setCurrentBranches] = useState<BranchResponseDTO[]>(
    [],
  );
  const [currentSkills, setCurrentSkills] = useState<SkillResponseDTO[]>([]);
  const [createBranch] = useMutation(CREATE_BRANCH, {
    refetchQueries: [{ query: BRANCHES }, "AdminHomepageHeader_Branches"],
  });
  const [createSkill] = useMutation(CREATE_SKILL, {
    refetchQueries: [{ query: SKILLS }],
  });

  const toast = useToast();

  const handleBranchSkillCreate = async (branchOrSkillName: string) => {
    try {
      if (selectedTab === SettingManagerTab.Branch) {
        await createBranch({
          variables: {
            branch: { name: branchOrSkillName },
          },
        });
      } else if (selectedTab === SettingManagerTab.Skill) {
        await createSkill({
          variables: {
            skill: { name: branchOrSkillName },
          },
        });
      }
    } catch (error: unknown) {
      toast({
        title: `Cannot create ${selectedTab}`,
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useQuery<BranchQueryResponse>(BRANCHES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setCurrentBranches(data.branches);
    },
  });

  useQuery<SkillQueryResponse>(SKILLS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setCurrentSkills(data.skills);
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="1000px" h="700px" py="50px" px="70px">
          <ModalCloseButton />
          <ModalBody overflow="auto">
            <Tabs>
              <HStack alignItems="flex-start">
                <TabList mb="40px">
                  <Tab
                    fontSize="24px"
                    onClick={() => setSelectedTab(SettingManagerTab.Branch)}
                  >
                    Branch
                  </Tab>
                  <Tab
                    fontSize="24px"
                    onClick={() => setSelectedTab(SettingManagerTab.Skill)}
                  >
                    Skills
                  </Tab>
                </TabList>
                <Spacer />
                <Button onClick={setIsCreateModalOpen.on}>
                  <EditModal
                    title={`Add a ${SettingManagerTab[selectedTab]}`}
                    isOpen={isCreateModalOpen}
                    content=""
                    onClose={setIsCreateModalOpen.off}
                    onEdit={handleBranchSkillCreate}
                  />
                  <AddIcon boxSize={3} mr={3} />
                  Add a {SettingManagerTab[selectedTab]}
                </Button>
              </HStack>
              <TabPanels>
                <TabPanel p={0}>
                  <BranchManagerTable branches={currentBranches} />
                </TabPanel>
                <TabPanel p={0}>
                  <SkillsManagerTable skills={currentSkills} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingManagerModal;
