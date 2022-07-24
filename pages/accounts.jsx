import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import Logo from "../public/logo.png";
import AccountsList from "../src/components/AccountsList/AccountsList";
import Header from "../src/components/Header/Header";
import SummaryButton from "../src/components/SummarButton/SummaryButton";
import styles from "../styles/Home.module.scss";
export default function AccountsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [firmBalance, setFirmBalance] = React.useState(0);
  const [monthSale, setMonthSale] = React.useState(0);

  return (
    <div className={styles.accountPageContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Image src={Logo} width="120" height="50" />
        </div>
        <Header />
      </div>
      <div className={styles.summaryContainer}>
        <SummaryButton
          topLabel="0"
          bottomLabel="LENE HAI"
          color="#b7deb7"
          downArrayIcon
        />
        <SummaryButton
          topLabel="0"
          bottomLabel="DENE HAI"
          color="#e3c1c1"
          upArrowIcon
        />
        <SummaryButton
          topLabel={firmBalance}
          bottomLabel="Net Balance"
          color={firmBalance > 0 ? "#b7deb7" : "#e3c1c1"}
        />{" "}
        <SummaryButton
          topLabel={monthSale}
          bottomLabel="This week sale"
          color={monthSale >= 200000 ? "#b7deb7" : "#e3c1c1"}
        />
      </div>
      <AccountsList
        setFirmBalance={setFirmBalance}
        setMonthSale={setMonthSale}
      />
    </div>
  );
}
