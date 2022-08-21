import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Box,
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
import { LanguageResponseDTO } from "../../types/api/LanguageTypes";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

type LanguageManagerTableProps = {
  languages: LanguageResponseDTO[];
};

const UPDATE_SKILL = gql`
  mutation LanguageManagerTable_UpdateLanguage(
    $id: ID!
    $language: LanguageRequestDTO!
  ) {
    updateLanguage(id: $id, language: $language) {
      id
    }
  }
`;

const DELETE_SKILL = gql`
  mutation LanguageManagerTable_DeleteLanguage($id: ID!) {
    deleteLanguage(id: $id)
  }
`;

const LanguageManagerTable = ({
  languages,
}: LanguageManagerTableProps): React.ReactElement => {
  const [isEditModalOpen, setIsEditModalOpen] = useBoolean(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useBoolean(false);
  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState<LanguageResponseDTO | null>(null);

  const toast = useToast();
  const [updateLanguage] = useMutation(UPDATE_SKILL, {
    refetchQueries: ["SettingManagerModal_Languages"],
  });

  const [deleteLanguage] = useMutation(DELETE_SKILL, {
    refetchQueries: ["SettingManagerModal_Languages"],
  });

  const handleLanguageUpdate = async (languageName: string) => {
    if (selectedLanguage) {
      try {
        await updateLanguage({
          variables: {
            id: selectedLanguage.id,
            language: { name: languageName },
          },
        });
      } catch (error: unknown) {
        toast({
          title: "Cannot update language",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const handleLanguageDelete = async () => {
    if (selectedLanguage) {
      try {
        await deleteLanguage({
          variables: {
            id: selectedLanguage.id,
          },
        });
      } catch (error: unknown) {
        toast({
          title: "Cannot delete language",
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
        title="Edit Language Name"
        isOpen={isEditModalOpen}
        content={selectedLanguage ? selectedLanguage.name : ""}
        onClose={() => {
          setIsEditModalOpen.off();
          setSelectedLanguage(null);
        }}
        onEdit={handleLanguageUpdate}
      />
      <DeleteModal
        title="Delete Language?"
        isOpen={isDeleteModalOpen}
        body={`Are you sure you want to permanently delete the language "${
          selectedLanguage ? selectedLanguage.name : ""
        }"?`}
        onClose={() => {
          setIsDeleteModalOpen.off();
          setSelectedLanguage(null);
        }}
        onDelete={handleLanguageDelete}
      />
      <Box maxHeight="500px" overflow="auto">
        <TableContainer
          border="2px"
          borderRadius="12px"
          borderColor="background.dark"
        >
          <Table variant="brand">
            <Tbody>
              {languages.map((language) => (
                <Tr
                  key={Number(language.id)}
                  _last={{ td: { borderBottom: "none" } }}
                >
                  <Td>
                    <Tag variant="brand">{language.name}</Tag>
                  </Td>
                  <Td textAlign="end">
                    <IconButton
                      aria-label="Edit language"
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
                        setSelectedLanguage(language);
                      }}
                    />
                    <IconButton
                      aria-label="Delete language"
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
                        setSelectedLanguage(language);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default LanguageManagerTable;
