import Header from "~/components/Header"
import type { JSXElement } from "solid-js"
import "~/styles/main.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="py-2em before">
      <Header />
      {children}
    </div>
  )
}
