import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Stack } from "@mui/material";
import CustomLoader from "../Loader/Loader";

export default function DataGridTable({ rows, columns, loading }) {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        components={{
          NoRowsOverlay: (a) => {
            console.log("aaaa", a);
            return (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Records Found
              </Stack>
            );
          },
          LoadingOverlay: CustomLoader,
        }}
        loading={loading}
      />
    </Box>
  );
}
