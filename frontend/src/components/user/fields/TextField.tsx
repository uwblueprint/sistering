import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Flex, FormControl, FormLabel, Input, Tooltip } from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";

type TextFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  tooltip?: React.ReactElement;
  isRequired?: boolean;
};

const TextField = ({
  id,
  label,
  placeholder,
  type = "text",
  tooltip,
  isRequired = false,
}: TextFieldProps): React.ReactElement => {
  return (
    <FormControl isRequired={isRequired}>
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
        as={Input}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
      />
    </FormControl>
  );
};

export default TextField;
