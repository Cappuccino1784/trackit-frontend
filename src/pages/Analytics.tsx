import { Box, Typography, Paper, Stack } from "@mui/material";

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Analytics & Reports
      </Typography>

      <Stack spacing={3}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "300px" }}>
              <Typography variant="h6" gutterBottom>
                Income vs Expenses
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                <Typography color="text.secondary">
                  Chart coming soon
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: "300px" }}>
              <Typography variant="h6" gutterBottom>
                Category Breakdown
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                <Typography color="text.secondary">
                  Chart coming soon
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Trends
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="200px">
            <Typography color="text.secondary">
              Chart coming soon
            </Typography>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Analytics;