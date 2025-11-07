import { FiFile, FiDownload, FiEye, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FileAttachment = ({ file, onRemove, isExisting = false }) => {
  const fileName = isExisting ? file.split('/').pop() : file.name;
  const fileSize = isExisting ? null : (file.size / 1024).toFixed(1);
  const fileExt = fileName.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt);
  const isPDF = fileExt === 'pdf';

  const getFileIcon = () => {
    if (isImage) return '🖼️';
    if (isPDF) return '📄';
    return '📎';
  };

  const handlePreview = () => {
    if (isExisting) {
      window.open(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${file}`, '_blank');
    }
  };

  const handleDownload = async () => {
    if (!isExisting) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}${file}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center justify-between px-3 py-2 rounded ${
        isExisting ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'
      }`}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <span className="text-lg">{getFileIcon()}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{fileName}</p>
          {fileSize && <p className="text-xs text-gray-500">{fileSize}KB</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isExisting && (isImage || isPDF) && (
          <button
            onClick={handlePreview}
            className="text-blue-600 hover:text-blue-700"
            title="Preview"
          >
            <FiEye size={14} />
          </button>
        )}
        {isExisting && (
          <button
            onClick={handleDownload}
            className="text-green-600 hover:text-green-700"
            title="Download"
          >
            <FiDownload size={14} />
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
            title="Remove"
          >
            <FiX size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FileAttachment;
