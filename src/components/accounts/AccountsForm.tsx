import {
  Box,
  TextField,
  Button,
  MenuItem,
  Drawer,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { createAccount } from "../../services/account.service";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  onAccountAdded?: () => void;
  open: boolean;
  onClose: () => void;
}

const AccountsForm = ({ onAccountAdded, open, onClose }: Props) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      
      // Close drawer on success
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 400 } }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h5">
            Add New Account
          </Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
      </Box>
    </Drawer>
  );
};

export default AccountsForm;
