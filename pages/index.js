import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import "poppins";
export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push("/accounts");
    } else {
      router.push("/login");
    }
  }, [session]);

  return <></>;
}
