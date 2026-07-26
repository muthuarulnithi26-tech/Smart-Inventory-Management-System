import { Box, Typography } from "@mui/material";

export default function MiniBarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {data.map((d) => (
        <Box key={d.label}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>{d.label}</Typography>
            <Typography variant="body2" color="text.secondary">{d.value}</Typography>
          </Box>
          <Box sx={{ height: 10, bgcolor: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
            <Box
              sx={{
                height: "100%",
                width: `${(d.value / max) * 100}%`,
                bgcolor: d.color || "#2563eb",
                borderRadius: 5,
                transition: "width .4s ease",
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
