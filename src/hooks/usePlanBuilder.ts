import { Plan } from "../types/trainPLan";
import { useState } from "react";



interface PlanWithUIState extends Plan {
  expanded?: boolean; 
}
export function usePlanBuilder(initialPlans = []) {

  const [plan, setPlan] = useState<PlanWithUIState[]>(initialPlans);

  const addPlan = (selectedPlanType:string, date: Date ) => {
    if (!selectedPlanType) return;
    const newPlan: PlanWithUIState = {
      id: Date.now(),
      status: 'draft',
      title: selectedPlanType,
      date: date,
      subTasks: [],
      expanded: false,
    };
    setPlan(prev => [...prev, newPlan]);
  };

  const dateChange = (planId: number, newDate: Date) => {
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

  const addSubTask = (planId: number, content: string) => {
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

  const cleanPlan = () => {
    setPlan([]);
  }

  return {
    plan,
    addPlan,
    deletePlan,
    addSubTask,
    deleteSubTask,
    dateChange,
    toggleExpand,
    toggleSubTaskCompleted,
    cleanPlan,
  };
}
