import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';

interface ProgressStatsProps {
  progress: number;
  lastAccessed: string;
  lastVideoWatched?: {
    progress: number;
    title: string;
  };
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  progress,
  lastAccessed,
  lastVideoWatched
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-red-700 mr-2" size={18} />
            <span className="text-sm text-gray-700">Progress</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="ml-2 font-bold text-red-700">{progress}%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center">
            <Clock className="text-red-700 mr-2" size={18} />
            <div>
              <p className="text-sm text-gray-700">Last Accessed</p>
              <p className="font-semibold text-gray-900">{lastAccessed}</p>
            </div>
          </div>
        </div>
      </div>

      {lastVideoWatched && (
        <div className="mb-4 bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock className="text-red-700 mr-2" size={18} />
              <span className="font-medium text-gray-900">Continue Watching</span>
            </div>
            <span className="text-sm text-red-700">{lastVideoWatched.progress}% watched</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{lastVideoWatched.title}</p>
          <div className="h-2 bg-red-200 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full"
              style={{ width: `${lastVideoWatched.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressStats;