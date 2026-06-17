import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { DetailedBillItem } from '../types';

interface DetailedBillCardProps {
  data: DetailedBillItem[];
}

const DetailedBillCard: React.FC<DetailedBillCardProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          详单列表
          <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            共 {data.length} 条
          </span>
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">账期</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">客户名称</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">订购账户名称</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">商品名称</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">计费场景</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">计费项单价</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">使用量</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">单位</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">服务时长</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">时长单位</th>
              <th className="px-3 py-2 font-semibold text-slate-600 text-right whitespace-nowrap">目录金额(元)</th>
              <th className="px-3 py-2 font-semibold text-slate-600 text-right whitespace-nowrap">优惠金额(元)</th>
              <th className="px-3 py-2 font-semibold text-slate-600 text-right whitespace-nowrap">应收金额(元)</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.billingPeriod}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.customerName}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.orderAccountName}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.productName}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.billingScenario}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.unitPrice}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-medium text-blue-600">{item.usage}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{item.usageUnit}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.serviceDuration}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{item.durationUnit}</td>
                <td className="px-3 py-2 text-slate-700 text-right whitespace-nowrap">{item.catalogAmount}</td>
                <td className="px-3 py-2 text-orange-500 text-right whitespace-nowrap">-{item.discountAmount}</td>
                <td className="px-3 py-2 font-bold text-slate-800 text-right whitespace-nowrap">{item.receivableAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            第 {currentPage} 页 / 共 {totalPages} 页
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedBillCard;
