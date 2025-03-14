import Link from "antd/es/typography/Link";
import { Editor, loader } from "@monaco-editor/react";
import useApp from "antd/es/app/useApp";

loader.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.52.2/min/vs" } });

interface JsonLinkProps {
  json: Object | string;
  title?: string;
  max?: number;
}

export default ({ json, title, max }: JsonLinkProps) => {
  const app = useApp();
  if (!json) {
    return <></>;
  }
  if (typeof json === "string") {
    json = JSON.parse(json as string);
  }
  let jsonText = JSON.stringify(json);
  let linkText = max && max < jsonText.length ? jsonText.slice(0, max) + " ..." : jsonText;

  const showModal = () => {
    if (typeof json === "object") {
      json = JSON.stringify(json, null, 2);
    }
    app.modal.info({
      width: "60%",
      title: title || "查看",
      icon: null,
      content: <Editor defaultValue={json as string} value={json as string} height={600} theme="vs-dark" defaultLanguage="json" />,
    });
  };

  return <Link onClick={() => showModal()}>{linkText}</Link>;
};
