import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface CurrencySelectorProps {
  value: string;
  currencies: string[];
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

const CurrencySelector = ({
  value,
  currencies,
  onChange,
  label = "Currency",
  disabled = false,
  size = "medium",
  fullWidth = false,
}: CurrencySelectorProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl 
      size={size} 
      sx={{ minWidth: 120 }} 
      fullWidth={fullWidth}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange}>
        {currencies.map((currency) => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CurrencySelector;
