import { Box, Typography } from "@mui/material";

export default function EmptyState({ text }) {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h6" color="gray">
        {text}
      </Typography>
    </Box>
  );
}
