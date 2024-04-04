import { createSession, signIn } from "@solid-mediakit/auth/client";
import { createSignal, createEffect } from "solid-js";
import { DateTime } from "luxon";
import { Motion } from "solid-motionone";
import { store, setStore } from "~/store";
import { visibleIndex, closestDate } from "~/store/timeline";
import Sidebar from "~/components/Sidebar";
import styles from "./PileLayout.module.scss";

export default function Index() {
  const session = createSession();
  console.log("session: ", session());
  const [now, setNow] = createSignal(
    DateTime.now().toFormat("cccc, LLL dd, yyyy"),
  );

  createEffect(() => {
    try {
      if (visibleIndex() < 5) {
        setNow(DateTime.now().toFormat("cccc, LLL dd, yyyy"));
      } else {
        setNow(
          DateTime.fromISO(closestDate() as string).toFormat(
            "cccc, LLL dd, yyyy",
          ),
        );
      }
    } catch (error) {
      console.log("Failed to render header date");
    }
  });

  createEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div class={styles.frame}>
      <div class={styles.bg}></div>
      <div class={styles.main}>
        <div class={styles.sidebar}>
          <div class={styles.top}>
            <div class={styles.part}>
              <div class={styles.count}>
                <span>{store.index.size}</span> entries
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
        <div class={styles.content}>
          <div class={styles.nav}>
            <div class={styles.left}>
              {store.piles[0].title} <span style={{ padding: "6px" }}>·</span>
              <Motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {now()}
              </Motion.span>
            </div>
            <div class={styles.right}>
              <Chat />
              <Reflections />
              <Settings />
              <HomeIcon class={styles.homeIcon} />
            </div>
          </div>
          {children}
        </div>
      </div>
      <div id="reflections"></div>
      <div id="dialog"></div>
    </div>
  );
}
