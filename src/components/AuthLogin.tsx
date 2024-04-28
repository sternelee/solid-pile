import { Show, type VoidComponent } from "solid-js";
import { createSession, signIn, signOut } from "@solid-mediakit/auth/client";

const AuthLogin: VoidComponent = () => {
  const session = createSession();
  return (
    <div class="dropdown dropdown-end">
      <div role="button" tabIndex={0} class="btn btn-ghost">
        <Show
          when={session()}
          fallback={
            <>
              <i class="inline-block i-carbon:login text-2xl md:hidden" />
              <span class="hidden font-normal md:inline">Login</span>
            </>
          }
        >
          <div class="avatar">
            <div class="w-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={session()?.user?.image || ""} width={24} height={24} />
            </div>
          </div>
        </Show>
      </div>
      <div
        tabIndex={0}
        class="dropdown-content bg-base-200 text-base-content rounded-box top-px w-30 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-14"
      >
        <div class="grid grid-cols-1 gap-3 p-3">
          <Show
            when={session()}
            fallback={
              <>
                <button
                  class="flex items-center"
                  onClick={() => signIn("github")}
                >
                  <i class="inline-block i-carbon:logo-github text-2xl" />
                  <span class="ml-2">Github</span>
                </button>
                <button
                  class="flex items-center"
                  onClick={() => signIn("google")}
                >
                  <i class="inline-block i-carbon:logo-google text-2xl" />
                  <span class="ml-2">Google</span>
                </button>
              </>
            }
          >
            <button class="flex items-center" onClick={() => signOut()}>
              <i class="inline-block i-carbon:logout text-2xl" />
              <span class="ml-2">Logout</span>
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
