import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import {
  convertFromRaw,
  Editor,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

type RichTextDisplayProps = {
  children: string;
};

const RichTextDisplay = ({
  children,
}: RichTextDisplayProps): React.ReactElement => {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty(),
  );

  useEffect(() => {
    try {
      const contentState: RawDraftContentState = JSON.parse(children);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(contentState)),
      );
    } catch (e: unknown) {
      /* eslint-disable-next-line no-console */
      console.log(
        `Invalid content state ${children} passed to RichTextDisplay`,
      );
      setEditorState(EditorState.createEmpty());
    }
  }, [children]);

  return (
    <Box>
      <Editor editorState={editorState} readOnly onChange={() => {}} />
    </Box>
  );
};

export default RichTextDisplay;
