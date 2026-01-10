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
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { getAllAccounts, deleteAccount } from "../../services/account.service";
import { getCurrencyRates, getSupportedCurrencies } from "../../services/currency.service";

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
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);

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

  const fetchCurrencyData = async () => {
    try {
      setRatesLoading(true);
      const [rates, currencies] = await Promise.all([
        getCurrencyRates(),
        getSupportedCurrencies(),
      ]);
      setCurrencyRates(rates.rates);
      setSupportedCurrencies(currencies);
    } catch (err: any) {
      console.error("Failed to load currency data:", err);
      // Set default currencies if API fails
      setSupportedCurrencies(["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchCurrencyData();
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

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = currencyRates[fromCurrency] || 1;
    const toRate = currencyRates[toCurrency] || 1;
    
    // Convert: amount in fromCurrency -> USD -> toCurrency
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => {
      const convertedBalance = convertAmount(account.balance, account.currency, displayCurrency);
      return sum + convertedBalance;
    }, 0);
  };

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    setDisplayCurrency(event.target.value);
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
      {/* Currency Selector */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Display Currency:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={displayCurrency}
            onChange={handleCurrencyChange}
            disabled={ratesLoading}
          >
            {supportedCurrencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatAmount(getTotalBalance(), displayCurrency)}
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
                    {formatAmount(convertAmount(account.balance, account.currency, displayCurrency), displayCurrency)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {account.balance !== convertAmount(account.balance, account.currency, displayCurrency) && 
                      `Original: ${formatAmount(account.balance, account.currency)}`
                    }
                  </Typography>
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
