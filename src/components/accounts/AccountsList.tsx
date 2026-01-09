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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { getAllAccounts, deleteAccount } from "../../services/account.service";

interface Account {
  _id: string;
  name: string;
  balance: number;
  currency: string;
}

interface Props {
  refreshTrigger?: number;
}

const AccountsList = ({ refreshTrigger }: Props) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      await deleteAccount(id);
      setAccounts(accounts.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
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

  if (accounts.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No accounts found. Create your first account above!
      </Alert>
    );
  }

  return (
    <Box>
      {/* Summary Card */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatAmount(getTotalBalance())}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Across {accounts.length} account{accounts.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
            <AccountBalanceIcon sx={{ fontSize: 60, opacity: 0.3 }} />
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Your Accounts ({accounts.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Account Name</strong></TableCell>
              <TableCell align="right"><strong>Balance</strong></TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}><strong>Currency</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account._id} hover>
                <TableCell>
                  <Typography fontWeight="medium">{account.name}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={account.balance >= 0 ? "success.main" : "error.main"}
                    fontWeight="bold"
                    fontSize={{ xs: "0.9rem", sm: "1.1rem" }}
                  >
                    {formatAmount(account.balance, account.currency)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>
                    {account.currency}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography variant="body2">{account.currency}</Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(account._id)}
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

export default AccountsList;
