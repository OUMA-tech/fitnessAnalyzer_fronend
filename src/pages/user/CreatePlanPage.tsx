import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  TextField,
  Typography,
  Paper,
  Select, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Layout from '../../components/common/Layout';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { SaveTrainPlan } from '../../features/user/trainPlanAPI';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { handleAxiosError } from '../../utils/handleAxiosError';
import { Plan } from '../../types/trainPLan';
import { usePlanBuilder } from '../../hooks/usePlanBuilder';


export enum PlanType {
  Ride = '🚴‍♂️ Ride',
  Run = '🏃‍♀️ Run',
  Swim = '🏊‍♂️ Swim',
  Strength = '🏋️‍♂️ Weight Training',
  Yoga = '🧘‍♂️ Yoga',
}



const CreatePlan = () => {
  const [selectedTaskType, setSelectedTaskType] = useState<PlanType | ''>('');
  const [subTaskInputs, setSubTaskInputs] = useState<Record<number, string>>({});
  const today = dayjs().startOf('day').toDate();
  console.log(today);

  const {
    plan,
    addPlan,
    deletePlan,
    addSubTask,
    deleteSubTask,
    dateChange,
    toggleExpand,
    toggleSubTaskCompleted,
    cleanPlan,
  } = usePlanBuilder();
  
  const handleAddTask = () => {
    if (!selectedTaskType) return;
    addPlan(selectedTaskType, today);
    setSelectedTaskType('');
  };

  const handleDateChange = (planId: number, newDateStr: string) => {
    const newDate =  dayjs(newDateStr).startOf('day').toDate();
    dateChange(planId, newDate);
  };

  const handleDeletePlan = (planId: number) => {
    deletePlan(planId);
  };

  const handleAddSubTask = (planId: number) => {
    const content = subTaskInputs[planId];
    if (!content?.trim()) return;
    addSubTask(planId, content);
    setSubTaskInputs(prev => ({ ...prev, [planId]: '' }));
  };

  const handleDeleteSubTask = (planId: number, subTaskId: number) => {
    deleteSubTask(planId,subTaskId);
  };
  


  const handleSaveTrainPlan = async (tasks:Plan[]) => {
    if (tasks.length) {
      try {
        await SaveTrainPlan(tasks);
        cleanPlan();
        toast.success('Training plan saved success ✅');
      } catch (err) {
        handleAxiosError(err, 'Failed to sync training plan ❌');
      }
    }else {
      toast.info('No training plan yet');
    }
  }

  return (
    <>
    <Layout />
      <Box className="p-4 max-w-xl mx-auto space-y-4">
        <Box display="flex" gap={2} mt={1} ml={1} mr={1}>
          <Select
            value={selectedTaskType}
            onChange={e => setSelectedTaskType(e.target.value as PlanType)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>Add your train plan</em>
            </MenuItem>
            {Object.values(PlanType).map(type => (
              
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
              
            ))}
          </Select>
          <Button
            onClick={handleAddTask}
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!selectedTaskType}
          >
            Add
          </Button>
        </Box>

        {plan.map(task => (
          <Paper key={task.id} className="p-3 space-y-8 shadow" sx={{ mt: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => toggleExpand(task.id)}
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' },
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <Typography variant="h6">{task.title}</Typography>
              </Box>
              <TextField
                type="date"
                size="small"
                value={dayjs(task.date).format('YYYY-MM-DD')}
                onChange={(e) => handleDateChange(task.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleExpand(task.id); 
                }}
              >
                {task.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>


            <Collapse in={task.expanded}>
              {task.subTasks.map(sub => (
                <Box key={sub.id} display="flex" alignItems="center" pl={2}>
                  <Checkbox
                    checked={sub.completed}
                    onChange={() => toggleSubTaskCompleted(task.id, sub.id)}
                  />
                  <Typography
                    variant="body2"
                    style={{
                      textDecoration: sub.completed ? 'line-through' : 'none',
                    }}
                  >
                    {sub.content}
                  </Typography>
                  <Button
                  variant="outlined"
                  onClick={() => handleDeleteSubTask(task.id,sub.id)}
                  size="small"
                  startIcon={<DeleteIcon />}
                  sx={{ ml: 'auto' }}
                  >
                    Delete
                  </Button>
                </Box>
              ))}
              <Box display="flex" gap={1} mb={1} pl={2}>
                <TextField
                  size="small"
                  placeholder="Add subtask"
                  value={subTaskInputs[task.id] || ''}
                  onChange={e =>
                    setSubTaskInputs(prev => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={() => handleAddSubTask(task.id)}
                  size="small"
                >
                  Add
                </Button>
              </Box>
              <Box mb={1}  mr={2} display="flex" justifyContent="flex-end">
                <IconButton aria-label="delete" onClick={()=>handleDeletePlan(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Box>
      <Box mt={8} mr={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" endIcon={<SendIcon />} onClick={()=>handleSaveTrainPlan(plan)}>
          SAVE
        </Button>
      </Box>
    </>
  );
}

export default CreatePlan;