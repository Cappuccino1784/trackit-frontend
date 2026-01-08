import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const PageContainer = ({ title, children }: Props) => {
  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {title}
      </Typography>

      {children}
    </Box>
  );
};

export default PageContainer;
