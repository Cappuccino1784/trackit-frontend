import { Box, Typography, Stack } from "@mui/material";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

const Transactions = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Transactions
      </Typography>
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={3}
        alignItems="flex-start"
      >
        <Box sx={{ width: { xs: "100%", md: "33%" } }}>
          <TransactionForm />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "67%" } }}>
          <TransactionList />
        </Box>
      </Stack>
    </Box>
  );
};

export default Transactions;
