import type { JSXElement } from "solid-js"
import styles from './PileLayout.module.scss';

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="sm:pt-8em py-2em before">
      {children}
    </div>
  )
}
