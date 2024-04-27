import Header from "~/components/Header"
import type { JSXElement } from "solid-js"
// import "highlight.js/styles/github.min.css";
import "katex/dist/katex.min.css";
import "~/styles/main.css";

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="py-2em after">
      <Header />
      {children}
    </div>
  )
}
