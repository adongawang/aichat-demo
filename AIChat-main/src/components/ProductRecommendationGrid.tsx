import React from 'react';
import { Package, Settings, Info } from 'lucide-react';

interface ProductItem {
  id: string;
  tag: string;
  percentage?: string;
  title: string;
  description: string;
}

interface ProductRecommendationGridProps {
  content: string;
  data: ProductItem[];
  onConfigure: (item: ProductItem) => void;
  onDetail: (item: ProductItem) => void;
}

const ProductRecommendationGrid: React.FC<ProductRecommendationGridProps> = ({ 
  content, 
  data, 
  onConfigure, 
  onDetail 
}) => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-3xl">
      <div className="text-sm font-medium text-slate-600 mb-1">{content}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col hover:border-blue-200 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Package size={20} />
              </div>
              <span className={`px-2 py-0.5 ${
                (() => {
                  const val = parseInt(item.tag);
                  if (isNaN(val)) return 'bg-blue-500';
                  if (val >= 90) return 'bg-emerald-500';
                  if (val >= 80) return 'bg-blue-500';
                  return 'bg-amber-500';
                })()
              } text-[10px] font-bold text-white rounded-md uppercase tracking-wider`}>
                {item.tag}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1 truncate">{item.title}</h4>
            <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 min-h-[32px]">{item.description}</p>
            <div className="mt-auto flex flex-col gap-2">
              <button 
                onClick={() => onConfigure(item)}
                className="w-full py-2 bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5"
              >
                <Settings size={14} /> 立即配置
              </button>
              <button 
                onClick={() => onDetail(item)}
                className="w-full py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
              >
                <Info size={14} /> 产品详情
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendationGrid;
