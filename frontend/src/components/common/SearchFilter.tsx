import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  levelFilter: string;
  streamFilter: string;
  onSearchChange: (value: string) => void;
  onLevelFilterChange: (value: string) => void;
  onStreamFilterChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  levelFilter,
  streamFilter,
  onSearchChange,
  onLevelFilterChange,
  onStreamFilterChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search classes or teachers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="inline mr-2" size={16} />
            Education Level
          </label>
          <select
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Levels</option>
            <option value="advanced">Advanced Level</option>
            <option value="ordinary">Ordinary Level</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stream
          </label>
          <select
            value={streamFilter}
            onChange={(e) => onStreamFilterChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">All Streams</option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
            <option value="commerce">Commerce</option>
            <option value="technology">Technology</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500">
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;