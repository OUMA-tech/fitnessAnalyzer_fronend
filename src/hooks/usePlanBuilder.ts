import { Plan } from "../types/trainPLan";
import { useState } from "react";
import dayjs from 'dayjs'

export enum PlanType {
  Ride = '🚴‍♂️ Ride',
  Run = '🏃‍♀️ Run',
  Swim = '🏊‍♂️ Swim',
  Strength = '🏋️‍♂️ Weight Training',
  Yoga = '🧘‍♂️ Yoga',
}

interface PlanWithUIState extends Plan {
  expanded?: boolean; 
}
export function usePlanBuilder(initialPlans = []) {
  const [plan, setPlan] = useState<PlanWithUIState[]>(initialPlans = []);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType | ''>('');
  const [subTaskInputs, setSubTaskInputs] = useState<Record<number, string>>({});
  const today = dayjs().startOf('day').utc().toDate();

  const addPlan = () => {
    if (!selectedPlanType) return;
    const newPlan: PlanWithUIState = {
      id: Date.now(),
      status: 'draft',
      title: selectedPlanType,
      date: today,
      subTasks: [],
      expanded: false,
    };
    setPlan(prev => [...prev, newPlan]);
    setSelectedPlanType('');
  };

  const dateChange = (planId: number, newDateStr: string) => {
    const newDate =  dayjs(newDateStr).startOf('day').utc().toDate();

    setPlan(prevPlans =>
      prevPlans.map(plan =>
        plan.id === planId
          ? { ...plan, date: newDate }
          : plan
      )
    );
  };

  const deletePlan = (planId: number) => {
    setPlan(plans => plans.filter(plan => plan.id !== planId));
  };

  const addSubTask = (planId: number) => {
    const content = subTaskInputs[planId];
    if (!content?.trim()) return;
    setPlan(prev =>
      prev.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              subTasks: [
                ...plan.subTasks,
                {
                  id: Date.now(),
                  content: content.trim(),
                  completed: false,
                },
              ],
            }
          : plan
      )
    );
    setSubTaskInputs(prev => ({ ...prev, [planId]: '' }));
  };

  const deleteSubTask = (planId: number, subTaskId: number) => {
    setPlan(prev =>
      prev.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              subTasks: plan.subTasks.filter(sub => sub.id !== subTaskId),
            }
          : plan
      )
    );
  };


  const toggleExpand = (planId: number) => {
    setPlan(prev =>
      prev.map(plan =>
        plan.id === planId ? { ...plan, expanded: !plan.expanded } : plan
      )
    );
  };

  const toggleSubTaskCompleted = (planId: number, subTaskId: number) => {
    setPlan(prev =>
      prev.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              subTasks: plan.subTasks.map(sub =>
                sub.id === subTaskId
                  ? { ...sub, completed: !sub.completed }
                  : sub
              ),
            }
          : plan
      )
    );
  };

  return {
    plan,
    addPlan,
    deletePlan,
    addSubTask,
    deleteSubTask,
    dateChange,
    toggleExpand,
    toggleSubTaskCompleted,
  };
}
