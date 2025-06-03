// import React from 'react';
// import { calculateStockMetrics } from '@/utils/stockDetailUtils';
// import type { StockMetricsGridProps } from '@/types/stockDetail.types';

// const StockMetricsGrid: React.FC<StockMetricsGridProps> = ({
//   stock,
//   isDark
// }) => {
//   const metrics = calculateStockMetrics(stock, isDark);

//   return (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//       {metrics.map((metric, index) => (
//         <div
//           key={metric.label}
//           className={`
//             p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
//             ${metric.bgColor} ${metric.borderColor}
//           `}
//           style={{ animationDelay: `${index * 100}ms` }}
//         >
//           {/* Icons Section */}
//           <div className="flex items-center justify-between mb-3">
//             <div className="p-2 rounded-xl bg-opacity-20" style={{ backgroundColor: metric.color.includes('blue') ? '#3B82F6' : metric.color.includes('purple') ? '#8B5CF6' : metric.color.includes('orange') ? '#F97316' : '#10B981' }}>
//               <metric.icon className={`w-5 h-5 ${metric.color}`} />
//             </div>
//             {metric.secondaryIcon && (
//               <metric.secondaryIcon className={`w-4 h-4 ${metric.color}`} />
//             )}
//           </div>

//           {/* Content */}
//           <div>
//             <div className={`text-xs font-medium mb-1 ${
//               isDark ? 'text-gray-400' : 'text-gray-600'
//             }`}>
//               {metric.label}
//             </div>
//             <div className={`text-lg font-bold ${
//               isDark ? 'text-white' : 'text-gray-900'
//             }`}>
//               {metric.value}
//             </div>
//             {metric.description && (
//               <div className={`text-xs mt-1 ${
//                 isDark ? 'text-gray-500' : 'text-gray-500'
//               }`}>
//                 {metric.description}
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StockMetricsGrid;