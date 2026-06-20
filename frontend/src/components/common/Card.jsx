import { Card as MuiCard, CardContent } from "@mui/material";

export default function Card({ children }) {
  return (
    <MuiCard sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
}
