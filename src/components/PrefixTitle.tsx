import type { JSXElement } from "solid-js";
import { Title } from "@solidjs/meta";

export default function (props: { children?: JSXElement }) {
  return <Title>Chat {props.children ? " | " + props.children : ""}</Title>;
}
