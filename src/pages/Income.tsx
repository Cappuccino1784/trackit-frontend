import { Box, Typography, Paper } from "@mui/material";

const Income = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Income Management
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Track Your Income Sources
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Add and manage all your income transactions here
        </Typography>
        
        {/* Filter income transactions when implemented */}
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Income-specific features coming soon. Use the Transactions page to manage all transactions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Income;