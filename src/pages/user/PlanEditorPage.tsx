import { useMonthlyPlans } from "../../features/user/trainPlanAPI";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Box, Card, CardContent, Skeleton, Typography, TextField, IconButton, Checkbox } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Plan } from "../../types/trainPLan";
import Layout from "../../components/common/Layout";


function PlanEditor() {
  const today: Dayjs = dayjs();
  const { data: monthlyPlans, isLoading: isMonthlyLoading } = useMonthlyPlans(today);

  const [editId, setEditId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [monthlyPlanState, setMonthlyPlanState] = useState<Plan[]>([]);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);

  useEffect(()=>{
    if(monthlyPlans){
      setMonthlyPlanState((monthlyPlans))
    }
  },[monthlyPlans]);

  const handleEditClick = (planId: number, currentTitle: string) => {
    setEditId(planId);
    setEditedTitle(currentTitle);
  };

  const handleSave = (planId: number) => {
    // TODO: save
    console.log(`Saving plan ${planId} with new title: ${editedTitle}`);
    setEditId(null);
  };

  const toggleSubTaskCompleted = (taskId: number, subTaskId: number) => {
    setMonthlyPlanState(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(sub =>
                sub.id === subTaskId
                  ? { ...sub, completed: !sub.completed }
                  : sub
              ),
            }
          : task
      )
    );
  };
  const handleSubtaskContentChange = (planId: number, subtaskId: number, newValue: string) => {
    setLocalPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              subTasks: plan.subTasks.map((sub) =>
                sub.id === subtaskId
                  ? { ...sub, content: newValue }
                  : sub
              ),
            }
          : plan
      )
    );
  };

  return (
    <div>
      <Layout />
      {isMonthlyLoading?(
        <Skeleton variant="rectangular" width="100%" height={100} />
      ):(
        <Box>
              <Typography variant="h5" gutterBottom>📅 Monthly Plans</Typography>

              {monthlyPlanState.map((plan:Plan) => (
                <Card key={plan.id} sx={{ mb: 2 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* 第一行：日期、标题 + 编辑按钮 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(plan.date).format('YYYY-MM-DD')}
                        </Typography>
                        {editId === plan.id ? (
                          <TextField
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        ) : (
                          <Typography variant="h6">{plan.title}</Typography>
                        )}
                      </Box>

                      <Box>
                        {editId === plan.id ? (
                          <IconButton onClick={() => handleSave(plan.id)}>
                            <Save />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleEditClick(plan.id, plan.title)}>
                            <Edit />
                          </IconButton>
                        )}
                      </Box>
                    </Box>

                    {/* 第二行：Subtasks 列表 */}
                    {plan.subTasks && plan.subTasks.length > 0 && (
                      <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {plan.subTasks.map((sub) => (
                          <Box key={sub.id} display="flex" alignItems="center" gap={1}>
                            <Checkbox
                              checked={sub.completed}
                              onChange={() => toggleSubTaskCompleted(plan.id, sub.id)}
                            />
                            {editId === plan.id ? (
                              <TextField
                                value={sub.content}
                                onChange={(e) => handleSubtaskContentChange(plan.id, sub.id, e.target.value)}
                                size="small"
                                fullWidth
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: sub.completed ? 'line-through' : 'none',
                                }}
                              >
                                {sub.content}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>

                </Card>
              ))}
            </Box>
      )}
    </div>
  )
}

export default PlanEditor