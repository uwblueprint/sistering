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
import {
  PostingFilterStatus,
  PostingRecurrenceType,
} from "../../types/PostingTypes";

type AdminPostingCardProps = {
  status: PostingFilterStatus;
  id: string;
  role: Role;
  title: string;
  startDate: string;
  endDate: string;
  autoClosingDate: string;
  branchName: string;
  numVolunteers: number;
  type: PostingRecurrenceType;
  navigateToAdminSchedule?: () => void;
  navigateToEditPosting?: () => void;
  navigateToPostingDetails?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
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
  type,
  navigateToAdminSchedule,
  navigateToEditPosting,
  navigateToPostingDetails,
  onDuplicate,
  onDelete,
}: AdminPostingCardProps): React.ReactElement => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const getPostingDateRange = (): string => {
    if ((startDate && endDate) || status === PostingFilterStatus.DRAFT) {
      if (type === "OPPORTUNITY") {
        return `${formatDateStringYear(startDate)} - ${formatDateStringYear(
          endDate,
        )}`;
      }
      return formatDateStringYear(startDate);
    }
    return "No date(s) selected";
  };

  return (
    <>
      <DeleteModal
        title="Delete Posting?"
        isOpen={isDeleteModalOpen}
        body={`Are you sure you want to delete "${title}"?`}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          onDelete();
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
                  <MenuItem onClick={navigateToEditPosting}>Edit</MenuItem>
                  <MenuItem onClick={onDuplicate}>Make a copy</MenuItem>
                  <MenuItem onClick={() => setIsDeleteModalOpen(true)}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
          <Text
            noOfLines={1}
            textStyle="heading"
            cursor="pointer"
            onClick={navigateToPostingDetails}
          >
            {status === PostingFilterStatus.DRAFT && (
              <Box as="span" mr={1} color="red">
                [DRAFT]
              </Box>
            )}
            {title}
          </Text>
          <HStack spacing={4}>
            <Box textStyle="caption">
              <CalendarIcon w={6} pr={2} />
              {getPostingDateRange()}
            </Box>
          </HStack>
          <HStack>
            <Box textStyle="caption">
              <Icon as={BsPeopleFill} w={6} pr={2} />
              {status === PostingFilterStatus.DRAFT
                ? "Not accepting registrants"
                : `${numVolunteers} volunteer${numVolunteers !== 1 ? "s" : ""}`}
            </Box>
          </HStack>
          <Box w="100%" h="100%" mt="16px !important" mb="4px !important">
            <Divider />
          </Box>
          <HStack justifyContent="space-between" w="100%">
            <Text textStyle="caption" color="text.gray">
              Deadline:{" "}
              {status === PostingFilterStatus.PAST ? (
                <Box as="span" color="red">
                  Closed
                </Box>
              ) : (
                formatDateStringYear(autoClosingDate)
              )}
            </Text>
            {status === PostingFilterStatus.DRAFT ||
            status === PostingFilterStatus.UNSCHEDULED ? (
              <Button
                variant="ghost"
                disabled={status === PostingFilterStatus.DRAFT}
                onClick={navigateToAdminSchedule}
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
