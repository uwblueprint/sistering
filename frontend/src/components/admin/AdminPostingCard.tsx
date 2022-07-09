import React from "react";
import { CalendarIcon } from "@chakra-ui/icons";
import { BsPeopleFill, BsThreeDots } from "react-icons/bs";
import {
  Text,
  Box,
  VStack,
  HStack,
  Divider,
  Button,
  Tag,
  Icon,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { formatDateStringYear } from "../../utils/DateTimeUtils";
import { Role } from "../../types/AuthTypes";
import DeleteModal from "./DeleteModal";

export enum PostingStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  UNSCHEDULED = "UNSCHEDULED",
  PAST = "PAST",
}

type AdminPostingCardProps = {
  status: PostingStatus;
  id: string;
  role: Role;
  title: string;
  startDate: string;
  endDate: string;
  autoClosingDate: string;
  branchName: string;
  numVolunteers: number;
  navigateToAdminSchedule?: () => void;
};

const AdminPostingCard = ({
  status,
  id,
  role,
  title,
  startDate,
  endDate,
  autoClosingDate,
  branchName,
  numVolunteers,
  navigateToAdminSchedule,
}: AdminPostingCardProps): React.ReactElement => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <>
      <DeleteModal
        title="Delete Posting?"
        isOpen={isDeleteModalOpen}
        body={`Are you sure you want to delete "${title}"?`}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          // TODO: delete posting
          setIsDeleteModalOpen(false);
        }}
      />
      <Box
        bg="white"
        borderRadius="8px"
        border="2px solid"
        borderColor="background.dark"
        id={id}
      >
        <VStack p={8} align="start" spacing="12px" textAlign="left">
          <HStack w="full" justifyContent="space-between">
            <Tag>{branchName}</Tag>
            {role === Role.Admin && (
              <Menu placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<Icon as={BsThreeDots} w={6} />}
                  variant="unstyled"
                />
                <MenuList shadow="md">
                  <MenuItem>Edit</MenuItem>
                  <MenuItem>Make a copy</MenuItem>
                  <MenuItem onClick={() => setIsDeleteModalOpen(true)}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
          <Text noOfLines={1} textStyle="heading">
            {status === PostingStatus.DRAFT && (
              <Box as="span" mr={1} color="red">
                [DRAFT]
              </Box>
            )}
            {title}
          </Text>
          <HStack spacing={4}>
            <Box textStyle="caption">
              <CalendarIcon w={6} pr={2} />
              {(startDate && endDate) || status === PostingStatus.DRAFT
                ? `${formatDateStringYear(startDate)} - ${formatDateStringYear(
                    endDate,
                  )}`
                : "No date(s) selected"}
            </Box>
          </HStack>
          <HStack>
            <Box textStyle="caption">
              <Icon as={BsPeopleFill} w={6} pr={2} />
              {status === PostingStatus.DRAFT
                ? "Not accepting registrants"
                : `${numVolunteers} volunteers`}
            </Box>
          </HStack>
          <Box w="100%" h="100%" mt="16px !important" mb="4px !important">
            <Divider />
          </Box>
          <HStack justifyContent="space-between" w="100%">
            <Text textStyle="caption" color="text.gray">
              Deadline:{" "}
              {status === PostingStatus.PAST ? (
                <Box as="span" color="red">
                  Closed
                </Box>
              ) : (
                formatDateStringYear(autoClosingDate)
              )}
            </Text>
            {status === PostingStatus.DRAFT ||
            status === PostingStatus.UNSCHEDULED ? (
              <Button
                variant="ghost"
                disabled={
                  status === PostingStatus.DRAFT
                } /* TODO: Link to review registrants page */
              >
                Review Registrants
              </Button>
            ) : (
              <Button variant="ghost" onClick={navigateToAdminSchedule}>
                View Schedule
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default AdminPostingCard;
