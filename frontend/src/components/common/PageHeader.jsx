import { Box, Typography, Button } from "@mui/material";
import AppBreadcrumbs from "./AppBreadcrumbs";

/**
 * Standard header for every list/detail page in the app.
 *
 * <PageHeader
 *   title="Warehouse Management"
 *   subtitle="Manage storage locations and capacity"
 *   actionLabel="Add Warehouse"
 *   actionIcon={<AddIcon />}
 *   onAction={() => setOpen(true)}
 *   breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Warehouses" }]}
 * />
 */
export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  actionDisabled = false,
  breadcrumbs,
  children, // slot for extra buttons/actions next to the primary one
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <AppBreadcrumbs items={breadcrumbs} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {children}
          {actionLabel && (
            <Button
              variant="contained"
              startIcon={actionIcon}
              onClick={onAction}
              disabled={actionDisabled}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
