import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Tag,
  IconButton,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { SkillResponseDTO } from "../../types/api/SkillTypes";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

type SkillManagerTableProps = {
  skills: SkillResponseDTO[];
};

const UPDATE_SKILL = gql`
  mutation BranchManagerTable_UpdateSkill($id: ID!, $skill: SkillRequestDTO!) {
    updateSkill(id: $id, skill: $skill) {
      id
    }
  }
`;

const DELETE_SKILL = gql`
  mutation BranchManagerTable_DeleteSkill($id: ID!) {
    deleteSkill(id: $id)
  }
`;

const SkillsManagerTable = ({
  skills,
}: SkillManagerTableProps): React.ReactElement => {
  const [isEditModalOpen, setIsEditModalOpen] = useBoolean(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useBoolean(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillResponseDTO | null>(
    null,
  );

  const toast = useToast();
  const [updateSkill] = useMutation(UPDATE_SKILL, {
    refetchQueries: ["BranchManagerModal_Skills"],
  });

  const [deleteSkill] = useMutation(DELETE_SKILL, {
    refetchQueries: ["BranchManagerModal_Skills"],
  });

  const handleSkillUpdate = async (skillName: string) => {
    if (selectedSkill) {
      try {
        await updateSkill({
          variables: {
            id: selectedSkill.id,
            skill: { name: skillName },
          },
        });
      } catch (error: unknown) {
        toast({
          title: "Cannot update skill",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const handleSkillDelete = async () => {
    if (selectedSkill) {
      try {
        await deleteSkill({
          variables: {
            id: selectedSkill.id,
          },
        });
      } catch (error: unknown) {
        toast({
          title: "Cannot delete skill",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <EditModal
        title="Edit Skill Name"
        isOpen={isEditModalOpen}
        content={selectedSkill ? selectedSkill.name : ""}
        onClose={() => {
          setIsEditModalOpen.off();
          setSelectedSkill(null);
        }}
        onEdit={handleSkillUpdate}
      />
      <DeleteModal
        title="Delete Skill?"
        isOpen={isDeleteModalOpen}
        body={`Are you sure you want to permanently delete the skill "${
          selectedSkill ? selectedSkill.name : ""
        }"?`}
        onClose={() => {
          setIsDeleteModalOpen.off();
          setSelectedSkill(null);
        }}
        onDelete={handleSkillDelete}
      />
      <TableContainer
        border="2px"
        borderRadius="12px"
        borderColor="background.dark"
      >
        <Table variant="brand">
          <Tbody>
            {skills.map((skill) => (
              <Tr key={Number(skill.id)}>
                <Td>
                  <Tag variant="brand">{skill.name}</Tag>
                </Td>
                <Td textAlign="end">
                  <IconButton
                    aria-label="Edit skill"
                    variant="ghost"
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    icon={<EditIcon color="text.default" boxSize="24px" />}
                    onClick={() => {
                      setIsEditModalOpen.on();
                      setSelectedSkill(skill);
                    }}
                  />
                  <IconButton
                    aria-label="Delete skill"
                    variant="ghost"
                    _hover={{
                      bg: "transparent",
                    }}
                    _active={{
                      bg: "transparent",
                    }}
                    icon={<DeleteIcon color="text.default" boxSize="24px" />}
                    onClick={() => {
                      setIsDeleteModalOpen.on();
                      setSelectedSkill(skill);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SkillsManagerTable;
