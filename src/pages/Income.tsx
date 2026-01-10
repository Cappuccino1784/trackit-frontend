import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import IncomeList from "../components/income/IncomeList";
import { getSupportedCurrencies } from "../services/currency.service";
import CurrencySelector from "../components/common/CurrencySelector";

const Income = () => {
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
        Income Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Track Your Income Sources
            </Typography>
            <Typography color="text.secondary">
              Add and manage all your income transactions with filtering options
            </Typography>
          </Box>
          <CurrencySelector
            value={displayCurrency}
            currencies={supportedCurrencies}
            onChange={setDisplayCurrency}
          />
        </Box>
      </Paper>

      <IncomeList displayCurrency={displayCurrency} />
    </Box>
  );
};

export default Income;