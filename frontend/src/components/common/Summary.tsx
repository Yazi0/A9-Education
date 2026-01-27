import React from 'react';
import type { Class } from '../models/Class';


interface SummaryProps {
  classes: Class[];
}

const Summary: React.FC<SummaryProps> = ({ classes }) => {
  const summaryItems = [
    {
      label: "Advanced Level Classes",
      value: classes.filter(c => c.level === "Advanced Level").length,
    },
    {
      label: "Ordinary Level Classes",
      value: classes.filter(c => c.level === "Ordinary Level").length,
    },
    {
      label: "Your Enrollments",
      value: classes.filter(c => c.paid).length,
    },
    {
      label: "Available for Enrollment",
      value: classes.filter(c => !c.paid).length,
    },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryItems.map((item, index) => (
          <div key={index} className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
            <p className="text-3xl font-bold text-red-600">{item.value}</p>
            <p className="text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;