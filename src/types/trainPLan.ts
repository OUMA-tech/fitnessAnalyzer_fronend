export interface Plan {
  id: number;
  title: string;
  date: Date;
  status: 'draft' | 'planned' | 'completed';
  subTasks: SubTask[];
}
export interface SubTask {
  id: number;
  content: string;
  completed: boolean;
}