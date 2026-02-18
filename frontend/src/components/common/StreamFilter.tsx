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
    <div className="mb-6 bg-white rounded-2xl shadow-sm md:shadow-lg p-4 border border-gray-200">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Filter by Stream</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:flex flex-wrap gap-1.5 md:gap-2">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => onStreamFilterChange(stream)}
                className={`px-2 md:px-4 py-1.5 md:py-2 rounded-xl font-bold capitalize transition-all whitespace-nowrap text-[11px] md:text-sm border text-center ${streamFilter === stream
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:bg-red-50"
                  }`}
              >
                {stream === "all" ? "All Subjects" : stream}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 flex justify-between items-center md:block md:text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Term</p>
          <p className="font-black text-red-700 text-sm md:text-base">Term 1, 2024</p>
        </div>
      </div>
    </div>
  );
};

export default StreamFilter;