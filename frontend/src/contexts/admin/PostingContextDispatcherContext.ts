import { createContext } from "react";
import { PostingContextAction } from "../../types/PostingContextTypes";

const PostingContextDispatcherContext = createContext<
  React.Dispatch<PostingContextAction>
>(() => {});

export default PostingContextDispatcherContext;
