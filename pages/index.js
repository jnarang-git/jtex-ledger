import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("sess", session);
  useEffect(() => {
    if (session) {
      router.push("/accounts");
    } else {
      router.push("/login");
    }
  }, [session]);

  return <></>;
}
