import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Avatar, Button, Stack } from "@mui/material";
import TextField from "../common/TextField";
import axios from "axios";
import { useSession } from "next-auth/react";
import * as React from "react";
import SearchBar from "../common/SearchBar/SearchBar";
import Contact from "../Contact/Contact";
import CustomModal from "../Modal/Modal";
import styles from "./KhaatasList.module.scss";
import {
  deepPurple,
  deepOrange,
  lightBlue,
  lightGreen,
  amber,
  blueGrey,
  cyan,
  indigo,
  lime,
} from "@mui/material/colors";

import PostAddIcon from "@mui/icons-material/PostAdd";
import { useRouter } from "next/router";
import { useLoader } from "../../customHooks/useLoader";
import CustomLoader from "../common/Loader/Loader";
export default function KhaatasList({}) {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.accessToken;
  const [khaatas, setKhaatas] = React.useState([]);
  const [filteredKhaatas, setFilteredKhaatas] = React.useState([]);
  const [isModalOpen, toggleModal] = React.useState(false);
  const [isAddKhataOpen, toggleKhataModal] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [khataName, setKhataName] = React.useState("");
  const [khataId, setKhataId] = React.useState("");
  const [accountsBalances, setAccountsBalances] = React.useState([]);
  const [accountsTxns, setAccountsTxns] = React.useState([]);
  const { loader, showLoader, hideLoader } = useLoader();
  React.useEffect(() => {
    getKhatas();
  }, []);

  async function getKhatas() {
    showLoader();
    await axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/1iRjFMaCcqV4A6GZIko5hYG22pYInMsd-WlLRfKlrqnY/values/SheetsMapping!A2:C`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resObj) => resObj.data)
      .then((res) => {
        setKhaatas(res?.values);
        setFilteredKhaatas(res?.values);
      })
      .catch();
    hideLoader();
  }

  function handleAccountSearch(searchTerm) {
    setFilteredKhaatas(
      searchTerm?.length
        ? filteredKhaatas?.filter((accnt) =>
            accnt?.properties?.title
              ?.toLowerCase()
              ?.includes(searchTerm?.toLowerCase())
          )
        : khaatas
    );
  }
  // Create Spreadsheet API
  async function handleAddKhata() {
    showLoader();
    const addSheetResponse = await axios
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
      .then((res) => res.data)
      .catch(() => {});

    if (addSheetResponse?.spreadsheetId)
      await axios
        .post(
          `https://sheets.googleapis.com/v4/spreadsheets/1iRjFMaCcqV4A6GZIko5hYG22pYInMsd-WlLRfKlrqnY/values/SheetsMapping!A2:B:append?valueInputOption=USER_ENTERED`,
          {
            majorDimension: "ROWS",
            range: `SheetsMapping!A2:B`,
            values: [[khataName, addSheetResponse?.spreadsheetId]],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch(() => {});
    hideLoader();
    getKhatas();
    toggleKhataModal(false);
    setKhataName("");
  }

  const COLORS = [deepOrange, deepPurple, lightBlue, indigo];

  return (
    <main className={styles.homepageContainer}>
      {loader ? (
        <CustomLoader />
      ) : !khaatas?.length ? (
        <Stack spacing={2} direction="column" sx={{ my: 2 }}>
          <p className={styles.noRecordFound}>Sorry, No Khata found.</p>
          <p className={styles.noRecordFound}>
            {`Don't have khaata? Don't worry click below to open a new Khata.`}
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
      ) : (
        <>
          <div className={styles.addCustomerContainer}>
            <p className={styles.accountsLabel}>Khaate</p>
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
          <SearchBar handleAccountSearch={handleAccountSearch} />
          {filteredKhaatas?.length ? (
            filteredKhaatas?.map((khata, index) => (
              <Stack key={khata[0]} spacing={2} direction="column">
                <main
                  className={styles.contactContainer}
                  onClick={() => {
                    console.log(khata[1]);
                    router.push("/accounts?sId=" + khata[1]);
                  }}
                >
                  <section className={styles.sectionContainer}>
                    <p className={styles.contactNameSection}>
                      <Avatar
                        sx={{
                          bgcolor: COLORS[index % 4][500],
                        }}
                      >
                        {khata[0].charAt(0)}
                      </Avatar>
                      <span className={styles.contactName}>{khata[0]}</span>
                    </p>
                  </section>
                </main>
              </Stack>
            ))
          ) : (
            <p className={styles.noRecordFound}>Sorry, No Khata found.</p>
          )}
        </>
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
