import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";

export default function DataGridTable({ rows, columns }) {
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
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Records Found
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
