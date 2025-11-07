import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiZap } from 'react-icons/fi';

const GamificationPanel = ({ points, streak, achievements }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Points</p>
            <p className="text-4xl font-bold mt-1">{points}</p>
          </div>
          <FiAward size={48} className="opacity-80" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-red-400 to-pink-500 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-4xl font-bold mt-1">{streak} days</p>
          </div>
          <FiTrendingUp size={48} className="opacity-80" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Achievements</p>
            <p className="text-4xl font-bold mt-1">{achievements.length}</p>
          </div>
          <FiZap size={48} className="opacity-80" />
        </div>
      </motion.div>

      {achievements.length > 0 && (
        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="font-semibold text-sm">{achievement.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationPanel;
