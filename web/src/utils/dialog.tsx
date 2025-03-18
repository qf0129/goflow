import { Editor, loader } from "@monaco-editor/react";
import { DialogPlugin } from "tdesign-react";

// loader.config({
//   paths: {
//     vs: "/monaco-editor/min/vs",
//   },
// });

export const ShowJsonDialog = (title: string, json: string | Object) => {
  if (typeof json === "object") {
    json = JSON.stringify(json, null, 2);
  }
  const myDialog = DialogPlugin({
    width: "60%",
    header: title || "查看",
    footer: false,
    placement: "center",
    body: <Editor defaultValue={json as string} value={json as string} height={600} theme="vs-dark" defaultLanguage="json" />,
    onConfirm: () => {
      myDialog.hide();
    },
    onClose: () => {
      myDialog.hide();
    },
  });
};
