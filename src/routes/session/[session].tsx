import Chat from "~/components/Chat";
import Layout from "~/layout";
import { useParams } from "@solidjs/router";
import { Show, onMount, createSignal } from "solid-js";
import { RootStore } from "~/store";
import PrefixTitle from "~/components/PrefixTitle";

export default function Session() {
	const [redirect] = createSignal(false);
	const { store, setStore } = RootStore;
	const params = useParams<{ session?: string }>();

	onMount(async () => {
		setStore("sessionId", params.session ?? "index");
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
