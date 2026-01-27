import React from 'react';

interface StreamFilterProps {
  streamFilter: string;
  onStreamFilterChange: (stream: string) => void;
}

const StreamFilter: React.FC<StreamFilterProps> = ({
  streamFilter,
  onStreamFilterChange
}) => {
  const streams = ["all", "science", "commerce", "Maths", "IT"];

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="font-semibold text-gray-900 mb-2">Filter by Stream</h3>
          <div className="flex flex-wrap gap-2">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => onStreamFilterChange(stream)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  streamFilter === stream
                    ? "bg-gradient-to-r from-red-700 to-red-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                }`}
              >
                {stream === "all" ? "All Subjects" : stream}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Term</p>
          <p className="font-bold text-gray-900">Term 1, 2024</p>
        </div>
      </div>
    </div>
  );
};

export default StreamFilter;