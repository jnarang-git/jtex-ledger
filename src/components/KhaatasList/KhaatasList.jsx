import RefreshIcon from "@mui/icons-material/Cached";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Avatar, Button, Stack } from "@mui/material";
import {
  deepOrange,
  deepPurple,
  indigo,
  lightBlue
} from "@mui/material/colors";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import { useLoader } from "../../customHooks/useLoader";
import {
  addKhataLink,
  sheetLink,
  spreadsheetLink,
} from "../../shared/constant";
import CustomLoader from "../common/Loader/Loader";
import SearchBar from "../common/SearchBar/SearchBar";
import TextField from "../common/TextField";
import CustomModal from "../Modal/Modal";
import styles from "./KhaatasList.module.scss";
export default function KhaatasList({}) {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.accessToken;
  const [khaatas, setKhaatas] = React.useState([]);
  const [filteredKhaatas, setFilteredKhaatas] = React.useState([]);
  const [isAddKhataOpen, toggleKhataModal] = React.useState(false);
  const [khataName, setKhataName] = React.useState("");
  const { loader, showLoader, hideLoader } = useLoader();
  React.useEffect(() => {
    getKhatas();
  }, []);

  async function getKhatas() {
    showLoader();
    await axios
      .get(sheetLink, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resObj) => resObj.data)
      .then((res) => {
        setKhaatas(res?.values?.sort());
        setFilteredKhaatas(res?.values?.sort());
      })
      .catch();
    hideLoader();
  }

  function handleAccountSearch(searchTerm) {
    setFilteredKhaatas(
      searchTerm?.length
        ? filteredKhaatas?.filter((accnt) =>
            accnt[0]?.toLowerCase()?.includes(searchTerm?.toLowerCase())
          )
        : khaatas
    );
  }
  // Create Spreadsheet API
  async function handleAddKhata() {
    toggleKhataModal(false);

    showLoader();
    const addSheetResponse = await axios
      .post(
        spreadsheetLink,
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

    if (addSheetResponse?.spreadsheetId) {
      await axios
        .post(
          addKhataLink,
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
    }
    hideLoader();
    getKhatas();
    setKhataName("");
  }

  const COLORS = [deepOrange, deepPurple, lightBlue, indigo];
  const noKhata = (
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
  );

  const khataList = (
    <>
      <Stack spacing={2} direction="column" sx={{ my: 2 }}>
        <div className={styles.addCustomerContainer}>
          <div className={styles.khaateLabel}>
            <span className={styles.accountsLabel}>Khaate</span>
            <RefreshIcon
              onClick={() => {
                getKhatas();
              }}
            />
          </div>
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
            <PersonAddIcon />
            {/* <p className={styles.addCustomerLabel}>Add</p> */}
          </Button>
        </div>
        <SearchBar handleAccountSearch={handleAccountSearch} />
      </Stack>
      {filteredKhaatas?.length ? (
        filteredKhaatas?.map((khata, index) => (
          <Stack key={khata[0]} spacing={2} direction="column">
            <button
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
                    {khata?.length ? khata[0].charAt(0) : ""}
                  </Avatar>
                  <span className={styles.contactName}>{khata[0]}</span>
                </p>
              </section>
            </button>
          </Stack>
        ))
      ) : (
        <p className={styles.noRecordFound}>Sorry, No Khata found.</p>
      )}
    </>
  );
  if (loader) {
    return <CustomLoader />;
  }
  return (
    <main className={styles.homepageContainer}>
      {!khaatas?.length ? noKhata : khataList}
      {/* {isModalOpen && (
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
                  toggleModal(false);
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
      )} */}
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
