import { FC } from "react";
import { Link } from "tdesign-react";
import { ShowJsonDialog } from "../utils/dialog";

interface JsonLinkProps {
  json: Object | string;
  title?: string;
  max?: number;
}

const JsonLink: FC<JsonLinkProps> = ({ json, title, max }) => {
  if (!json) {
    return <></>;
  }
  if (typeof json === "string") {
    json = JSON.parse(json as string);
  }
  let jsonText = JSON.stringify(json);
  let linkText = max && max < jsonText.length ? jsonText.slice(0, max) + " ..." : jsonText;
  return <Link onClick={() => ShowJsonDialog(title || "查看JSON", json)}>{linkText}</Link>;
};

export default JsonLink;
