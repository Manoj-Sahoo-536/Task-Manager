/**
 * Task Manager Application
 * Copyright © 2025 Manoj Kumar Sahoo. All Rights Reserved.
 * Author: Manoj Kumar Sahoo
 * GitHub: https://github.com/Manoj-Sahoo-536
 */

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './hooks/useTheme';
import { authAPI } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useTasks } from './hooks/useTasks';
import ImportExportModal from './components/ImportExportModal';
import OfflineIndicator from './components/OfflineIndicator';
import { syncPendingActions } from './utils/offlineStorage';

function AuthenticatedApp({ theme, toggleTheme, user, onLogout, showImportExport, setShowImportExport, currentPage, onUpdateUser }) {
  const { tasks, addTask, editTask, deleteTask, toggleComplete, shareTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      onUpdateUser(data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const handleTaskUpdate = async (taskData, attachments) => {
    if (taskData.delete) {
      await deleteTask(taskData._id);
    } else if (taskData.toggleComplete) {
      await toggleComplete(taskData._id);
      await refreshUser();
    } else if (taskData._id) {
      await editTask(taskData._id, taskData, attachments);
    } else {
      await addTask(taskData, attachments);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={onLogout}
        onSearch={setSearchQuery}
        onImportExport={() => setShowImportExport(true)}
        points={user.points || 0}
      />
      <div className="flex-1 pb-16">
        {currentPage === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onShareTask={shareTask}
            searchQuery={searchQuery}
            user={user}
          />
        )}
        {currentPage === 'profile' && (
          <Profile user={user} onUpdateUser={onUpdateUser} />
        )}
      </div>
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
      />

    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login');
  const [showImportExport, setShowImportExport] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data);
          setView('dashboard');
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();

    const handleOnline = () => {
      syncPendingActions(async (action) => {
        // Sync logic handled by API interceptor
      });
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleUpdateUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'profile') setCurrentPage('profile');
      else setCurrentPage('dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
  };



  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <OfflineIndicator />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      {view === 'login' && (
        <div className="flex-1 flex flex-col pb-16">
          <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />
        </div>
      )}
      {view === 'register' && (
        <div className="flex-1 flex flex-col pb-16">
          <Register onRegister={handleLogin} onSwitchToLogin={() => setView('login')} />
        </div>
      )}
      
      {view === 'dashboard' && user && (
        <AuthenticatedApp
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onLogout={handleLogout}
          showImportExport={showImportExport}
          setShowImportExport={setShowImportExport}
          currentPage={currentPage}
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      <Footer />
    </div>
  );
}

export default App;
