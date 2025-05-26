import { Plan } from "../../types/trainPLan";
import Grid from '@mui/material/GridLegacy';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import WeeklySummary from '../../components/common/WeeklySummary';
import { Paper, Divider } from "@mui/material";

interface WeeklyPlanProps {
  weeklyPlans: Plan[];
}

function WeeklyPlans({weeklyPlans}: WeeklyPlanProps) {
  console.log(weeklyPlans);
  const groupedByDate: Record<string, Plan[]> = {};
  weeklyPlans.forEach(plan => {
    const dayKey = dayjs(plan.date).startOf('day').toISOString();
    if (!groupedByDate[dayKey]) {
      groupedByDate[dayKey] = [];
    }
    groupedByDate[dayKey].push(plan);
  });
  const today = dayjs().startOf('day');

  const startOfWeek = dayjs().startOf('week'); // Sunday, or use .startOf('isoWeek') for Monday
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, 'day')
  );
  return(
    <>
      <Box padding={1}>
        <WeeklySummary weeklyplans={weeklyPlans} />
      </Box>
      <Box padding={1}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🗓️ Plan This Week
          </Typography>
          <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} columns={7}>
        {daysOfWeek.map((day) => (
          <Grid item xs={1} key={day.toISOString()}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: day.isSame(today, 'day') ? '2px solid #1976d2' : undefined,
                backgroundColor: day.isSame(today, 'day') ? '#e3f2fd' : undefined,
              }}
            >
              <CardContent>
                <Typography variant="h6" align="center">{day.format("ddd")}</Typography>
                <Typography variant="body2" align="center" gutterBottom>{day.format("MMM D")}</Typography>
                <Box sx={{ mt: 1 }}>
                {(groupedByDate[day.toISOString()] || []).map((plan) => (
                  <Typography
                    key={plan.id}
                    variant="body2"
                    sx={{ wordWrap: "break-word", whiteSpace: "normal" }}
                  >
                    📌{plan.title}
                  </Typography>
                ))}

                {(groupedByDate[day.toISOString()] || []).length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordWrap: "break-word", whiteSpace: "normal" }}
                  >
                    💤 Rest Day
                  </Typography>
                )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Paper>
      </Box>
    </>
)
}
export default WeeklyPlans