export const calculatePoints = (task) => {
  const priorityPoints = { high: 10, medium: 5, low: 3 };
  return priorityPoints[task.priority] || 5;
};

export const calculateStreak = (tasks) => {
  const completedDates = tasks
    .filter(t => t.status === 'completed' && t.completedAt)
    .map(t => new Date(t.completedAt).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  const today = new Date().toDateString();
  
  for (let i = 0; i < completedDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (completedDates[i] === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getAchievements = (tasks, points, streak) => {
  const achievements = [];
  
  if (tasks.filter(t => t.status === 'completed').length >= 10) {
    achievements.push({ name: 'Task Master', icon: '🏆', description: 'Completed 10 tasks' });
  }
  if (tasks.filter(t => t.status === 'completed').length >= 50) {
    achievements.push({ name: 'Productivity Pro', icon: '⭐', description: 'Completed 50 tasks' });
  }
  if (streak >= 7) {
    achievements.push({ name: 'Week Warrior', icon: '🔥', description: '7-day streak' });
  }
  if (streak >= 30) {
    achievements.push({ name: 'Month Master', icon: '💎', description: '30-day streak' });
  }
  if (points >= 100) {
    achievements.push({ name: 'Century Club', icon: '💯', description: '100+ points' });
  }
  
  return achievements;
};
