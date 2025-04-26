
import React from 'react';

interface StockStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StockStat: React.FC<StockStatProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-white/70">{label}</span>
      </div>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
};

export default StockStat;
