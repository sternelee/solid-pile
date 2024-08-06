// @refresh reload
import { Suspense } from "solid-js";
import { MetaProvider, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import PrefixTitle from "./components/PrefixTitle";
// @ts-ignore
import { pwaInfo } from "virtual:pwa-info";
import "uno.css";
import "@unocss/reset/tailwind.css";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Meta name="theme-color" content="#f6f8fa" />
          {pwaInfo?.webManifest?.href ? (
            <Link rel="manifest" href={"/_build/" + pwaInfo.webManifest.href} />
          ) : (
            ""
          )}
          <PrefixTitle>Lee</PrefixTitle>
          <Suspense>
            {props.children}
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
