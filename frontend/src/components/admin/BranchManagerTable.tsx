import React from "react";
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Tag,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { BranchResponseDTO } from "../../types/api/BranchTypes";

type BranchManagerTableProps = {
  branches: BranchResponseDTO[];
};

const BranchManagerTable = ({
  branches,
}: BranchManagerTableProps): React.ReactElement => {
  return (
    <TableContainer
      border="2px"
      borderRadius="12px"
      borderColor="background.dark"
    >
      <Table variant="brand">
        <Tbody>
          {branches.map((branch) => (
            <Tr key={Number(branch.id)}>
              <Td>
                <Tag>{branch.name}</Tag>
              </Td>
              <Td textAlign="end">
                <IconButton
                  aria-label="Edit branch"
                  variant="ghost"
                  _hover={{
                    bg: "transparent",
                  }}
                  _active={{
                    bg: "transparent",
                  }}
                  icon={<EditIcon color="text.default" boxSize="24px" />}
                />
                <IconButton
                  aria-label="Delete branch"
                  variant="ghost"
                  _hover={{
                    bg: "transparent",
                  }}
                  _active={{
                    bg: "transparent",
                  }}
                  icon={<DeleteIcon color="text.default" boxSize="24px" />}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BranchManagerTable;
