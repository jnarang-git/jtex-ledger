import * as React from "react";
import { useRouter } from "next/router";
import styles from "./Contact.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
export default function Contact({
  contact,
  spreadsheetsId,
  token,
  getAccounts,
  setAccountsBalances,
}) {
  const router = useRouter();
  const sheetId = contact?.properties?.sheetId;
  const [totalAmount, setTotalAmount] = React.useState("");
  async function handleDeleteSheet() {
    await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}:batchUpdate`,
      {
        requests: [
          {
            deleteSheet: {
              sheetId: sheetId,
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
    getAccounts();
  }
  async function getAmount() {
    const sheetName = contact?.properties?.title;
    await axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsId}/values/${sheetName}!A2:B`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resObj) => resObj.data)
      .then((res) => {
        const total = res?.values?.reduce(
          (previousValue, currentValue) =>
            previousValue + parseInt(currentValue[1]),
          0
        );
        if (total) {
          setTotalAmount(total);
          setAccountsBalances((prev) => [...prev, total]);
        }
      });
  }

  React.useEffect(() => {
    getAmount();
  }, []);

  return (
    <main
      className={styles.contactContainer}
      onClick={() =>
        router.push(
          `/add-transaction?sheetName=${contact?.properties?.title}&sheetId=${contact?.properties?.sheetId}`
        )
      }
    >
      <section className={styles.sectionContainer}>
        <p className={styles.contactNameSection}>
          <span className={styles.avatar}>A</span>
          <span className={styles.contactName}>
            {contact?.properties?.title}
          </span>
        </p>
        <p
          className={`${styles.amount} ${
            totalAmount >= 0 ? styles.green : styles.red
          }`}
        >
          {totalAmount}
        </p>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSheet();
          }}
        >
          <DeleteIcon />
        </div>
      </section>
    </main>
  );
}
