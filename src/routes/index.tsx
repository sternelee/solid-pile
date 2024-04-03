import { createSession, signIn } from "@solid-mediakit/auth/client";
import Layout from "~/layout";

export default function Index() {
  const session = createSession();
  console.log('session: ',session());
  return (
    <Layout>
      <h1>Hell</h1>
    </Layout>
  );
}
