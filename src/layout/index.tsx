import Header from "~/components/Header"
import type { JSXElement } from "solid-js"
// import "katex/dist/katex.min.css";
import "~/styles/main.css";
import "~/styles/prism-material-dark.css"
import "~/styles/prism-themes-modify.css"

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="py-2em after">
      <Header />
      {children}
    </div>
  )
}
