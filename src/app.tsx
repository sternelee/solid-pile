// @refresh reload
import { Suspense } from "solid-js";
import { MetaProvider, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import PrefixTitle from "./components/PrefixTitle";
import "uno.css";
import "@unocss/reset/tailwind.css";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Meta charset="utf-8" />
          <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Link
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
            sizes="192x192"
          />
          <Meta name="theme-color" content="#f6f8fa" />
          <PrefixTitle>Lee</PrefixTitle>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
