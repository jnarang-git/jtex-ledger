import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Stack } from "@mui/material";
import TextField from "../common/TextField";
import axios from "axios";
import { useSession } from "next-auth/react";
import * as React from "react";
import SearchBar from "../common/SearchBar/SearchBar";
import Contact from "../Contact/Contact";
import CustomModal from "../Modal/Modal";
import styles from "./AccountsList.module.scss";

export default function AccountsList({
  setFirmBalance,
  setMonthSale,
  setToPay,
  setToCollect,
}) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [accounts, setAccounts] = React.useState([]);
  const [filteredAccounts, setFilteredAccounts] = React.useState([]);
  const [isModalOpen, toggleModal] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [accountsBalances, setAccountsBalances] = React.useState([]);
  const [accountsTxns, setAccountsTxns] = React.useState([]);
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
      .then((res) => {
        const cashSheet = res?.sheets?.find(
          (obj) => obj.properties.title === "CASH"
        );

        const a = [cashSheet];
        const filteredSheets = res?.sheets?.filter(
          (sheet) => sheet.properties.title !== "CASH"
        );

        setAccounts([...a, ...filteredSheets]);
        setFilteredAccounts([...a, ...filteredSheets]);
      });
  }

  async function handleAddAcount() {
    const addSheetResponse = await axios
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
    if (addSheetResponse?.spreadsheetsId)
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

  function handleAccountSearch(searchTerm) {
    setFilteredAccounts(
      searchTerm?.length
        ? filteredAccounts?.filter((accnt) =>
            accnt?.properties?.title
              ?.toLowerCase()
              ?.includes(searchTerm?.toLowerCase())
          )
        : accounts
    );
  }
  return (
    <main className={styles.homepageContainer}>
      <div className={styles.addCustomerContainer}>
        <p className={styles.accountsLabel}>Accounts</p>
        <Button
          size="large"
          variant="contained"
          className={styles.addCustomerButton}
          onClick={() => {
            toggleModal(true);
          }}
        >
          <PersonAddIcon />
          {/* <p className={styles.addCustomerLabel}>Add</p> */}
        </Button>
      </div>
      <SearchBar handleAccountSearch={handleAccountSearch} />
      {filteredAccounts?.length ? (
        filteredAccounts?.map((contact, index) => (
          <Stack
            key={contact?.properties?.sheetId}
            spacing={2}
            direction="column"
          >
            <Contact
              index={index}
              contact={contact}
              spreadsheetsId={spreadsheetsId}
              token={token}
              getAccounts={getAccounts}
              setAccountsBalances={setAccountsBalances}
              setToCollect={setToCollect}
              setToPay={setToPay}
              setAccountsTxns={setAccountsTxns}
            />
          </Stack>
        ))
      ) : (
        <p className={styles.noRecordFound}>Sorry! No accounts found</p>
      )}
      {isModalOpen && (
        <CustomModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          heading="Add Account"
        >
          <Stack spacing={2} direction="column">
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
                style: { color: "#fff" },
              }}
            />
            <Stack spacing={2} direction="row">
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
            </Stack>
          </Stack>
        </CustomModal>
      )}
    </main>
  );
}
