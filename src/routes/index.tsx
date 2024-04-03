import { createSession, signIn } from "@solid-mediakit/auth/client";
import { store, setStore } from "~/store";
import Sidebar from "~/components/sidebar";
import styles from "./PileLayout.module.scss";

export default function Index() {
  const session = createSession();
  console.log("session: ", session());
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
              <motion.span
                key={now}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {now}
              </motion.span>
            </div>
            <div class={styles.right}>
              <Toasts />
              <InstallUpdate />
              <Chat />
              <Reflections />
              <Settings />
              <Link to="/" class={`${styles.iconHolder}`}>
                <HomeIcon class={styles.homeIcon} />
              </Link>
              {/* <HighlightsDialog /> */}
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
