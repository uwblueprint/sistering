import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";

export type Item = {
  id: string;
  name: string;
};

type SelectorFieldProps = {
  id: string;
  label: string;
  values: Item[];
  options: Item[];
  placeholder: string;
  tooltip?: React.ReactElement;
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
};

const SelectorField = ({
  id,
  label,
  values,
  placeholder,
  options,
  tooltip,
  onSelect,
  onDeselect,
}: SelectorFieldProps): React.ReactElement => {
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
        <Field
          as={Select}
          id={id}
          name={id}
          placeholder={placeholder}
          value={0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onSelect(e.target.value);
          }}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Field>
      </FormControl>
      <Flex direction="column">
        <Text fontWeight="medium" mb={3}>
          Selected {label}
        </Text>
        <Flex wrap="wrap">
          {values.length > 0 ? (
            values.map((value) => (
              <Tag variant="brand" key={value.id} mb={2} mr={3} py={1} px={3}>
                {value.name}
                <TagCloseButton onClick={() => onDeselect(value.id)} />
              </Tag>
            ))
          ) : (
            <Text>No {label.toLowerCase()} selected.</Text>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default SelectorField;
