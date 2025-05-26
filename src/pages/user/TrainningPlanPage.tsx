import { useState, useEffect } from 'react';
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
import utc from 'dayjs/plugin/utc';
import { Plan } from '../../types/trainPLan';

dayjs.extend(utc);

export enum TaskType {
  Ride = '🚴‍♂️ Ride',
  Run = '🏃‍♀️ Run',
  Swim = '🏊‍♂️ Swim',
  Strength = '🏋️‍♂️ Weight Training',
  Yoga = '🧘‍♂️ Yoga',
}

interface PlanWithUIState extends Plan {
  expanded?: boolean; 
}


const TrainingEditor = () => {
  const [tasks, setTasks] = useState<PlanWithUIState[]>([]);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | ''>('');
  const [subTaskInputs, setSubTaskInputs] = useState<Record<number, string>>({});
  const today = dayjs().startOf('day').utc().toDate();


  
  const handleAddTask = () => {
    if (!selectedTaskType) return;
    const newTask: PlanWithUIState = {
      id: Date.now(),
      status: 'draft',
      title: selectedTaskType,
      date: today,
      subTasks: [],
      expanded: false,
    };
    setTasks(prev => [...prev, newTask]);
    setSelectedTaskType('');
  };

  const handleDateChange = (taskId: number, newDateStr: string) => {
    const newDate =  dayjs(newDateStr).startOf('day').utc().toDate();
  
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, date: newDate }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks => tasks.filter(task => task.id !== taskId));
  };

  const handleAddSubTask = (taskId: number) => {
    const content = subTaskInputs[taskId];
    if (!content?.trim()) return;
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [
                ...task.subTasks,
                {
                  id: Date.now(),
                  content: content.trim(),
                  completed: false,
                },
              ],
            }
          : task
      )
    );
    setSubTaskInputs(prev => ({ ...prev, [taskId]: '' }));
  };

  const handleDeleteSubTask = (taskId: number, subTaskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter(sub => sub.id !== subTaskId),
            }
          : task
      )
    );
  };
  

  const toggleExpand = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };

  const toggleSubTaskCompleted = (taskId: number, subTaskId: number) => {
    setTasks(prev =>
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

  const handleSaveTrainPlan = async (tasks:Plan[]) => {
    if (tasks.length) {
      try {
        await SaveTrainPlan(tasks);
        setTasks([]);
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
        <Box display="flex" gap={2}>
          <Select
            value={selectedTaskType}
            onChange={e => setSelectedTaskType(e.target.value as TaskType)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>Add your train plan</em>
            </MenuItem>
            {Object.values(TaskType).map(type => (
              
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

        {tasks.map(task => (
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
                <IconButton aria-label="delete" onClick={()=>handleDeleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Box>
      <Box mt={8} mr={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" endIcon={<SendIcon />} onClick={()=>handleSaveTrainPlan(tasks)}>
          SAVE
        </Button>
      </Box>
    </>
  );
}

export default TrainingEditor;