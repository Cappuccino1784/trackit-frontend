import { Box, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

export type FilterType = "all" | "day" | "month" | "year";

interface TimeFilterProps {
  filterType: FilterType;
  selectedYear: number;
  selectedMonth: number;
  selectedDate: string;
  availableYears: number[];
  onFilterTypeChange: (value: FilterType) => void;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void;
  onDateChange: (value: string) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TimeFilter = ({
  filterType,
  selectedYear,
  selectedMonth,
  selectedDate,
  availableYears,
  onFilterTypeChange,
  onYearChange,
  onMonthChange,
  onDateChange,
}: TimeFilterProps) => {
  const handleFilterChange = (event: SelectChangeEvent<FilterType>) => {
    onFilterTypeChange(event.target.value as FilterType);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    onYearChange(event.target.value as number);
  };

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    onMonthChange(event.target.value as number);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value);
  };

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ flexWrap: "wrap" }}>
      <Box sx={{ minWidth: { xs: "100%", sm: "200px" }, flex: { sm: 1 } }}>
        <FormControl fullWidth>
          <InputLabel>Filter By</InputLabel>
          <Select value={filterType} label="Filter By" onChange={handleFilterChange}>
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filterType === "day" && (
        <Box sx={{ minWidth: { xs: "100%", sm: "200px" }, flex: { sm: 1 } }}>
          <FormControl fullWidth>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                padding: "16.5px 14px",
                border: "1px solid #c4c4c4",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: "inherit",
                width: "100%",
              }}
            />
          </FormControl>
        </Box>
      )}

      {(filterType === "month" || filterType === "year") && (
        <Box sx={{ minWidth: { xs: "100%", sm: "200px" }, flex: { sm: 1 } }}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} label="Year" onChange={handleYearChange}>
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {filterType === "month" && (
        <Box sx={{ minWidth: { xs: "100%", sm: "200px" }, flex: { sm: 1 } }}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} label="Month" onChange={handleMonthChange}>
              {months.map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Stack>
  );
};

export default TimeFilter;
