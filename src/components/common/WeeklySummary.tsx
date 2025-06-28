import { Plan } from "../../types/trainPLan"
import { Box, Typography, LinearProgress } from "@mui/material";

type Props = {
  weeklyplans: Plan[];
};

function WeeklySummary({weeklyplans}:Props) {
  const completedCount = weeklyplans.filter(plan => plan.status==='completed').length;
  const total = weeklyplans.length;
  const percentage = total === 0 ? 0 : (completedCount / total) * 100;

  return (
    <Box p={2} bgcolor="#f0f4ff" borderRadius={2} mt={1}>
      <Typography variant="h6" gutterBottom>
        🎯 Weekly Progress
      </Typography>
      <Typography variant="body1" color="primary">
        {total === 0
          ? "📭 No plans scheduled for this week. Time to set some goals! 📝"
          :completedCount === total
          ? "🌟 Amazing! You completed all your plans this week!"
          : `✅ ${completedCount} / ${total} plans completed. Keep it up! 💪`}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{ height: 10, borderRadius: 5, mt: 1 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        { total === 0
          ? "" 
          :completedCount === total
          ? "🏅 You’ve earned a rest day!"
          : "🔥 You’re doing great! Stay on track!"}
      </Typography>
    </Box>
  )
}

export default WeeklySummary