import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CustomLoader() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
      <CircularProgress />
    </Box>
  );
}
