import React, {useEffect, useState} from "react";
import {Box} from '@chakra-ui/react';
import {convertFromRaw, Editor, EditorState} from 'draft-js';


interface RichTextDisplayProps {
  children: string
}

const RichTextDisplay = ( {children}: RichTextDisplayProps): React.ReactElement  => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (children) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(children))))
    }
  }, [children])

return (
<Box>
<Editor editorState={editorState} readOnly onChange={() => {}}/>
</Box>)
}

export default RichTextDisplay;