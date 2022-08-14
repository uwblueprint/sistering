import React from "react";
import {
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

type TagsPopoverProps = {
  header: string;
  variant: string;
  height?: string;
  displayLength: number;
  tags: React.ReactElement[];
};

const TagsPopover: React.FC<TagsPopoverProps> = ({
  header,
  tags,
  variant,
  height,
  displayLength,
}: TagsPopoverProps) => {
  return (
    <Popover trigger="hover" placement="top-end">
      <PopoverTrigger>
        <Tag variant={variant} mr={4}>
          +{tags.length - displayLength}
        </Tag>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{header}</PopoverHeader>
        <PopoverBody>{tags}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TagsPopover;
