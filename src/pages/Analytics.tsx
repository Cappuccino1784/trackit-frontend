import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#a4de6c",
];

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("month");
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

  const convertToDisplayCurrency = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === displayCurrency) return amount;
    if (!currencyRates[fromCurrency] || !currencyRates[displayCurrency]) return amount;
    const amountInUSD = amount / currencyRates[fromCurrency];
    return amountInUSD * currencyRates[displayCurrency];
  };

  const getAvailableYears = (): number[] => {
    const years = new Set<number>();
    transactions.forEach((t) => {
      years.add(new Date(t.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const getIncomeVsExpenseData = (): CategoryData[] => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + convertToDisplayCurrency(t.amount, t.accountId.currency), 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + convertToDisplayCurrency(t.amount, t.accountId.currency), 0);

    return [
      { name: "Income", value: parseFloat(income.toFixed(2)) },
      { name: "Expense", value: parseFloat(expense.toFixed(2)) },
    ].filter((item) => item.value > 0);
  };

  const getExpenseByCategoryData = (): CategoryData[] => {
    const categoryMap = new Map<string, number>();

    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const amount = convertToDisplayCurrency(t.amount, t.accountId.currency);
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + amount);
      });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getIncomeByCategoryData = (): CategoryData[] => {
    const categoryMap = new Map<string, number>();

    filteredTransactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        const amount = convertToDisplayCurrency(t.amount, t.accountId.currency);
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + amount);
      });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getTotalIncome = (): number => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + convertToDisplayCurrency(t.amount, t.accountId.currency), 0);
  };

  const getTotalExpense = (): number => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + convertToDisplayCurrency(t.amount, t.accountId.currency), 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const incomeVsExpenseData = getIncomeVsExpenseData();
  const expenseByCategoryData = getExpenseByCategoryData();
  const incomeByCategoryData = getIncomeByCategoryData();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const netSavings = totalIncome - totalExpense;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Analytics & Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Filters */}
        <Paper sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
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
            <CurrencySelector
              value={displayCurrency}
              currencies={supportedCurrencies}
              onChange={setDisplayCurrency}
              label="Display Currency"
            />
          </Stack>
        </Paper>

        {/* Summary Cards */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h5" color="success.main">
                  {displayCurrency} {totalIncome.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Expense
                </Typography>
                <Typography variant="h5" color="error.main">
                  {displayCurrency} {totalExpense.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Net Savings
                </Typography>
                <Typography
                  variant="h5"
                  color={netSavings >= 0 ? "success.main" : "error.main"}
                >
                  {displayCurrency} {netSavings.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Stack>

        {/* Charts */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Income vs Expense */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "400px" }}>
              <Typography variant="h6" gutterBottom>
                Income vs Expenses
              </Typography>
              {incomeVsExpenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={incomeVsExpenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeVsExpenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#00C49F" : "#FF8042"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${displayCurrency} ${value.toFixed(2)}`, "Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="80%"
                >
                  <Typography color="text.secondary">
                    No data available for the selected period
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Expense by Category */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "400px" }}>
              <Typography variant="h6" gutterBottom>
                Expense by Category
              </Typography>
              {expenseByCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={expenseByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${displayCurrency} ${value.toFixed(2)}`, "Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="80%"
                >
                  <Typography color="text.secondary">
                    No expense data for the selected period
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Income by Category */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "400px" }}>
              <Typography variant="h6" gutterBottom>
                Income by Category
              </Typography>
              {incomeByCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={incomeByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${displayCurrency} ${value.toFixed(2)}`, "Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="80%"
                >
                  <Typography color="text.secondary">
                    No income data for the selected period
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Category Details */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "400px", overflow: "auto" }}>
              <Typography variant="h6" gutterBottom>
                Top Expense Categories
              </Typography>
              {expenseByCategoryData.length > 0 ? (
                <Stack spacing={2}>
                  {expenseByCategoryData.map((category, index) => (
                    <Box key={category.name}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: COLORS[index % COLORS.length],
                            }}
                          />
                          <Typography>{category.name}</Typography>
                        </Box>
                        <Typography fontWeight="bold">
                          {displayCurrency} {category.value.toFixed(2)}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: "grey.200",
                          borderRadius: 1,
                          mt: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(category.value / totalExpense) * 100}%`,
                            height: "100%",
                            bgcolor: COLORS[index % COLORS.length],
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="80%"
                >
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Analytics;