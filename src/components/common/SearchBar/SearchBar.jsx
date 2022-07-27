import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

export default function SearchBar({ handleAccountSearch, setShowStats }) {
  return (
    <Paper
      //   component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#5d5da1",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search account"
        inputProps={{
          "aria-label": "search google maps",
        }}
        onChange={(e) => {
          handleAccountSearch(e.target.value);
        }}
        onFocus={() => {
          if (setShowStats) setShowStats(false);
        }}
        onBlur={() => {
          if (setShowStats) setShowStats(true);
        }}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
