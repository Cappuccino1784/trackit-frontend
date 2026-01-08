import { Box, Toolbar } from "@mui/material";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  return (
    <Box display="flex">
      <Navbar />
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        component="main"
        flexGrow={1}
        sx={{ 
          ml: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
          maxWidth: "1400px",
          mx: "auto",
          p: 3
        }}
      >
        <Toolbar /> {/* pushes content below AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
