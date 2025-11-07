import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AddTaskButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
    >
      <FiPlus size={24} className="sm:w-7 sm:h-7" />
    </motion.button>
  );
};

export default AddTaskButton;
