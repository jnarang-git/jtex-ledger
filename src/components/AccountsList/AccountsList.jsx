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
import PostAddIcon from "@mui/icons-material/PostAdd";
export default function AccountsList({
  setFirmBalance,
  setMonthSale,
  setToPay,
  setToCollect,
  setShowStats,
}) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [accounts, setAccounts] = React.useState([]);
  const [filteredAccounts, setFilteredAccounts] = React.useState([]);
  const [isModalOpen, toggleModal] = React.useState(false);
  const [isAddKhataOpen, toggleKhataModal] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [khataName, setKhataName] = React.useState("");
  const [khataId, setKhataId] = React.useState("");
  const [accountsBalances, setAccountsBalances] = React.useState([]);
  const [accountsTxns, setAccountsTxns] = React.useState([]);
  React.useEffect(() => {
    if (localStorage.getItem("khataId")) getAccounts();
  }, []);

  React.useEffect(() => {
    const totalBalance = accountsBalances?.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
    setFirmBalance(totalBalance);
  }, [accountsBalances]);

  async function getAccounts(sId) {
    await axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${
          sId || localStorage.getItem("khataId")
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data)
      .then((res) => {
        const cashSheet = res?.sheets?.find(
          (obj) => obj.properties.title === "CASH"
        );

        const a = [cashSheet];
        const filteredSheets = res?.sheets
          ?.filter((sheet) => sheet.properties.title !== "CASH")
          ?.sort(function (a, b) {
            if (b["properties"]["index"] < a["properties"]["index"]) {
              return -1;
            } else if (b["properties"]["index"] > a["properties"]["index"]) {
              return 1;
            }
            return 0;
          });

        setAccounts([...a, ...filteredSheets]);
        setFilteredAccounts([...a, ...filteredSheets]);
      });
  }

  async function handleAddAcount() {
    const addSheetResponse = await axios
      .post(
        `https://sheets.googleapis.com/v4/spreadsheets/${localStorage.getItem(
          "khataId"
        )}:batchUpdate`,
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
          `https://sheets.googleapis.com/v4/spreadsheets/${localStorage.getItem(
            "khataId"
          )}/values/${accountName}!A:C:append?valueInputOption=USER_ENTERED`,
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
  async function handleAddKhata() {
    await axios
      .post(
        `https://sheets.googleapis.com/v4/spreadsheets`,
        {
          properties: {
            title: khataName,
          },
          sheets: [
            {
              properties: {
                title: "CASH",
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
      .then((res) => {
        localStorage.setItem("khataId", res.data?.spreadsheetId);
        getAccounts(res.data?.spreadsheetId);
      })
      .catch(() => {});
    toggleKhataModal(false);
    setKhataName("");
  }
  return (
    <main className={styles.homepageContainer}>
      {accounts?.length ? (
        <>
          <div className={styles.addCustomerContainer}>
            <p className={styles.accountsLabel}>Accounts</p>
            <Button
              size="large"
              style={{
                backgroundColor: "#5d5da1",
              }}
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
          <SearchBar
            handleAccountSearch={handleAccountSearch}
            setShowStats={setShowStats}
          />
          {filteredAccounts?.map((contact, index) => (
            <Stack
              key={contact?.properties?.sheetId}
              spacing={2}
              direction="column"
            >
              <Contact
                index={index}
                contact={contact}
                token={token}
                getAccounts={getAccounts}
                setAccountsBalances={setAccountsBalances}
                setToCollect={setToCollect}
                setToPay={setToPay}
                setAccountsTxns={setAccountsTxns}
              />
            </Stack>
          ))}
        </>
      ) : (
        <Stack spacing={2} direction="column" sx={{ my: 2 }}>
          <p className={styles.noRecordFound}>Sorry, No Khata found.</p>
          <TextField
            className={styles.field}
            id="outlined-number"
            label="Khata Id"
            autoComplete="off"
            value={khataId}
            onChange={(e) => {
              setKhataId(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
              style: { color: "#fff" },
            }}
          />
          <Button
            size="large"
            style={{
              backgroundColor: "#5d5da1",
            }}
            variant="contained"
            className={styles.addCustomerButton}
            onClick={() => {
              getAccounts(khataId);
              localStorage.setItem("khataId", khataId);
            }}
          >
            <p className={styles.addCustomerLabel}>Khata Khol</p>
          </Button>
          <p className={styles.noRecordFound}>
            Don't have khata? Don't worry click below to open a new Khata.
          </p>

          <Button
            size="large"
            style={{
              backgroundColor: "#5d5da1",
            }}
            variant="contained"
            className={styles.addCustomerButton}
            onClick={() => {
              toggleKhataModal(true);
            }}
          >
            <PostAddIcon />
            {/* <p className={styles.addCustomerLabel}>Add</p> */}
          </Button>
        </Stack>
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
                style={{
                  backgroundColor: "#5d5da1",
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
      {isAddKhataOpen && (
        <CustomModal
          isModalOpen={true}
          toggleModal={toggleKhataModal}
          heading="Add Khata"
        >
          <Stack spacing={2} direction="column">
            <TextField
              className={styles.field}
              id="outlined-number"
              label="Khata name"
              autoComplete="off"
              value={khataName}
              onChange={(e) => {
                setKhataName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (khataName?.length && e.key === "Enter") {
                  handleAddKhata();
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
                  toggleKhataModal(false);
                  setKhataName("");
                }}
                style={{
                  backgroundColor: "#5d5da1",
                }}
              >
                Cancel
              </Button>
              &nbsp; &nbsp;
              <Button
                disabled={!khataName?.length}
                variant="contained"
                onClick={() => {
                  handleAddKhata();
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
