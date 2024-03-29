import { createSession, signIn } from "@solid-mediakit/auth/client";
import Chat from "~/components/Chat";
import Layout from "~/layout";

export default function Index() {
  const session = createSession();
  console.log(session());
  return (
    <Layout>
      <Chat />
    </Layout>
  );
}
