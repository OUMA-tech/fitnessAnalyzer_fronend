// TrainingPlanSummary Component
import { Button } from "@mui/material";
import { Card, CardContent, Typography} from "@mui/material";

export function TrainingPlanSummary({ plan }: { plan: any }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          当前训练计划
        </Typography>
        <Typography variant="body1">
          {plan.title} - {plan.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          周期：{plan.durationWeeks} 周（当前第 {plan.currentWeek} 周）
        </Typography>
        <Button variant="contained" size="small" sx={{ mt: 2 }}>
          查看详情
        </Button>
      </CardContent>
    </Card>
  );
}
