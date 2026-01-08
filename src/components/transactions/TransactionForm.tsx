import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createTransaction } from "../../services/transaction.service";

const TransactionForm = () => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || !type || !category || !date) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
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
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Add New Transaction
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Type"
          fullWidth
          required
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          sx={{ mb: 2 }}
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>

        <TextField
          label="Category"
          fullWidth
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Salary, Food, Entertainment"
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
    </Paper>
  );
};

export default TransactionForm;
