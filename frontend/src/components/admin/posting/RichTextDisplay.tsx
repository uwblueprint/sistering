import React, {useEffect, useState} from "react";
import {Box} from '@chakra-ui/react';
import {convertFromRaw, Editor, EditorState} from 'draft-js';

interface Props {
  description: string
}

const RichTextDisplay = (props: Props): React.ReactElement => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (props.description) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(props.description))))
    }
  }, [props.description])

return (
<Box>
<Editor editorState={editorState} readOnly={true} onChange={() => {}}/>
</Box>)
}

export default RichTextDisplay;