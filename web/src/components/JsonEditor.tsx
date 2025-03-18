// import { Editor, loader, OnChange } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Editor, loader, OnChange } from "@monaco-editor/react";
import { FC, FormEvent } from "react";
import { TextareaValue } from "tdesign-react";

loader.config({ monaco });

// loader.config({
//   paths: {
//     vs: "/monaco-editor/min/vs",
//   },
// });

interface JsonEditorProps {
  defaultValue?: string;
  value?: string;
  height?: number | string;
  onChange?: (value: TextareaValue, context?: { e?: FormEvent<HTMLTextAreaElement> }) => void;
}

const JsonEditor: FC<JsonEditorProps> = (props) => {
  return (
    <Editor
      defaultValue={props.defaultValue}
      value={props.value}
      height={props.height}
      width={"100%"}
      theme="vs-dark"
      defaultLanguage="json"
      onChange={props.onChange as OnChange}
    />
  );
};

export default JsonEditor;
