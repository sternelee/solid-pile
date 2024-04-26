import { mount, StartClient } from "@solidjs/start/client";
import { useRegisterSW } from "virtual:pwa-register/solid";

useRegisterSW({ immediate: true });

mount(() => <StartClient />, document.getElementById("app") as HTMLElement);
