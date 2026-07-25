import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

/**
 * <FilterSelect
 *   label="Status"
 *   value={status}
 *   onChange={setStatus}
 *   options={[
 *     { value: "all", label: "All Status" },
 *     { value: "active", label: "Active" },
 *     { value: "inactive", label: "Inactive" },
 *   ]}
 * />
 */
export default function FilterSelect({ label, value, onChange, options, sx }) {
  return (
    <FormControl size="small" sx={{ minWidth: 160, ...sx }}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
