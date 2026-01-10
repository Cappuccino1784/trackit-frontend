import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import AccountsForm from "../components/accounts/AccountsForm";
import AccountsList from "../components/accounts/AccountsList";
import AddIcon from "@mui/icons-material/Add";

const Accounts = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAccountAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Manage Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDrawerOpen(true)}
          size="large"
        >
          Add Account
        </Button>
      </Box>

      <AccountsList refreshTrigger={refreshTrigger} />
      
      <AccountsForm 
        onAccountAdded={handleAccountAdded}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default Accounts;