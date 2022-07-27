import { useSession } from "next-auth/react";
import * as React from "react";
import AccountsList from "../src/components/AccountsList/AccountsList";
import Header from "../src/components/Header/Header";
import KhaatasList from "../src/components/KhaatasList/KhaatasList";
import styles from "../styles/Home.module.scss";

export default function KhaatasPage() {
  const { data: session } = useSession();
  return (
    <div className={styles.khaatasPageContainer}>
      <Header name={session?.user?.name} />
      <KhaatasList />
    </div>
  );
}
