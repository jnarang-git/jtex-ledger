import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import styles from ".//SummaryButton.module.scss";
export default function SummaryButton({
  topLabel,
  bottomLabel,
  color,
  upArrowIcon,
  downArrayIcon,
}) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div
      className={styles.toRecieveContainer}
      style={{ backgroundColor: color }}
    >
      <div className={styles.leftSection}>
        <section className={styles.amount}>
          <CurrencyRupeeIcon fontSize="small" /> <span>{topLabel}</span>
        </section>
        <section className={`${styles.amount} ${styles.recievedLabel}`}>
          <p>{bottomLabel}</p>
          {downArrayIcon && <ArrowDownwardIcon />}
          {upArrowIcon && <ArrowUpwardIcon />}
        </section>
      </div>
      <ChevronRightIcon fontSize="large" />
    </div>
  );
}
