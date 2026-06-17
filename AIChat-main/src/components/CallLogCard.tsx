import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CallLogItem } from '../types';

interface CallLogCardProps {
  data: CallLogItem[];
}

const CallLogCard: React.FC<CallLogCardProps> = ({ data }) => {
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
          话单列表
          <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            共 {data.length} 条
          </span>
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap text-center">序号</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">话单名</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">流水</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">客户编码</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">账单日期</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">订购编码</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">商品编码</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">资费编码</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">资费科目</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">开始日期</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">开始时间</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">结束日期</th>
              <th className="px-3 py-2 font-semibold text-slate-600 whitespace-nowrap">结束时间</th>
              <th className="px-3 py-2 font-semibold text-slate-600 text-right whitespace-nowrap">时长(秒)</th>
              <th className="px-3 py-2 font-semibold text-slate-600 text-right whitespace-nowrap">单价</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-3 py-2 text-slate-400 text-center whitespace-nowrap">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.callLogName}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{item.serialNumber}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.customerCode}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.billingDate}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.orderCode}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.productCode}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.tariffCode}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{item.tariffSubject}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.startDate}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.startTime}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.endDate}</td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{item.endTime}</td>
                <td className="px-3 py-2 text-blue-600 font-medium text-right whitespace-nowrap">{item.duration}</td>
                <td className="px-3 py-2 font-bold text-slate-800 text-right whitespace-nowrap">{item.unitPrice}</td>
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

export default CallLogCard;
