import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { createAccount } from "../../services/account.service";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Props {
  onAccountAdded?: () => void;
}

const AccountsForm = ({ onAccountAdded }: Props) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "VND", label: "VND - Vietnamese Dong" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !balance) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await createAccount({
        name,
        balance: parseFloat(balance),
        currency,
      });
      setSuccess("Account created successfully!");
      
      // Reset form
      setName("");
      setBalance("");
      setCurrency("USD");
      
      // Trigger callback to refresh list
      if (onAccountAdded) {
        onAccountAdded();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          Add New Account
        </Typography>
        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Account Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Main Checking, Savings, Credit Card"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Initial Balance"
          type="number"
          fullWidth
          required
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          inputProps={{ step: 0.01 }}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Currency"
          fullWidth
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          sx={{ mb: 3 }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AccountsForm;
