import { useEffect, useState } from 'react';

const Footer = ({ taskCount }) => {
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatSyncTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-medium">{taskCount.total || 0}</span> tasks
          <span className="mx-2">•</span>
          <span className="text-green-600">{taskCount.completed || 0} completed</span>
          <span className="mx-2">•</span>
          <span className="text-orange-600">{taskCount.pending || 0} pending</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Last sync: {formatSyncTime(lastSync)}</span>
          <span>© 2024 TaskManager</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
