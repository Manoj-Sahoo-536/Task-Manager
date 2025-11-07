import { useState } from 'react';
import { FiSun, FiMoon, FiUser, FiLogOut, FiAward, FiDownload, FiSearch, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ theme, toggleTheme, user, onLogout, onSearch, onImportExport, onThemeSelector, points = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-50 dark:bg-gray-800 shadow-md px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">TaskManager</h1>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <div className="flex items-center space-x-2 px-2 lg:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <FiAward className="text-yellow-600 dark:text-yellow-400" size={16} />
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{points}</span>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiUser size={20} />
              <span className="hidden lg:inline text-sm font-medium">{user?.name || 'User'}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => { window.location.hash = 'profile'; setShowDropdown(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiUser size={16} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => { onImportExport(); setShowDropdown(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiDownload size={16} />
                  <span>Import/Export</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden mt-4 space-y-3 pb-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiAward className="text-yellow-600 dark:text-yellow-400" size={16} />
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{points} Points</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => { window.location.hash = 'profile'; setShowMobileMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            >
              <FiUser size={16} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => { onImportExport(); setShowMobileMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            >
              <FiDownload size={16} />
              <span>Import/Export</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2 text-red-600"
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
