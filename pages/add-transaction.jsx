import styles from "../styles/Home.module.css";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Transaction from "../src/components/Transaction/Transaction";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomModal from "../src/components/Modal/Modal";
import AddTransaction from "../src/components/Transaction/AddTransaction";
import { useRouter } from "next/router";

export default function AddTransactionPage() {
  const { query } = useRouter();
  const { sheetName, sheetId } = query;
  return <AddTransaction sheetName={sheetName} sheetId={sheetId} />;
}
