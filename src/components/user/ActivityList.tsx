import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";


// ActivityList Component
export function ActivityList({ activities }: { activities: any[] }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          最近活动
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <>
              <ListItem key={index}>
                <ListItemText
                  primary={`${activity.category} - ${activity.distance} km`}
                  secondary={new Date(activity.date).toLocaleString()}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
