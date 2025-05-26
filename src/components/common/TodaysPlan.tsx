import {   
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button,
 } from "@mui/material"
 import { Plan } from '../../types/trainPLan';
 import dayjs from "dayjs";
 import { useNavigate } from "react-router-dom";

interface TodaysPlanProps {
  todaysPlan: Plan[] | null;
}

function TodaysPlan({todaysPlan}:TodaysPlanProps) {
  const navigate = useNavigate();
  return (
    <div>
        {!todaysPlan || todaysPlan.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4, borderRadius: 2 }}>
            <Typography variant="h6" textAlign="center">
              No training plan for today.
            </Typography>
          </Alert>
        ) : (
          todaysPlan.slice(0, 3).map((task:Plan) => (
            <Card key={task.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(task.date).format('YYYY-MM-DD')}
                  </Typography>
                </Box>

                {task.subTasks.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    {task.status}
                  </Typography>
                ) : (
                  <List dense>
                    {task.subTasks.map((sub) => (
                      <ListItem key={sub.id} disablePadding>
                        <ListItemIcon>
                          <Checkbox edge="start" checked={sub.completed} disableRipple disabled />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: sub.completed ? 'line-through' : 'none',
                                color: sub.completed ? 'text.disabled' : 'text.primary',
                              }}
                            >
                              {sub.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

          )))}
          {!todaysPlan || todaysPlan.length > 3 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/todayAll', { state: { todaysPlan } })} 
              >
                View all ({todaysPlan.length})
              </Button>
            </Box>
          )}
    </div>
  )
}

export default TodaysPlan