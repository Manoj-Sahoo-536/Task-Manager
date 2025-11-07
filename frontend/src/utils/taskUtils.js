export const calculateUrgencyScore = (task) => {
  if (!task.dueDate) return 0;
  
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  const priorityScore = priorityWeight[task.priority] * 2;
  const timeScore = daysUntilDue <= 0 ? 10 : Math.max(0, 10 - daysUntilDue);
  
  return priorityScore + timeScore;
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') return false;
  return new Date(task.dueDate) < new Date();
};

export const getHighPriorityToday = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return tasks.filter(task => 
    task.status === 'pending' &&
    task.priority === 'high' &&
    task.dueDate &&
    new Date(task.dueDate) >= today &&
    new Date(task.dueDate) < tomorrow
  );
};

export const autoPrioritizeTasks = (tasks) => {
  return tasks.map(task => ({
    ...task,
    urgencyScore: calculateUrgencyScore(task),
    isOverdue: isOverdue(task)
  })).sort((a, b) => b.urgencyScore - a.urgencyScore);
};
