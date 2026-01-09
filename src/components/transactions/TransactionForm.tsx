import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Collapse,
  IconButton,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { createTransaction } from "../../services/transaction.service";
import { getAllAccounts } from "../../services/account.service";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Props {
  onTransactionAdded?: () => void;
}

interface Account {
  _id: string;
  name: string;
  balance: number;
  currency: string;
}

const TransactionForm = ({ onTransactionAdded }: Props) => {
  const [accountId, setAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense" | "transfer">("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
      if (data.length > 0) {
        setAccountId(data[0]._id);
      }
    } catch (err: any) {
      console.error("Failed to load accounts", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!accountId || !amount || !type || !category || !date) {
      setError("Please fill in all required fields");
      return;
    }

    if (type === "transfer" && !toAccountId) {
      setError("Please select a receiving account for transfers");
      return;
    }

    if (type === "transfer" && accountId === toAccountId) {
      setError("Source and destination accounts must be different");
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        accountId,
        toAccountId: type === "transfer" ? toAccountId : undefined,
        amount: parseFloat(amount),
        type,
        category,
        date,
        description,
      });
      setSuccess("Transaction created successfully!");
      
      // Reset form
      setAmount("");
      setType("income");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setToAccountId("");
      if (accounts.length > 0) {
        setAccountId(accounts[0]._id);
      }
      
      // Trigger callback to refresh list
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          Add New Transaction
        </Typography>
        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box component="form" onSubmit={handleSubmit}>          {accounts.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Please create an account first before adding transactions.
            </Alert>
          )}

          <TextField
            select
            label={type === "transfer" ? "From Account" : "Account"}
            fullWidth
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={accounts.length === 0}
            sx={{ mb: 2 }}
          >
            {accounts.map((account) => (
              <MenuItem key={account._id} value={account._id}>
                {account.name} ({account.currency} {account.balance.toFixed(2)})
              </MenuItem>
            ))}
          </TextField>

          {type === "transfer" && (
            <TextField
              select
              label="To Account (Receiving)"
              fullWidth
              required
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              disabled={accounts.length === 0}
              sx={{ mb: 2 }}
            >
              {accounts.map((account) => (
                <MenuItem key={account._id} value={account._id}>
                  {account.name} ({account.currency} {account.balance.toFixed(2)})
                </MenuItem>
              ))}
            </TextField>
          )}

        <TextField
          label="Amount"
          type="number"
          fullWidth
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputProps={{ min: 0, max: 999999999, step: 0.01 }}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Type"
          fullWidth
          required
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense" | "transfer")}
          sx={{ mb: 2 }}
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
          <MenuItem value="transfer">Transfer</MenuItem>
        </TextField>

        <TextField
          label="Category"
          fullWidth
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Salary, Food, Entertainment"
          inputProps={{ maxLength: 50 }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          inputProps={{ maxLength: 200 }}
          sx={{ mb: 3 }}
        />

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
          {loading ? "Creating..." : "Create Transaction"}
        </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default TransactionForm;
