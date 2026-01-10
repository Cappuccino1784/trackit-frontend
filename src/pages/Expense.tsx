import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import ExpenseList from "../components/expense/ExpenseList";
import { getSupportedCurrencies } from "../services/currency.service";
import CurrencySelector from "../components/common/CurrencySelector";

const Expense = () => {
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const currencies = await getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    } catch (err) {
      // Set default currencies if API fails
      setSupportedCurrencies(["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"]);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Expense Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Track Your Expenses
            </Typography>
            <Typography color="text.secondary">
              Monitor and categorize all your expenses with filtering options
            </Typography>
          </Box>
          <CurrencySelector
            value={displayCurrency}
            currencies={supportedCurrencies}
            onChange={setDisplayCurrency}
          />
        </Box>
      </Paper>

      <ExpenseList displayCurrency={displayCurrency} />
    </Box>
  );
};

export default Expense;