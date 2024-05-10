import Chat from "~/components/Chat";
import Layout from "~/layout";
import { useNavigate, useParams } from "@solidjs/router";
import { Show, onMount, createSignal } from "solid-js";
import { RootStore } from "~/store";
import PrefixTitle from "~/components/PrefixTitle";
import { getSession } from "~/utils";

export default function Session() {
  const [redirect] = createSignal(false);
  const { store, setStore } = RootStore;
  const params = useParams<{ session?: string }>();

  onMount(async () => {
    const redirect = async () =>
      !params.session ||
      params.session === "index" ||
      !await getSession(params.session);
    if (await redirect()) useNavigate()("/", { replace: true });
    else setStore("sessionId", params.session ?? "index");
  });

  return (
    <Show when={!redirect()}>
      <PrefixTitle>{store.sessionSettings.title}</PrefixTitle>
      <Layout>
        <Chat />
      </Layout>
    </Show>
  );
}
