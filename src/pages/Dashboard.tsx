import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getAllTransactions } from "../services/transaction.service";
import { getCurrencyRates, getSupportedCurrencies } from "../services/currency.service";
import TimeFilter, { type FilterType } from "../components/common/TimeFilter";
import CurrencySelector from "../components/common/CurrencySelector";

interface Transaction {
  _id: string;
  accountId: {
    _id: string;
    name: string;
    currency: string;
  };
  amount: number;
  type: "income" | "expense" | "transfer";
  category: string;
  date: string;
  description?: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filterType, selectedYear, selectedMonth, selectedDate, transactions]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transData, rates, currencies] = await Promise.all([
        getAllTransactions(),
        getCurrencyRates(),
        getSupportedCurrencies(),
      ]);
      setTransactions(transData);
      setFilteredTransactions(transData);
      setCurrencyRates(rates.rates);
      setSupportedCurrencies(currencies);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load data");
      // Set default currencies if API fails
      setSupportedCurrencies(["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (filterType === "day") {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date).toISOString().split("T")[0];
        return transactionDate === selectedDate;
      });
    } else if (filterType === "month") {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === selectedMonth &&
          transactionDate.getFullYear() === selectedYear
        );
      });
    } else if (filterType === "year") {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === selectedYear;
      });
    }

    setFilteredTransactions(filtered);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = currencyRates[fromCurrency] || 1;
    const toRate = currencyRates[toCurrency] || 1;
    
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  };

  const getTotalIncome = () => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => {
        const converted = convertAmount(t.amount, t.accountId.currency, displayCurrency);
        return sum + converted;
      }, 0);
  };

  const getTotalExpense = () => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => {
        const converted = convertAmount(t.amount, t.accountId.currency, displayCurrency);
        return sum + converted;
      }, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    transactions.forEach((t) => {
      years.add(new Date(t.date).getFullYear());
    });
    const yearArray = Array.from(years).sort((a, b) => b - a);
    return yearArray.length > 0 ? yearArray : [new Date().getFullYear()];
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      {/* Filter and Currency Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter & Display Options
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, width: "100%" }}>
            <TimeFilter
              filterType={filterType}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDate={selectedDate}
              availableYears={getAvailableYears()}
              onFilterTypeChange={setFilterType}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
              onDateChange={setSelectedDate}
            />
          </Box>
          <Box sx={{ minWidth: { xs: "100%", sm: "150px" } }}>
            <CurrencySelector
              value={displayCurrency}
              currencies={supportedCurrencies}
              onChange={setDisplayCurrency}
              fullWidth
            />
          </Box>
        </Stack>
      </Paper>

      {/* Summary Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: "success.light", color: "white" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Income
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {formatAmount(getTotalIncome(), displayCurrency)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: "error.light", color: "white" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {formatAmount(getTotalExpense(), displayCurrency)}
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Balance
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {formatAmount(getBalance(), displayCurrency)}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction Summary
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} 
          {filterType !== "all" && ` for selected ${filterType}`}
        </Typography>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Income Transactions
            </Typography>
            <Typography variant="h6" color="success.main">
              {filteredTransactions.filter((t) => t.type === "income").length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Expense Transactions
            </Typography>
            <Typography variant="h6" color="error.main">
              {filteredTransactions.filter((t) => t.type === "expense").length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Transfer Transactions
            </Typography>
            <Typography variant="h6" color="info.main">
              {filteredTransactions.filter((t) => t.type === "transfer").length}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Dashboard;