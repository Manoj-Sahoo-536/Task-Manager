import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';

const Analytics = ({ tasks, streak }) => {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' }
  ];

  const tagCounts = tasks.reduce((acc, task) => {
    task.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const barData = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const completionRate = tasks.length > 0 ? ((completedCount / tasks.length) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</h3>
          <p className="text-3xl font-bold mt-2">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Completed</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Pending</h3>
          <p className="text-3xl font-bold mt-2 text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Tags</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <FiTrendingUp size={32} className="text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Productivity Streak</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">{streak || 0} days</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep up the great work!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
