import { useRouter } from "next/router";
import * as React from "react";
import AddTransaction from "../src/components/Transaction/AddTransaction";

export default function AddTransactionPage() {
  const { query } = useRouter();
  const { sheetName, sheetId, spreadsheetId } = query;
  return (
    <AddTransaction
      sheetName={sheetName}
      sheetId={sheetId}
      spreadsheetId={spreadsheetId}
    />
  );
}
