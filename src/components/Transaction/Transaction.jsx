import * as React from "react";
import { useRouter } from "next/router";
import styles from "./Transaction.module.scss";

export default function Transaction({ txn }) {
  const router = useRouter();
  
  return (
    <main
      className={styles.txnContainer}
      //   onClick={() => router.push("/add-transaction")}
    >
      <section className={styles.sectionContainer}>
        <p className={styles.date}>{txn[0]}</p>
        <p
          className={`${styles.amount} ${
            txn[1] > 0 ? styles.green : styles.red
          }`}
        >
          {txn[1]}
        </p>
      </section>
    </main>
  );
}
