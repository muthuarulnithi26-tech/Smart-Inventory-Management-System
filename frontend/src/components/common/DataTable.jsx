import { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  Skeleton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * One table to rule every list page: loading skeleton, empty state,
 * error state (with retry), and client-side pagination all built in.
 *
 * <DataTable
 *   columns={[
 *     { field: "name", label: "Name" },
 *     { field: "location", label: "Location" },
 *     {
 *       field: "actions",
 *       label: "Actions",
 *       align: "right",
 *       render: (row) => (
 *         <>
 *           <IconButton onClick={() => onEdit(row)}><EditIcon /></IconButton>
 *           <IconButton onClick={() => onDelete(row)}><DeleteIcon /></IconButton>
 *         </>
 *       ),
 *     },
 *   ]}
 *   rows={filtered}
 *   loading={loading}
 *   error={error}
 *   onRetry={load}
 *   getRowId={(row) => row.id}
 *   emptyText="No warehouses yet"
 *   emptyActionLabel="Add Warehouse"
 *   onEmptyAction={() => setOpen(true)}
 * />
 */
export default function DataTable({
  columns,
  rows = [],
  loading = false,
  error = null,
  onRetry,
  getRowId = (row, idx) => row.id ?? idx,
  emptyText = "No records found",
  emptyActionLabel,
  onEmptyAction,
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  skeletonRows = 5,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  // Keep page in range if the underlying data shrinks (e.g. after a delete
  // or a new search filter) so users don't land on a blank page.
  const maxPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1);
  if (page > maxPage && maxPage >= 0) {
    setPage(maxPage);
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f1f5f9" }}>
            {columns.map((col) => (
              <TableCell key={col.field} align={col.align || "left"}>
                <b>{col.label}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* LOADING: skeleton rows */}
          {loading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <TableCell key={col.field}>
                    <Skeleton variant="text" height={28} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {/* ERROR STATE */}
          {!loading && error && (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ border: 0 }}>
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main", mb: 1 }} />
                  <Typography color="error" fontWeight={600}>
                    {typeof error === "string" ? error : "Something went wrong"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Please check your connection and try again.
                  </Typography>
                  {onRetry && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={onRetry}
                    >
                      Retry
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ border: 0 }}>
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <InboxIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                  <Typography color="text.secondary">{emptyText}</Typography>
                  {emptyActionLabel && onEmptyAction && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={onEmptyAction}
                    >
                      {emptyActionLabel}
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}

          {/* DATA */}
          {!loading &&
            !error &&
            paginated.map((row, idx) => (
              <TableRow key={getRowId(row, idx)} hover>
                {columns.map((col) => (
                  <TableCell key={col.field} align={col.align || "left"}>
                    {col.render ? col.render(row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {!loading && !error && rows.length > 0 && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </TableContainer>
  );
}
