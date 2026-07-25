import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/**
 * Drop-in replacement for <TextField type="password" /> with a visibility
 * toggle. Forwards every other TextField prop (label, value, onChange,
 * error, helperText, autoFocus, etc.)
 */
export default function PasswordField({ ...props }) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      type={show ? "text" : "password"}
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              edge="end"
              tabIndex={-1}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
