import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import AddIcon from "@mui/icons-material/Add";

const Transactions = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDrawerOpen(true)}
          size="large"
        >
          Add Transaction
        </Button>
      </Box>

      <TransactionList refreshTrigger={refreshTrigger} />
      
      <TransactionForm 
        onTransactionAdded={handleTransactionAdded}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default Transactions;
