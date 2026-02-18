import React from 'react';
import { Brain, BookOpen, Users, Award } from 'lucide-react';
import type { Class } from '../models/Class';


interface StatsProps {
  classes: Class[];
}

const Stats: React.FC<StatsProps> = ({ classes }) => {
  const stats = [
    {
      label: "A/L Classes",
      value: classes.filter(c => c.level === "Advanced Level").length,
      icon: <Brain className="text-red-600" size={24} />,
    },
    {
      label: "O/L Classes",
      value: classes.filter(c => c.level === "Ordinary Level").length,
      icon: <BookOpen className="text-red-600" size={24} />,
    },
    {
      label: "Total Students",
      value: classes.reduce((acc, cls) => acc + cls.enrolled, 0),
      icon: <Users className="text-red-600" size={24} />,
    },
    {
      label: "Expert Teachers",
      value: "15+",
      icon: <Award className="text-red-600" size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            {stat.icon}
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;