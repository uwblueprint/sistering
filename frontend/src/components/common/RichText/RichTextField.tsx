import {
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import React, { FunctionComponent, useState } from "react";
import {
  VStack,
  HStack,
  ButtonGroup,
  Select,
  Image,
  Divider,
  Box,
  Container,
  IconButton,
} from "@chakra-ui/react";
import "draft-js/dist/Draft.css";

import Bold from "../../../assets/RichTextField/B.svg";
import Italic from "../../../assets/RichTextField/I.svg";
import Underline from "../../../assets/RichTextField/U.svg";
import UnorderedList from "../../../assets/RichTextField/unordered-list.svg";
import OrderedList from "../../../assets/RichTextField/ordered-list.svg";
import fontSizeObject from "./fontSizeObject";

interface RichTextFieldProps {
  initialContent: string;
  /**
   * content in the stringified form of a ContentState (i.e. derived from using RichTextField)
   * this should not be reactive! (not updated onChange)
   * how to use: for editing pre-existing content (e.g. on editing a requestGroup's description),
   *             pass the previous description into initialContent
   */
  defaultText: string; // text to show if no content in input field
  onChangeText: (content: string) => void; // called with stringified form of current ContentState
  isErroneous: boolean; // for styling when the input is erroneous
}

const textSizes: { [id: string]: string } = {
  "Heading 1": "22",
  "Heading 2": "20",
  Body: "16",
  Caption: "14",
};

const textSizeMapping: { [id: string]: string } = {
  "Heading 1": "header-one",
  "Heading 2": "header-two",
  Body: "unstyled",
  Caption: "header-three",
};

const textStyleMapping: { [id: string]: string } = {
  "header-one": "Heading 1",
  "header-two": "Heading 2",
  unstyled: "Body",
  "header-three": "Caption",
  "unordered-list-item": "Body",
  "ordered-list-item": "Body",
};

const RichTextField: FunctionComponent<RichTextFieldProps> = (
  props: RichTextFieldProps,
) => {
  const { initialContent, defaultText, onChangeText, isErroneous } = props;
  const [editorState, setEditorState] = React.useState(
    initialContent
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(initialContent)),
        )
      : EditorState.createEmpty(),
  );
  const [showPlaceHolder, setShowPlaceHolder] = useState("block");
  /* eslint-disable no-nested-ternary */
  const editorBorderColor = isErroneous
    ? "red.500"
    : editorState.getSelection().getHasFocus()
    ? "blue.500"
    : "gray.200";
  const editorBorderWidth =
    isErroneous || editorState.getSelection().getHasFocus() ? "2.25px" : "1px";
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType();
  // text size associated with current block
  const textSize = textStyleMapping[blockType];
  // current inline textstyle
  const currentInlineStyle = editorState.getCurrentInlineStyle();

  const { hasCommandModifier } = KeyBindingUtil; // utility
  // for each key input, map keys to commands conditionally

  function onChange(state: EditorState) {
    onChangeText(JSON.stringify(convertToRaw(state.getCurrentContent())));
    setEditorState(state);
    const contentState = state.getCurrentContent();
    // check whether to display placeholder
    if (!contentState.hasText()) {
      if (
        Object.values(textSizeMapping).includes(
          contentState.getBlockMap().first().getType(),
        )
      ) {
        setShowPlaceHolder("block");
      } else {
        setShowPlaceHolder("none");
      }
    }
  }

  function keyBindings(e: React.KeyboardEvent): string | null {
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getAnchorKey());

    // CTRL+B (or CMD+B on Mac)
    if (e.key === "b" && hasCommandModifier(e)) {
      return "bold";
    }

    // CTRL+I (or CMD+I on Mac)
    if (e.key === "i" && hasCommandModifier(e)) {
      return "italic";
    }

    // CTRL+U (or CMD+U on Mac)
    if (e.key === "u" && hasCommandModifier(e)) {
      return "underline";
    }

    // If we are entering a space " " that is the second character in the block and the first character is "-"
    // then make this block an unordered list if it is not already one
    if (
      e.key === " " &&
      selection.getAnchorOffset() === 1 &&
      block.getText().trim().charAt(0) === "-" &&
      block.getType() !== "unordered-list-item"
    ) {
      return "make-unordered-list";
    }

    // If we are entering a space " " that is the third character in the block and the first two characters are "1."
    // then make this block an ordered list if it is not already one
    if (
      e.key === " " &&
      selection.getAnchorOffset() === 2 &&
      block.getText().trim().substring(0, 2) === "1." &&
      block.getType() !== "ordered-list-item"
    ) {
      return "make-ordered-list";
    }

    // If we are hitting backspace on an empty block with styling, we want the block to be reset to default styling
    // E.g.: backspace on an empty unordered list removes the list, backspace once more then can remove the block
    if (
      e.key === "Backspace" &&
      block.getType() !== "unstyled" &&
      block.getText().length === 0
    ) {
      return "remove-block-styling";
    }

    return getDefaultKeyBinding(e); // standard input (e.g. typing "e" inputs "e" at cursor, backspace deletes char before cursor)
  }

  // NOTE: to simplify how this works, the logic for when each command comes into play
  //       is almost entirely in keyBindings
  function handleKeyCommand(command: string, state: EditorState) {
    const selection = state.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getAnchorKey());

    if (command === "bold") {
      // sets selection to 'BOLD' style, or if nothing is selected, the
      // internal style (for new input) is set to 'BOLD'
      onChange(RichUtils.toggleInlineStyle(state, "BOLD"));
      return "handled";
    }

    if (command === "italic") {
      // sets selection to 'ITALIC' style, or if nothing is selected, the
      // internal style (for new input) is set to 'ITALIC'
      onChange(RichUtils.toggleInlineStyle(state, "ITALIC"));
      return "handled";
    }

    if (command === "underline") {
      // sets selection to 'UNDERLINE' style, or if nothing is selected, the
      // internal style (for new input) is set to 'UNDERLINE'
      onChange(RichUtils.toggleInlineStyle(state, "UNDERLINE"));
      return "handled";
    }

    if (command === "make-unordered-list") {
      let modifiedContent = state.getCurrentContent();

      // if the first character is "-", we have to remove this before making the block an unordered list
      if (block.getText().trim().charAt(0) === "-") {
        // select first char
        const replacementRange = new SelectionState({
          anchorKey: selection.getAnchorKey(),
          anchorOffset: 0,
          focusKey: selection.getFocusKey(),
          focusOffset: 1,
        });

        // remove first char
        modifiedContent = Modifier.replaceText(
          state.getCurrentContent(),
          replacementRange,
          "",
        );
      }

      // modify state to reflect we deleted a character and then change current block to unordered list
      const modifiedState = RichUtils.toggleBlockType(
        EditorState.push(state, modifiedContent, "delete-character"),
        "unordered-list-item",
      );

      // select start of this new unordered list
      const newSelection = new SelectionState({
        anchorKey: modifiedState.getSelection().getAnchorKey(),
        anchorOffset: 0,
        focusKey: modifiedState.getSelection().getAnchorKey(),
        focusOffset: 0,
      });

      // update state with this selection and modifications to the state
      onChange(EditorState.forceSelection(modifiedState, newSelection));
      return "handled";
    }

    if (command === "make-ordered-list") {
      let modifiedContent = state.getCurrentContent();

      // if the first character is "-", we have to remove this before making the block an unordered list
      if (block.getText().trim().substring(0, 2) === "1.") {
        // select first char
        const replacementRange = new SelectionState({
          anchorKey: selection.getAnchorKey(),
          anchorOffset: 0,
          focusKey: selection.getFocusKey(),
          focusOffset: 2,
        });

        // remove first char
        modifiedContent = Modifier.replaceText(
          state.getCurrentContent(),
          replacementRange,
          "",
        );
      }

      // modify state to reflect we deleted two characters and then change current block to unordered list
      const modifiedState = RichUtils.toggleBlockType(
        EditorState.push(state, modifiedContent, "delete-character"),
        "ordered-list-item",
      );

      // select start of this new unordered list
      const newSelection = new SelectionState({
        anchorKey: modifiedState.getSelection().getAnchorKey(),
        anchorOffset: 0,
        focusKey: modifiedState.getSelection().getAnchorKey(),
        focusOffset: 0,
      });

      // update state with this selection and modifications to the state
      onChange(EditorState.forceSelection(modifiedState, newSelection));
      return "handled";
    }

    if (command === "remove-block-styling") {
      onChange(RichUtils.toggleBlockType(state, "unstyled"));
      return "handled";
    }

    return "not-handled";
  }

  // called by buttons (via onMouseDown) that act as controls for the field
  function handleControlMouseDown(
    e: React.MouseEvent<HTMLElement>,
    modifiedState: EditorState,
  ) {
    e.preventDefault();
    onChange(modifiedState);
  }

  const handleTextSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    onChange(RichUtils.toggleBlockType(editorState, textSizeMapping[newValue]));
  };

  return (
    <VStack alignItems="flex-start" w="full">
      <HStack h="32px">
        <Select
          ml="12px"
          size="sm"
          variant="unstyled"
          value={textSize}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleTextSizeChange(e)
          }
          w="120px"
        >
          {Object.keys(textSizeMapping).map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </Select>
        <Divider orientation="vertical" />
        <ButtonGroup>
          {[
            { style: "BOLD", icon: Bold },
            { style: "ITALIC", icon: Italic },
            { style: "UNDERLINE", icon: Underline },
          ].map(({ style, icon }) => (
            <IconButton
              aria-label={style}
              key={style}
              type="button"
              onMouseDown={(e) =>
                handleControlMouseDown(
                  e,
                  RichUtils.toggleInlineStyle(editorState, style),
                )
              }
              onClick={(e) => {
                e.preventDefault();
              }}
              colorScheme="gray"
              variant={currentInlineStyle.has(style) ? "solid" : "ghost"}
              size="sm"
            >
              <Image
                src={icon}
                h="28px"
                style={
                  currentInlineStyle.has(style)
                    ? {
                        filter:
                          "invert(11%) sepia(72%) saturate(7048%) hue-rotate(272deg) brightness(94%) contrast(128%)",
                      }
                    : undefined
                }
              />
            </IconButton>
          ))}
        </ButtonGroup>
        <Divider orientation="vertical" />
        <ButtonGroup>
          {[
            { style: "unordered-list-item", icon: UnorderedList },
            { style: "ordered-list-item", icon: OrderedList },
          ].map(({ style, icon }) => (
            <IconButton
              aria-label={style}
              key={style}
              type="button"
              onMouseDown={(e) => {
                handleControlMouseDown(
                  e,
                  RichUtils.toggleBlockType(editorState, style),
                );
              }}
              colorScheme="gray"
              variant={blockType === style ? "solid" : "ghost"}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Image
                src={icon}
                style={
                  blockType === style
                    ? {
                        filter:
                          "invert(11%) sepia(72%) saturate(7048%) hue-rotate(272deg) brightness(94%) contrast(128%)",
                      }
                    : undefined
                }
                h="28px"
              />
            </IconButton>
          ))}
        </ButtonGroup>
      </HStack>
      <Container
        borderWidth={editorBorderWidth}
        borderRadius="sm"
        borderColor={editorBorderColor}
        p="5px"
        maxW="container.md"
        sx={{
          ...fontSizeObject,
          ".public-DraftEditorPlaceholder-root": {
            display: showPlaceHolder,
            fontSize: `${textSizes[textSize]}px`,
          },
          ".public-DraftEditor-content": {
            overflow: "auto",
            height: "200px",
          },
        }}
      >
        <Box>
          <Editor
            placeholder={defaultText}
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindings}
          />
        </Box>
      </Container>
    </VStack>
  );
};

export default RichTextField;
