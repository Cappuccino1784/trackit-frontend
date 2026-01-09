import { Box, Typography, Stack } from "@mui/material";
import { useState } from "react";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

const Transactions = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Transactions
      </Typography>
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={3}
        alignItems="flex-start"
      >
        <Box sx={{ width: { xs: "100%", md: "33%" } }}>
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "67%" } }}>
          <TransactionList refreshTrigger={refreshTrigger} />
        </Box>
      </Stack>
    </Box>
  );
};

export default Transactions;
