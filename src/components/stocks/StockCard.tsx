
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
      style={{
        background: "var(--dashboard-bg)",
        color: "var(--dashboard-symbol)",
        border: "1px solid var(--dashboard-border)",
        boxShadow: "var(--dashboard-card-shadow)",
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold" style={{ color: "var(--dashboard-symbol)" }}>{symbol}</h3>
          <p className="text-sm truncate max-w-[180px]" style={{ color: "var(--dashboard-name)" }}>{name}</p>
        </div>
        <div className={cn(
          "flex items-center px-2 py-1 rounded-full text-xs font-medium",
          isPositive
            ? "bg-green-500/20"
            : "bg-red-500/20"
        )}>
          {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          {changePercent.toFixed(2)}%
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-2xl font-bold" style={{ color: "var(--dashboard-price)" }}>${price.toFixed(2)}</div>
        <div className="text-sm mt-1" style={{ color: isPositive ? "var(--color-success)" : "var(--color-error)" }}>
          {isPositive ? "+" : ""}{change.toFixed(2)} Today
        </div>
      </div>
    </div>
  );
};

export default StockCard;
