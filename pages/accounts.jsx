import { useSession } from "next-auth/react";
import * as React from "react";
import AccountsList from "../src/components/AccountsList/AccountsList";
import Header from "../src/components/Header/Header";
import SummaryButton from "../src/components/SummarButton/SummaryButton";
import styles from "../styles/Home.module.scss";
export default function AccountsPage() {
  const [firmBalance, setFirmBalance] = React.useState(0);
  const [toCollect, setToCollect] = React.useState(0);
  const [toPay, setToPay] = React.useState(0);
  const [showStats, setShowStats] = React.useState(true);
  const [monthSale, setMonthSale] = React.useState(0);
  const { data: session } = useSession();
  return (
    <div className={styles.accountPageContainer}>
      <div className={styles.headerContainer}>
        <p className={styles.logo}>
          {/* <Image src={Logo} width="120" height="50" /> */}
          E-Khata
        </p>
        <Header name={session?.user?.name} />
      </div>
      <div
        className={`${styles.summaryContainer} ${
          showStats ? styles.show : styles.hide
        }`}
      >
        <SummaryButton
          topLabel={toCollect}
          bottomLabel="LENE HAI"
          // color="#b7deb7"
          downArrayIcon
        />
        <SummaryButton
          topLabel={toPay}
          bottomLabel="DENE HAI"
          // color="#e3c1c1"
          upArrowIcon
        />
        <SummaryButton
          topLabel={firmBalance}
          bottomLabel="Net Balance"
          // color={firmBalance > 0 ? "#b7deb7" : "#e3c1c1"}
        />{" "}
        <SummaryButton
          topLabel={monthSale}
          bottomLabel="This week sale"
          // color={monthSale >= 200000 ? "#b7deb7" : "#e3c1c1"}
        />
      </div>
      <AccountsList
        setFirmBalance={setFirmBalance}
        setMonthSale={setMonthSale}
        setToCollect={setToCollect}
        setToPay={setToPay}
        setShowStats={setShowStats}
      />
    </div>
  );
}
