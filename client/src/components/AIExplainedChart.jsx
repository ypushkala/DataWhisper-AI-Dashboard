// client/src/components/AIExplainedChart.jsx
import React, {useState} from "react";
import {
  Box,
  Button,
  Collapse,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

// Mock explanations
const mockExplanations = {
  "Sales By Category": `This pie chart shows accessories leading at 35% of total revenue.`,
  "Monthly Sales": `Monthly sales increased 21% this month compared to last month.`,
  // add other titles as needed
};

export default function AIExplainedChart({title, children}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleExplain = () => {
    setLoading(true);
    setOpen(false);
    setTimeout(() => {
      setExplanation(mockExplanations[title] || `Insight for "${title}".`);
      setOpen(true);
      setLoading(false);
    }, 700);
  };

  return (
    <Box>
      {/* Render the chart first */}
      <Box>{children}</Box>

      {/* Smaller AI Explain button */}
      <Box sx={{textAlign: "right", mt: 1}}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<SmartToyIcon fontSize="small" />}
          onClick={handleExplain}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            px: 1.5,
            py: 0.5,
            borderColor: theme.palette.secondary[300],
            color: theme.palette.secondary[200],
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          {loading ? "..." : "AI Explain"}
        </Button>
      </Box>

      {/* Collapsible explanation */}
      <Collapse in={open}>
        <Paper
          elevation={1}
          sx={{
            mt: 1,
            p: 1.5,
            backgroundColor: theme.palette.background.alt,
            borderLeft: `4px solid ${theme.palette.secondary[300]}`,
            borderRadius: "0.25rem",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <Typography
            variant="subtitle2"
            color={theme.palette.secondary[100]}
            gutterBottom
          >
            🧠 AI Analysis:
          </Typography>
          <Typography variant="body2" color={theme.palette.secondary[200]}>
            {explanation}
          </Typography>
        </Paper>
      </Collapse>
    </Box>
  );
}
