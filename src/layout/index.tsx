import Header from "~/components/Header"
import type { JSXElement } from "solid-js"
import "~/styles/main.css";
import "katex/dist/katex.min.css";

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="py-2em after">
      <Header />
      {children}
    </div>
  )
}
