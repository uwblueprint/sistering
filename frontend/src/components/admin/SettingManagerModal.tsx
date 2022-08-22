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
import LanguageManagerTable from "./LanguageManagerTable";
import EditModal from "./EditModal";
import {
  BranchQueryResponse,
  BranchResponseDTO,
} from "../../types/api/BranchTypes";
import {
  SkillQueryResponse,
  SkillResponseDTO,
} from "../../types/api/SkillTypes";
import {
  LanguageQueryResponse,
  LanguageResponseDTO,
} from "../../types/api/LanguageTypes";

enum SettingManagerTab {
  Branch,
  Skill,
  Language,
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

const LANGUAGES = gql`
  query SettingManagerModal_Languages {
    languages {
      id
      name
    }
  }
`;
const CREATE_LANGUAGE = gql`
  mutation SettingManagerModal_CreateLanguage($language: LanguageRequestDTO!) {
    createLanguage(language: $language) {
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
  const [currentLanguages, setCurrentLanguages] = useState<
    LanguageResponseDTO[]
  >([]);
  const [createBranch] = useMutation(CREATE_BRANCH, {
    refetchQueries: [{ query: BRANCHES }, "AdminHomepageHeader_Branches"],
  });
  const [createSkill] = useMutation(CREATE_SKILL, {
    refetchQueries: [{ query: SKILLS }],
  });
  const [createLanguage] = useMutation(CREATE_LANGUAGE, {
    refetchQueries: [{ query: LANGUAGES }],
  });

  const toast = useToast();

  const handleCreate = async (name: string) => {
    try {
      if (selectedTab === SettingManagerTab.Branch) {
        await createBranch({
          variables: {
            branch: { name },
          },
        });
      } else if (selectedTab === SettingManagerTab.Skill) {
        await createSkill({
          variables: {
            skill: { name },
          },
        });
      } else if (selectedTab === SettingManagerTab.Language) {
        await createLanguage({
          variables: {
            language: { name },
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

  useQuery<LanguageQueryResponse>(LANGUAGES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setCurrentLanguages(data.languages);
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="1000px" h="700px" py="50px" px="70px">
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <HStack alignItems="flex-start">
                <TabList mb="40px">
                  <Tab
                    fontSize="24px"
                    onClick={() => setSelectedTab(SettingManagerTab.Branch)}
                  >
                    Branches
                  </Tab>
                  <Tab
                    fontSize="24px"
                    onClick={() => setSelectedTab(SettingManagerTab.Skill)}
                  >
                    Skills
                  </Tab>
                  <Tab
                    fontSize="24px"
                    onClick={() => setSelectedTab(SettingManagerTab.Language)}
                  >
                    Languages
                  </Tab>
                </TabList>
                <Spacer />
                <Button onClick={setIsCreateModalOpen.on}>
                  <EditModal
                    title={`Add a ${SettingManagerTab[selectedTab]}`}
                    isOpen={isCreateModalOpen}
                    content=""
                    onClose={setIsCreateModalOpen.off}
                    onEdit={handleCreate}
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
                <TabPanel p={0}>
                  <LanguageManagerTable languages={currentLanguages} />
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
