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
  tags: React.ReactElement[];
};

const TagsPopover: React.FC<TagsPopoverProps> = ({
  header,
  tags,
}: TagsPopoverProps) => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Tag variant="brand" height="32px">
          +{tags.length - 2}
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
