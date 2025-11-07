import { useState, useEffect } from 'react';

export const useFilters = () => {
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('taskFilters');
    return saved ? JSON.parse(saved) : {
      status: 'all',
      priority: 'all',
      tags: [],
      searchQuery: ''
    };
  });

  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('taskSort') || 'createdAt';
  });

  useEffect(() => {
    localStorage.setItem('taskFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('taskSort', sortBy);
  }, [sortBy]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateSort = (value) => {
    setSortBy(value);
  };

  const resetFilters = () => {
    setFilters({ status: 'all', priority: 'all', tags: [], searchQuery: '' });
    setSortBy('createdAt');
  };

  const applyFilters = (tasks) => {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => task.tags?.includes(tag))) return false;
      if (filters.searchQuery && !task.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const applySorting = (tasks) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
        case 'priority': {
          const priority = { high: 3, medium: 2, low: 1 };
          return priority[b.priority] - priority[a.priority];
        }
        case 'urgency':
          return (b.urgencyScore || 0) - (a.urgencyScore || 0);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filterAndSort = (tasks) => {
    const filtered = applyFilters(tasks);
    return applySorting(filtered);
  };

  return {
    filters,
    sortBy,
    updateFilter,
    updateSort,
    resetFilters,
    filterAndSort
  };
};
