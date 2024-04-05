import { createWorker } from "@solid-primitives/workers";
import { md } from "~/markdown-it";

const [worker] = createWorker(md.render);

export default worker;
