import { QuestionOutlineIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import TagsPopover from "../../common/TagsPopover";

export type Item = {
  id: string;
  name: string;
};

type SearchSelectorFieldProps = {
  id: string;
  label: string;
  values: Item[];
  options: Item[];
  addedValues: Set<string>;
  placeholder: string;
  tooltip?: React.ReactElement;
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
  onCreateNewOption: (name: string) => void;
  onDeleteNewOption: (name: string) => void;
  type?: string;
};

const SearchSelectorField = ({
  id,
  label,
  values,
  placeholder,
  options,
  addedValues,
  tooltip,
  onSelect,
  onDeselect,
  onCreateNewOption,
  onDeleteNewOption,
  type = "text",
}: SearchSelectorFieldProps): React.ReactElement => {
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const ref = useRef<HTMLInputElement>(null);

  const [focused, setFocused] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => {
    if (dropdownClicked) {
      ref.current?.focus();
      setDropdownClicked(false);
    } else {
      setFocused(false);
    }
  };

  const [textboxInput, setTextboxInput] = useState("");
  const textboxInputNormalized = textboxInput.toLowerCase().trim();

  // An array to display pre-existing and user-added values altogether, differentiating user-added values with an id of "-1"
  const currentAndAddedValues: Item[] = [
    ...values,
    ...Array.from(addedValues).map((valueName) => {
      return {
        id: "-1",
        name: valueName,
      };
    }),
  ];

  // An array to combine pre-existing options and user-added values altogether like above, used when displaying dropdown options
  const currentAndAddedOptions: Item[] = [
    ...Array.from(addedValues).map((valueName) => {
      return {
        id: "-1",
        name: valueName,
      };
    }),
    ...options,
  ];

  const handleDeleteValue = (value: Item) => {
    if (value.id === "-1") {
      onDeleteNewOption(value.name);
    } else {
      onDeselect(value.id);
    }
  };

  const isUniqueValue = !options.find(
    (item) => item.name.toLowerCase() === textboxInputNormalized.toLowerCase(),
  );

  return (
    <>
      <FormControl>
        {tooltip ? (
          <Flex alignItems="center">
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <Tooltip placement="right" label={tooltip}>
              <QuestionOutlineIcon mb={2} boxSize={3} color="gray.500" />
            </Tooltip>
          </Flex>
        ) : (
          <FormLabel htmlFor={id}>{label}</FormLabel>
        )}

        <InputGroup>
          <Input
            placeholder={placeholder}
            name={id}
            type={type}
            id={id}
            autoComplete="off"
            value={textboxInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTextboxInput(e.target.value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={ref}
          />
          <InputRightElement
            pointerEvents="none"
            fontSize="1.2em"
            /* eslint-disable-next-line react/no-children-prop */
            children={<ChevronDownIcon color="gray.500" />}
          />
        </InputGroup>

        {focused && (
          <Container
            position="absolute"
            bg="white"
            boxShadow="0px 5px 15px #aaaaaa"
            p={0}
            zIndex={1}
            borderRadius="10px"
            id="bruh"
          >
            <Container
              p={0}
              maxH="250px"
              overflowY="scroll"
              borderRadius={
                textboxInputNormalized && isUniqueValue
                  ? "10px 10px 0px 0px"
                  : "10px"
              }
            >
              {currentAndAddedOptions.map(
                (option) =>
                  option.name
                    .toLowerCase()
                    .includes(textboxInputNormalized) && (
                    <Box
                      key={option.id}
                      bg="white"
                      _hover={{ bg: "purple.100" }}
                      p={2}
                      pl={4}
                      cursor="pointer"
                      onMouseDown={() => {
                        setDropdownClicked(true);
                        if (option.id !== "-1") { // User-added values have an id of "-1" before submitting
                          onSelect(option.id);
                        }
                      }}
                    >
                      {option.name}
                    </Box>
                  ),
              )}
            </Container>

            {/* Ensure value does not already exist */}
            {textboxInputNormalized && isUniqueValue && (
              <Box
                bg="gray.200"
                _hover={{ bg: "gray.300" }}
                p={2}
                pl={4}
                textAlign="center"
                cursor="pointer"
                borderRadius="0px 0px 10px 10px"
                onMouseDown={() => {
                  setDropdownClicked(true);
                  onCreateNewOption(toTitleCase(textboxInputNormalized));
                  setTextboxInput("");
                }}
              >
                + Click to add &quot;{toTitleCase(textboxInputNormalized)}&quot;
              </Box>
            )}
          </Container>
        )}
      </FormControl>
      <Flex direction="column">
        <Text fontWeight="medium" mb={3}>
          Selected {label}
        </Text>
        <Flex wrap="wrap">
          {currentAndAddedValues.length > 0 ? (
            <>
              {currentAndAddedValues.slice(0, 3).map((value) => (
                <Tag variant="brand" key={value.name} mr={3} py={1} px={3}>
                  {value.name}
                  <TagCloseButton onClick={() => handleDeleteValue(value)} />
                </Tag>
              ))}
              {currentAndAddedValues.length > 3 && (
                <TagsPopover
                  variant="brand"
                  header={label}
                  displayLength={3}
                  tags={currentAndAddedValues.map((value) => (
                    <Tag
                      variant="brand"
                      key={value.name}
                      mr={3}
                      py={1}
                      mb={2}
                      px={3}
                    >
                      {value.name}
                      <TagCloseButton
                        onClick={() => handleDeleteValue(value)}
                      />
                    </Tag>
                  ))}
                />
              )}
            </>
          ) : (
            <Text>No {label.toLowerCase()} selected.</Text>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default SearchSelectorField;
