import { Button } from "@mui/material";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
export default function Login({ providers }) {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/accounts");
    return null;
  }
  return (
    <div className={styles.loginContainer}>
      {providers &&
        Object.values(providers)?.map(({ id, name }) => (
          <Button
            key={id}
            style={{
              backgroundColor: "#5d5da1",
            }}
            variant="contained"
            onClick={() => signIn(id)}
          >
            {`Sign in with ${name}`}
          </Button>
        ))}
    </div>
  );
}

export async function getServerSideProps({ res }) {
  const providers = await getProviders();
  return {
    props: { providers }, // will be passed to the page component as props
  };
}
