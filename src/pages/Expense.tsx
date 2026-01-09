import { Box, Typography, Paper } from "@mui/material";

const Expense = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Expense Management
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Track Your Expenses
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Monitor and categorize all your expenses
        </Typography>
        
        {/* Filter expense transactions when implemented */}
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Expense-specific features coming soon. Use the Transactions page to manage all transactions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Expense;