import { createWorker } from "@solid-primitives/workers";
import { countTokens } from "~/utils/tokens";

const [worker] = createWorker(countTokens);

export default worker;
