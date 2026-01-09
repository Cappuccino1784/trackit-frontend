import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";

interface Props {
  drawerWidth: number;
}

const Sidebar = ({ drawerWidth }: Props) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        <ListItemButton component={NavLink} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/accounts">
          <ListItemText primary="Accounts" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/transactions">
          <ListItemText primary="Transactions" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/income">
          <ListItemText primary="Income" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/expense">
          <ListItemText primary="Expense" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/analytics">
          <ListItemText primary="Analytics" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
