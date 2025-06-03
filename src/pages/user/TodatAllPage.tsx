import { Plan } from '../../types/trainPLan';
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Layout from '../../components/common/Layout';
import { blue } from '@mui/material/colors';
import { useTodayPlanFromWeekly } from '../../hooks/useDurationPlans';
import { toast } from 'react-toastify';
import { handleAxiosError } from '../../utils/handleAxiosError';
import { updatePlan } from '../../features/user/trainPlanAPI';
import { useEffect } from 'react';
import { usePlanBuilder } from '../../hooks/usePlanBuilder';



const TodayAllPage = () => {

  const { data: todayPlan } = useTodayPlanFromWeekly();
  console.log(todayPlan);
  
  const {
    plan,
    resetPlan,
    toggleExpand,
    toggleSubTaskCompleted,
    updatePlanStatus,
  } = usePlanBuilder();

  useEffect(() => {
    if (todayPlan) {
      resetPlan(todayPlan); 
    }
  }, [todayPlan]);

  const handleUpdatePlan = async (plan:Plan) => {
    try {
      await updatePlan(plan); 
      toast.success('Updated successfully!');
  
    } catch (err) {
      handleAxiosError(err, 'Failed to update plan');
    }
  };

  const handleMarkAsCompleted = async (plan: Plan) => {
    try {
      const updatedPlan = { ...plan, status: 'completed' };
      const success = await updatePlan(updatedPlan);
      if(success){
        updatePlanStatus(plan.id);
        toast.success('Updated successfully!');
      }
    } catch (err) {
      console.error('Failed to mark plan as completed:', err);
      toast.error('Failed to update plan');
    }
  };

  
  return (
    <Box>
      <Layout />
      <Box sx={{ p: 2 }} color={blue}>
        
        {plan.length === 0 ? (
          <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 8 }}
        >
          <Typography variant="h5" gutterBottom>
            🎉 No training plan for today!
          </Typography>
          <Typography color="textSecondary">
            Enjoy your free time or add a new plan.
          </Typography>
        </Box>
          ) : (plan.map(plan => (
          <Paper key={plan.id} className="p-3 space-y-8 shadow" sx={{ mt: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => toggleExpand(plan.id)}
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' },
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <Typography variant="h6">{plan.title}</Typography>
              </Box>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleExpand(plan.id); 
                }}
              >
                {plan.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>


            <Collapse in={plan.expanded}>
              {plan.subTasks.length === 0 ? (
                <Button
                  variant="contained"
                  color={plan.status === 'completed' ? 'success' : 'primary'}
                  startIcon={<CheckCircle />}
                  onClick={() => handleMarkAsCompleted(plan)}
                  disabled={plan.status === 'completed'}
                  sx={{ ml: 2 }}
                >
                  {plan.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                </Button>
              ) : (
                <>
                  {plan.subTasks.map(sub => (
                    <Box key={sub.id} display="flex" alignItems="center" pl={2}>
                      <Checkbox
                        checked={sub.completed}
                        onChange={() => toggleSubTaskCompleted(plan.id, sub.id)}
                      />
                      <Typography
                        variant="body2"
                        style={{
                          textDecoration: sub.completed ? 'line-through' : 'none',
                        }}
                      >
                        {sub.content}
                      </Typography>
                    </Box>
                  ))}
                <Button
                variant="outlined"
                size="small"
                onClick={() => handleUpdatePlan(plan)}
              >
                Update Status
              </Button>
              </>
              )}

            </Collapse>
          </Paper>
        )))}
      </Box>
    </Box>

  );
};

export default TodayAllPage;