import { Box, Typography, Stack } from "@mui/material";
import { useState } from "react";
import AccountsForm from "../components/accounts/AccountsForm";
import AccountsList from "../components/accounts/AccountsList";

const Accounts = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAccountAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Manage Accounts
      </Typography>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        <Box sx={{ flex: { xs: 1, lg: "0 0 40%" } }}>
          <AccountsForm onAccountAdded={handleAccountAdded} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <AccountsList refreshTrigger={refreshTrigger} />
        </Box>
      </Stack>
    </Box>
  );
};

export default Accounts;