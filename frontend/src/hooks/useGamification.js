import { useState, useEffect } from 'react';
import { calculatePoints, calculateStreak, getAchievements } from '../utils/gamificationUtils';

export const useGamification = (tasks) => {
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('userPoints') || '0');
  });
  
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const totalPoints = completedTasks.reduce((sum, task) => sum + calculatePoints(task), 0);
    setPoints(totalPoints);
    localStorage.setItem('userPoints', totalPoints.toString());

    const currentStreak = calculateStreak(tasks);
    setStreak(currentStreak);

    const userAchievements = getAchievements(tasks, totalPoints, currentStreak);
    setAchievements(userAchievements);
  }, [tasks]);

  const addPoints = (task) => {
    const taskPoints = calculatePoints(task);
    const newPoints = points + taskPoints;
    setPoints(newPoints);
    localStorage.setItem('userPoints', newPoints.toString());
    return taskPoints;
  };

  return { points, streak, achievements, addPoints };
};
