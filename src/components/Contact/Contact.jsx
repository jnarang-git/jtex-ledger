import * as React from "react";
import { useRouter } from "next/router";
import styles from "./Contact.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
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
import { Avatar } from "@mui/material";
export default function Contact({
  contact,
  spreadsheetsId,
  token,
  getAccounts,
  setAccountsBalances,
  setAccountsTxns,
  index,
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
        const abc = [];
        res?.values?.forEach((value) => {
          abc.push({
            date: value[0],
            amount: value[1],
          });
        });
        setAccountsTxns((prev) => prev.concat(abc));

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
  const COLORS = [deepOrange, deepPurple, lightBlue, indigo];
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
          <Avatar
            sx={{
              bgcolor: COLORS[index % 4][500],
            }}
          >
            {contact?.properties?.title?.charAt(0)}
          </Avatar>
          <span className={styles.contactName}>
            {contact?.properties?.title}
          </span>
        </p>
        <p
          className={`${styles.amount} ${
            totalAmount
              ? totalAmount >= 0
                ? styles.red
                : styles.green
              : styles.grey
          }`}
        >
          {totalAmount > 0 ? (
            <p>
              <span>{Math.abs(totalAmount) || "No dues"}</span>
              <sub>{totalAmount ? "(Dena)" : ""}</sub>
            </p>
          ) : (
            (
              <p>
                <span>{Math.abs(totalAmount) || "No dues"}</span>
                <sub>{totalAmount ? "(Lena)" : ""}</sub>
              </p>
            ) || "No dues"
          )}
        </p>
        {/* <div
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSheet();
          }}
        >
          <DeleteIcon />
        </div> */}
      </section>
    </main>
  );
}
