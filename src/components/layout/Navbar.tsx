import { useAuth } from "../../context/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Expense Tracker
        </Typography>

        <Button 
          color="inherit" 
          onClick={logout}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
