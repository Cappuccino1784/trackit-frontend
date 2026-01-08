import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAllTransactions, deleteTransaction } from "../../services/transaction.service";

interface Transaction {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description?: string;
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No transactions found. Create your first transaction above!
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Your Transactions ({transactions.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell align="right"><strong>Amount</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id} hover>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  {transaction.description || <em>No description</em>}
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type}
                    color={transaction.type === "income" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={transaction.type === "income" ? "success.main" : "error.main"}
                    fontWeight="bold"
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatAmount(transaction.amount)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(transaction._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionList;
