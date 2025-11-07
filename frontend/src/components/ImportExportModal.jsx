import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiUpload, FiFile } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const ImportExportModal = ({ isOpen, onClose }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export/${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Tasks exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e, format) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/import/${format}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Tasks imported successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Import / Export</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiUpload className="mr-2" /> Export Tasks
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={exporting}
                    className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition disabled:opacity-50"
                  >
                    <span className="flex items-center">
                      <FiFile className="mr-2" />
                      Export as CSV
                    </span>
                    <FiUpload />
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    disabled={exporting}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition disabled:opacity-50"
                  >
                    <span className="flex items-center">
                      <FiFile className="mr-2" />
                      Export as JSON
                    </span>
                    <FiUpload />
                  </button>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiDownload className="mr-2" /> Import Tasks
                </h3>
                <div className="space-y-2">
                  <label className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition cursor-pointer">
                    <span className="flex items-center">
                      <FiFile className="mr-2" />
                      Import from CSV
                    </span>
                    <FiDownload />
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleImport(e, 'csv')}
                      disabled={importing}
                      className="hidden"
                    />
                  </label>
                  <label className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition cursor-pointer">
                    <span className="flex items-center">
                      <FiFile className="mr-2" />
                      Import from JSON
                    </span>
                    <FiDownload />
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => handleImport(e, 'json')}
                      disabled={importing}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Import will add tasks to your existing list
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportExportModal;
