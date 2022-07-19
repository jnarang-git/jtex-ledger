import * as React from "react";
import Contact from "../Contact/Contact";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import styles from "./Home.module.scss";
import axios from "axios";
import CustomModal from "../Modal/Modal";
import { Button, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { AccountBalance } from "@mui/icons-material";

export default function Home() {
  const { data: session } = useSession();
  const token =
    "ya29.A0AVA9y1tAn5TOmUjXQE5oZ0P7syscBFJAGb6WX9IscoJT8QR4Upwo8xmfprgg8uFd69pTxN6jSVSfCplXbJQ2wsxrvPLUlFrAWuRXGTmjs4jBkBWUKPTwUQNCpOkE1b6RRlkWj_2nw-gZt18_xH9UwC9M4TvpYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4cHFjbFVadlNqM2txSHZjdEhMREJuUQ0163" ??
    session?.accessToken;
  const [accounts, setAccounts] = React.useState([]);
  const [txns, setTxns] = React.useState([]);
  const [isModalOpen, toggleModal] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [firmBalance, setFirmBalance] = React.useState(0);
  const [accountsBalances, setAccountsBalances] = React.useState([]);
  console.log("accountsBalances", accountsBalances);
  const spreadsheetsId = "1TJrZaCqRLxjdTI085mMR1q20UotXoGyUkl2_yc91bBo";
  async function getAccounts() {
    await axios
      .get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((res) => setAccounts(res?.sheets));

    await axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetsId}/values/A2:B`,
        {
          headers: {
            Authorization:
              "Bearer ya29.A0AVA9y1sYVlCVI0pr4slnbz8ZUp13BvKhEkqhi7D0zgbul4ifQwO7Svgrb1Y-vKQHoHSdzcHF1qXXDo08UIAkHP0Fsl2dS2CPAOd3q2JuArKC9gFewW-BD9PjP4w6kUKPtkFCmYOl5lu1uCyRPF0jAIEA8wxobXgYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4QTE4bGdDUm5rb0xleWJPVDFYYjdyZw0166",
          },
        }
      )
      .then((resObj) => resObj.data)
      .then((res) => setTxns(res?.values));
  }
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

  async function handleAddAcount() {
    await axios.post(
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
    );
    await axios.post(
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
    );

    toggleModal(false);
    setAccountName("");
    getAccounts();
  }
  return (
    <main className={styles.homepageContainer}>
      <div className={styles.createNewAccount}>
        <p className={styles.createContact}>Create new Contact</p>

        <div
          onClick={() => {
            toggleModal(true);
          }}
        >
          <AddCircleOutlineIcon />
        </div>
      </div>
      <div>
        Firm:
        <span className={`${firmBalance >= 0 ? styles.green : styles.red}`}>
          {firmBalance}
        </span>
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
        <CustomModal isModalOpen={isModalOpen} toggleModal={toggleModal}>
          <TextField
            className={styles.field}
            id="outlined-number"
            label="Account name"
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
