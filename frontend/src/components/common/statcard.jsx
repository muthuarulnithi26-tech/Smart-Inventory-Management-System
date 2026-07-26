import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({
  label,
  value,
  icon,
  gradient = "linear-gradient(135deg, #1976d2, #42a5f5)",
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        background: gradient,
        color: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        height: "100%",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 35px rgba(0,0,0,0.22)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              mb: 1,
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {value ?? 0}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
}