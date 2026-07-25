import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Turns "manager-dashboard" -> "Manager Dashboard"
function humanize(segment) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Auto-generates breadcrumbs from the current URL path.
 * Optionally pass `items` to override with custom labels:
 *   <AppBreadcrumbs items={[{ label: "Manager", to: "/manager" }, { label: "Products" }]} />
 */
export default function AppBreadcrumbs({ items }) {
  const location = useLocation();

  const crumbs =
    items ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment, idx, arr) => ({
        label: humanize(segment),
        to: "/" + arr.slice(0, idx + 1).join("/"),
      }));

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 1.5, fontSize: 14 }}
    >
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="text.secondary"
        sx={{ fontSize: 14 }}
      >
        Home
      </Link>

      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        if (isLast || !crumb.to) {
          return (
            <Typography key={idx} color="text.primary" sx={{ fontSize: 14, fontWeight: 600 }}>
              {crumb.label}
            </Typography>
          );
        }
        return (
          <Link
            key={idx}
            component={RouterLink}
            to={crumb.to}
            underline="hover"
            color="text.secondary"
            sx={{ fontSize: 14 }}
          >
            {crumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
