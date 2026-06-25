import { Box, Paper, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a 0%,#1e293b 40%,#334155 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
            p: 4,
            textAlign: "center",
          }}
        >
          <Inventory2Icon
            sx={{
              fontSize: 55,
              mb: 1,
            }}
          />

          <Typography
            variant="h5"
            fontWeight={800}
          >
            Smart Inventory
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              opacity: 0.9,
            }}
          >
            Inventory Management System
          </Typography>
        </Box>

        <Box
          sx={{
            p: 4,
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
