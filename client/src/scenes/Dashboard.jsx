import BreakdownChart from "@/components/BreakdownChart";
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import OverviewChart from "@/components/OverviewChart";
import StatBox from "@/components/StatBox";
import VoiceInterface from "@/components/VoiceInterface";
import AIExplainedChart from "@/components/AIExplainedChart"; // Import AI wrapper
import {useGetDashboardQuery} from "@/state/api";

import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import {DataGrid} from "@mui/x-data-grid";
import {useState} from "react";

function Dashboard() {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const {data, isLoading} = useGetDashboardQuery();

  const [aiInsights, setAiInsights] = useState([]);

  const columns = [
    {field: "_id", headerName: "ID", flex: 1},
    {field: "userId", headerName: "User ID", flex: 1},
    {field: "createdAt", headerName: "CreatedAt", flex: 1},
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  if (!data || isLoading)
    return (
      <Box
        width="100%"
        height="100%"
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="secondary" />
      </Box>
    );

  return (
    <Box m="1.5rem 2.5rem">
      {/* Top Header */}
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              "&:hover": {backgroundColor: theme.palette.secondary.light},
            }}
          >
            <DownloadOutlined sx={{mr: "10px"}} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      {/* Voice Interface */}
      <VoiceInterface
        onInsightReceived={(insight) => setAiInsights([insight, ...aiInsights])}
      />

      {/* Recent AI Insights */}
      {aiInsights.length > 0 && (
        <Box sx={{my: 3}}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: theme.palette.secondary[100],
              fontWeight: "bold",
              mb: 2,
            }}
          >
            🤖 Recent AI Insights
          </Typography>
          {aiInsights.slice(0, 3).map((insight, idx) => (
            <Paper
              key={idx}
              elevation={2}
              sx={{
                p: 2.5,
                mb: 2,
                backgroundColor: theme.palette.background.alt,
                border: `1px solid ${theme.palette.secondary[300]}`,
                borderRadius: "0.55rem",
                "&:hover": {
                  backgroundColor: theme.palette.background.default,
                  borderColor: theme.palette.secondary[200],
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              <Box sx={{display: "flex", alignItems: "flex-start", gap: 2}}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "50%",
                    p: 1,
                    minWidth: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{color: "white", fontWeight: "bold"}}
                  >
                    AI
                  </Typography>
                </Box>
                <Box sx={{flex: 1}}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.secondary[100],
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    {insight}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.secondary[300],
                      mt: 1,
                      display: "block",
                    }}
                  >
                    Generated {new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Grid Content */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": {gridColumn: isNonMediumScreens ? undefined : "span 12"},
        }}
      >
        <StatBox
          title="Total Customers"
          value={data && data.totalCustomers}
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{color: theme.palette.secondary[300], fontSize: "26px"}}
            />
          }
        />
        <StatBox
          title="Sales Today"
          value={data && data.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
              sx={{color: theme.palette.secondary[300], fontSize: "26px"}}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <AIExplainedChart title="Monthly Sales">
            <OverviewChart view="sales" isDashboard={true} />
          </AIExplainedChart>
        </Box>
        <StatBox
          title="Monthly Sales"
          value={data && data.thisMonthStats.totalSales}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{color: theme.palette.secondary[300], fontSize: "26px"}}
            />
          }
        />
        <StatBox
          title="Yearly Sales"
          value={data && data.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{color: theme.palette.secondary[300], fontSize: "26px"}}
            />
          }
        />
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{color: theme.palette.secondary[100]}}>
            Sales By Category
          </Typography>
          <AIExplainedChart title="Sales By Category">
            <BreakdownChart isDashboard={true} />
          </AIExplainedChart>
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{color: theme.palette.secondary[200]}}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales.
          </Typography>
        </Box>
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
          p="1rem"
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={columns}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
