import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import * as React from "react";
import Contact from "../Contact/Contact";
import CustomModal from "../Modal/Modal";
import styles from "./AccountsList.module.scss";

export default function AccountsList({ firmBalance, setFirmBalance }) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [accounts, setAccounts] = React.useState([]);
  const [isModalOpen, toggleModal] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [accountsBalances, setAccountsBalances] = React.useState([]);
  console.log("accountsBalances", accountsBalances);
  const spreadsheetsId = "1TJrZaCqRLxjdTI085mMR1q20UotXoGyUkl2_yc91bBo";

  React.useEffect(() => {
    getAccounts();
  }, []);

  React.useEffect(() => {
    const totalBalance = accountsBalances?.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
    setFirmBalance(totalBalance);
  }, [accountsBalances]);

  async function getAccounts() {
    await axios
      .get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((res) => setAccounts(res?.sheets));
  }

  async function handleAddAcount() {
    await axios
      .post(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}:batchUpdate`,
        {
          requests: [
            {
              addSheet: {
                properties: {
                  title: accountName,
                },
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((err) => {});
    await axios
      .post(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}/values/${accountName}!A:C:append?valueInputOption=USER_ENTERED`,
        {
          majorDimension: "ROWS",
          range: `${accountName}!A:C`,
          values: [["Date", "Amount", "Bill Number"]],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch(() => {});

    toggleModal(false);
    setAccountName("");
    getAccounts();
  }

  return (
    <main className={styles.homepageContainer}>
      <div className={styles.addCustomerContainer}>
        <p className={styles.accountsLabel}>Accounts</p>
        <Button
          size="small"
          className={styles.addCustomerButton}
          onClick={() => {
            toggleModal(true);
          }}
        >
          <PersonAddIcon />
          <p className={styles.addCustomerLabel}>Add Acount</p>
        </Button>
      </div>
      {accounts?.map((contact) => (
        <Contact
          key={contact?.properties?.sheetId}
          contact={contact}
          spreadsheetsId={spreadsheetsId}
          token={token}
          getAccounts={getAccounts}
          setAccountsBalances={setAccountsBalances}
        />
      ))}
      {isModalOpen && (
        <CustomModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          heading="Add Account"
        >
          <TextField
            className={styles.field}
            id="outlined-number"
            label="Account name"
            autoComplete="off"
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (accountName?.length && e.key === "Enter") {
                handleAddAcount();
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              toggleModal(false);
              setAccountName("");
            }}
          >
            Cancel
          </Button>
          &nbsp; &nbsp;
          <Button
            disabled={!accountName?.length}
            variant="contained"
            onClick={() => {
              handleAddAcount();
            }}
          >
            Add
          </Button>
        </CustomModal>
      )}
    </main>
  );
}
