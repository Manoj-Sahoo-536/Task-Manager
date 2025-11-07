import { FiCheckCircle, FiCircle, FiList, FiBarChart2, FiCalendar, FiSettings } from 'react-icons/fi';

const Sidebar = ({ selectedStatus, onStatusChange, selectedTags, onTagChange, availableTags }) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: FiList },
    { value: 'pending', label: 'Pending', icon: FiCircle },
    { value: 'completed', label: 'Completed', icon: FiCheckCircle }
  ];

  const quickLinks = [
    { label: 'Analytics', icon: FiBarChart2, path: '/analytics' },
    { label: 'Calendar', icon: FiCalendar, path: '/calendar' },
    { label: 'Settings', icon: FiSettings, path: '/settings' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md h-screen p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Filter by Status</h3>
          <div className="space-y-2">
            {statusOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onStatusChange(value)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                  selectedStatus === value
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Filter by Tags</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableTags.map((tag) => (
              <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => onTagChange(tag)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Quick Links</h3>
          <div className="space-y-2">
            {quickLinks.map(({ label, icon: Icon, path }) => (
              <a
                key={path}
                href={path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <Icon size={18} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
