
import React from 'react';

export type TimeRange = '1w' | '1m' | '3m' | '1y';

interface TimeRangeSelectorProps {
  currentRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

interface TimeRangeButtonProps {
  range: TimeRange;
  current: string;
  onClick: () => void;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ range, current, onClick }) => {
  const isActive = current === range;
  
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-foreground hover:bg-secondary/80'
      }`}
      onClick={onClick}
    >
      {range}
    </button>
  );
};

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ currentRange, onRangeChange }) => {
  const timeRanges: TimeRange[] = ['1w', '1m', '3m', '1y'];

  return (
    <div className="flex space-x-2">
      {timeRanges.map((range) => (
        <TimeRangeButton
          key={range}
          range={range}
          current={currentRange}
          onClick={() => onRangeChange(range)}
        />
      ))}
    </div>
  );
};

export default TimeRangeSelector;
