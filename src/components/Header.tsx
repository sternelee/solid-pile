import { createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { RootStore, loadSession } from "~/store";
import ThemeToggle from "./ThemeToggle";
import { ProviderMap } from "~/providers";
import { scrollToBottom } from "~/utils";

function splitEmoji(text: string) {
  const [icon, title] = text
    .split(
      /^([\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}])\s*(.+)$/u
    )
    .filter(Boolean);
  if (title)
    return {
      icon,
      title,
    };
  return {
    icon: '',
    title: icon,
  };
}

// function scrollTo(selector: string, yOffset = 0) {
//   const el = document.querySelector(selector) as HTMLElement;
//   const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
//   window.scrollTo({ top: y, behavior: "smooth" });
// }

export default function Header() {
  const { store } = RootStore;
  const navigate = useNavigate();
  const iconTitle = createMemo(() => splitEmoji(store.sessionSettings.title));
  return (
    <>
      <header class="px-4 py-2 sticky top-0 z-99 flex justify-between items-center">
        <div class="flex-1 flex items-center">
          {store.sessionSettings.title && (
            <>
              <a
                href={ProviderMap[store.sessionSettings.provider].href}
                aria-label="API Key Link"
                target="_blank"
                class={`inline-block text-8 mr-4 ${[
                  ProviderMap[store.sessionSettings.provider].icon,
                ]}`}
              ></a>
              <span
                class="font-extrabold cursor-pointer"
                onClick={() => {
                  navigate("/", { replace: true });
                  loadSession("index");
                }}
              >
                {iconTitle().icon + iconTitle().title}
              </span>
            </>
          )}
          {!store.sessionSettings.title && (
            <>
              <a
                href={ProviderMap[store.sessionSettings.provider].href}
                target="_blank"
                class={`inline-block text-8 ${[
                  ProviderMap[store.sessionSettings.provider].icon,
                ]}`}
              ></a>
              <span
                onClick={() => scrollToBottom(0)}
                class="flash-logo cursor-pointer text-5 font-bold ml-4"
              >
                {ProviderMap[store.sessionSettings.provider].name} Chat
              </span>
            </>
          )}
        </div>
        <ThemeToggle />
      </header>
    </>
  );
}
