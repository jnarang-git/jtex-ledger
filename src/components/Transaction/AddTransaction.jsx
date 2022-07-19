import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Transaction from "./Transaction";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CustomModal from "../Modal/Modal";
import styles from "./AddTransaction.module.scss";
import Button from "@mui/material/Button";
import axios from "axios";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import DataGridTable from "../common/Datagrid/Datagrid";
import { useSession } from "next-auth/react";

export default function AddTransaction({
  sheetName,
  accountBalanceDetails,
  setAccountBalanceDetails,
}) {
  const { data: session } = useSession();
  const token =
    "ya29.A0AVA9y1tAn5TOmUjXQE5oZ0P7syscBFJAGb6WX9IscoJT8QR4Upwo8xmfprgg8uFd69pTxN6jSVSfCplXbJQ2wsxrvPLUlFrAWuRXGTmjs4jBkBWUKPTwUQNCpOkE1b6RRlkWj_2nw-gZt18_xH9UwC9M4TvpYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4cHFjbFVadlNqM2txSHZjdEhMREJuUQ0163" ??
    session?.accessToken;
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

  React.useEffect(() => {
    const tableRows = txns?.map((txn, index) => {
      return { id: index, date: txn[0], amount: txn[1], billNumber: txn[2] };
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
      await axios.post(
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
      );
      toggleModal(false);
      setTxnAmount("");
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
          <p className={styles.addTransactionLabel}>{sheetName}</p>
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
            className={styles.field}
            id="outlined-number"
            label="Amount"
            type="number"
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
          <Button variant="contained" onClick={() => toggleModal(false)}>
            Cancel
          </Button>
          &nbsp; &nbsp;
          <Button
            variant="contained"
            onClick={() => {
              handleAddTxn();
            }}
          >
            Add
          </Button>
        </CustomModal>
      )}
    </div>
  );
}
