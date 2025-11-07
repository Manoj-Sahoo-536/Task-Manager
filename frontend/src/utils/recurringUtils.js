export const generateNextOccurrence = (task) => {
  if (!task.isRecurring || !task.dueDate) return null;

  const currentDue = new Date(task.dueDate);
  const nextDue = new Date(currentDue);

  switch (task.recurringType) {
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case 'monthly':
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    default:
      return null;
  }

  return {
    ...task,
    _id: undefined,
    dueDate: nextDue.toISOString(),
    status: 'pending',
    completedAt: null
  };
};
