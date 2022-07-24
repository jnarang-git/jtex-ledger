import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { InputAdornment } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as React from "react";
import DataGridTable from "../common/Datagrid/Datagrid";
import CustomModal from "../Modal/Modal";
import styles from "./AddTransaction.module.scss";
export default function AddTransaction({
  sheetName,
  accountBalanceDetails,
  setAccountBalanceDetails,
}) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [isModalOpen, toggleModal] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState("");
  const [txns, setTxns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [txnDate, setTxnDate] = React.useState(new Date());
  const [txnAmount, setTxnAmount] = React.useState(null);
  const [billNumber, setBillNumber] = React.useState(null);
  const [txnType, setTxnType] = React.useState("");
  const router = useRouter();
  const spreadsheetsId = "1TJrZaCqRLxjdTI085mMR1q20UotXoGyUkl2_yc91bBo";
  const accountNameRef = React.useRef();

  React.useEffect(() => {
    accountNameRef?.current?.focus();
  }, []);

  React.useEffect(() => {
    const tableRows = txns?.map((txn, index) => {
      return {
        id: index,
        date: txn[0],
        amount: txn[1],
        billNumber: txn[2] || "Cash",
      };
    });
    setRows(tableRows ?? []);
  }, [txns]);

  const handleChange = (newValue) => {
    setTxnDate(newValue);
  };

  async function getAmount() {
    await axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}/values/${sheetName}!A2:C`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resObj) => resObj.data)
      .then((res) => {
        setTxns(res?.values);
        const total = res?.values?.reduce(
          (previousValue, currentValue) =>
            previousValue + parseInt(currentValue[1]),
          0
        );
        setTotalAmount(total);
      });
  }
  React.useEffect(() => {
    getAmount();
  }, []);

  async function handleAddTxn() {
    if (txnAmount && txnDate) {
      await axios
        .post(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}/values/${sheetName}!A2:C:append?valueInputOption=USER_ENTERED`,
          {
            majorDimension: "ROWS",
            range: `${sheetName}!A2:C`,
            values: [
              [
                format(txnDate, "dd-MMM-yy"),
                txnType === "add" ? txnAmount : -txnAmount,
                billNumber,
              ],
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => res.data);
      setTxnAmount("");

      toggleModal(false);

      getAmount();
    }
  }

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 150,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
    },
    {
      field: "billNumber",
      headerName: "Bill Number",
      width: 150,
    },
  ];
  return (
    <div className={styles.homepageContainer}>
      <div className={styles.txnHeaderContainer}>
        <div className={`${styles.flex}`}>
          <div onClick={() => router.push("/accounts")}>
            <ArrowBackIcon />
          </div>
          <p className={styles.addTransactionLabel}>Trasanctions</p>
        </div>
        <div className={styles.actions}>
          {totalAmount && (
            <p
              className={`${styles.totalAmount} ${
                totalAmount >= 0 ? styles.green : styles.red
              }`}
            >
              Total: {totalAmount}
            </p>
          )}

          <div
            onClick={() => {
              toggleModal(true);
              setTxnType("add");
            }}
          >
            <AddCircleOutlineIcon fontSize="large" />
          </div>
          <div
            onClick={() => {
              toggleModal(true);
              setTxnType("sub");
            }}
          >
            <RemoveCircleOutlineIcon fontSize="large" />
          </div>
        </div>
      </div>
      {/* {txns?.map((txn) => (
        <Transaction txn={txn} />
      ))} */}
      <DataGridTable rows={rows} columns={columns} checkboxSelection={false} />;
      {isModalOpen && (
        <CustomModal isModalOpen={isModalOpen} toggleModal={toggleModal}>
          <Stack spacing={2} direction="column">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              className={styles.field}
            >
              <Stack spacing={3}>
                <MobileDatePicker
                  label="Date"
                  inputFormat="MM/dd/yyyy"
                  value={txnDate}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
            <TextField
              ref={accountNameRef}
              className={styles.field}
              id="outlined-number"
              label="Amount"
              type="number"
              autoComplete="off"
              startAdornment={
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              }
              value={txnAmount}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTxn();
                }
              }}
              onChange={(e) => {
                setTxnAmount(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={styles.field}
              id="outlined-number"
              label="Bill Number"
              type="number"
              autoComplete="off"
              value={billNumber}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTxn();
                }
              }}
              onChange={(e) => {
                setBillNumber(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={() => toggleModal(false)}>
                Cancel
              </Button>
              &nbsp; &nbsp;
              <Button
                disabled={!txnAmount?.length}
                variant="contained"
                onClick={() => {
                  handleAddTxn();
                }}
              >
                Add
              </Button>
            </Stack>
          </Stack>
        </CustomModal>
      )}
    </div>
  );
}
