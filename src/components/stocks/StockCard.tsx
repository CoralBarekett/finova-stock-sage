
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  onClick?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  onClick,
}) => {
  const isPositive = change >= 0;

  return (
    <div 
      className={cn(
        "finova-card stock-card p-4 cursor-pointer hover:shadow-xl transition-all duration-300"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{symbol}</h3>
          <p className="text-sm truncate max-w-[180px]">{name}</p>
        </div>
        <div className={cn(
          "flex items-center px-2 py-1 rounded-full text-xs font-medium",
          isPositive
            ? "bg-green-500/20 text-green-700"
            : "bg-red-500/20 text-red-700"
        )}>
          {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-2xl font-bold">${price.toFixed(2)}</div>
        <div className={`text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "+" : ""}{change.toFixed(2)} Today
        </div>
      </div>
    </div>
  );
};

export default StockCard;
