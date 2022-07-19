import * as React from "react";
import Home from "../src/components/Home/Accounts";
import { useSession, signIn, signOut } from "next-auth/react";
import { Router, useRouter } from "next/router";
export default function Homepage() {
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!session) {
      router.push("login");
    }
  }, [session]);
  return (
    <>
      Signed in as {session?.user?.email} <br />
      <button
        onClick={() => {
          signOut();
          router.push("login");
        }}
      >
        Sign out
      </button>
      <Home />
    </>
  );
}
