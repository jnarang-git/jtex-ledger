import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import * as React from "react";
import styles from ".//SummaryButton.module.scss";
export default function SummaryButton({
  topLabel,
  bottomLabel,
  color,
  upArrowIcon,
  downArrayIcon,
}) {
  return (
    <div
      className={styles.toRecieveContainer}
      style={{ backgroundColor: color ?? "#5d5da1" }}
    >
      <div className={styles.leftSection}>
        <section className={styles.amount}>
          <CurrencyRupeeIcon fontSize="small" /> <span>{topLabel || ""}</span>
        </section>
        <section className={`${styles.amount} ${styles.recievedLabel}`}>
          <p>{bottomLabel}</p>
          {/* {downArrayIcon && <ArrowDownwardIcon />}
            {upArrowIcon && <ArrowUpwardIcon />} */}
        </section>
      </div>
      {/* <ChevronRightIcon fontSize="large" /> */}
    </div>
  );
}
