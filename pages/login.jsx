import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  console.log("sess", session);
  const router = useRouter();
  if (session) {
    router.push("/accounts");
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
