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
  FormControl,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAllTransactions, deleteTransaction } from "../../services/transaction.service";
import { getCurrencyRates } from "../../services/currency.service";
import TimeFilter, { type FilterType } from "../common/TimeFilter";

interface Transaction {
  _id: string;
  accountId: {
    _id: string;
    name: string;
    currency?: string;
  };
  toAccountId?: {
    _id: string;
    name: string;
  };
  amount: number;
  type: "income" | "expense" | "transfer";
  category: string;
  date: string;
  description?: string;
}

interface Props {
  refreshTrigger?: number;
  displayCurrency?: string;
}

const ExpenseList = ({ refreshTrigger, displayCurrency = "USD" }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const [data, rates] = await Promise.all([
        getAllTransactions(),
        getCurrencyRates(),
      ]);
      setCurrencyRates(rates.rates);
      // Filter only expense transactions
      const expenseTransactions = data.filter(
        (t: Transaction) => t.type === "expense"
      );
      setTransactions(expenseTransactions);
      setFilteredTransactions(expenseTransactions);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  useEffect(() => {
    filterTransactions();
  }, [filterType, selectedYear, selectedMonth, selectedDate, transactions]);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete expense");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    transactions.forEach((t) => {
      years.add(new Date(t.date).getFullYear());
    });
    const yearArray = Array.from(years).sort((a, b) => b - a);
    return yearArray.length > 0 ? yearArray : [new Date().getFullYear()];
  };

  const getTotalExpenses = () => {
    return filteredTransactions.reduce((sum, t) => {
      const accountCurrency = t.accountId?.currency || "USD";
      const converted = convertAmount(t.amount, accountCurrency, displayCurrency);
      return sum + converted;
    }, 0);
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
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Expenses
        </Typography>
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
      </Paper>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">
          Your Expenses ({filteredTransactions.length})
        </Typography>
        <Typography variant="h6" color="error.main" fontWeight="bold">
          Total: {formatAmount(getTotalExpenses(), displayCurrency)}
        </Typography>
      </Box>

      {filteredTransactions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No expenses found for the selected filter.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <strong>Account</strong>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Amount</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction._id} hover>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{transaction.category}</Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: "block", sm: "none" } }}
                    >
                      {formatDate(transaction.date)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {transaction.accountId?.name || "N/A"}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {transaction.description || <em>No description</em>}
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="error.main" fontWeight="bold">
                    -{formatAmount(convertAmount(transaction.amount, transaction.accountId?.currency || "USD", displayCurrency), displayCurrency)}
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
      )}
    </Box>
  );
};

export default ExpenseList;
