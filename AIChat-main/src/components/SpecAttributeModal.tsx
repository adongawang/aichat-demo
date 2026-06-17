import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy } from 'lucide-react';

interface SpecAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  specName?: string;
  specId?: string;
}

const SpecAttributeModal: React.FC<SpecAttributeModalProps> = ({ isOpen, onClose, specName, specId }) => {
  if (!isOpen) return null;

  const attributes = [
    { id: '2021010819005422', code: 'FlavorRef', name: '模板ID', value: 'ecloud-normalNetEnhance-6248R-4.0-000800160020' },
    { id: '2021010819005423', code: 'FlavorType', name: '模板类型', value: '通用型' },
    { id: '2021010819005041', code: 'cpu', name: 'CPU', value: '64' },
    { id: '2021010819005473', code: 'disk', name: '系统盘', value: '20' },
    { id: '2021010819005116', code: 'ram', name: '内存容量(GB)', value: '256' },
    { id: '2021010819005117', code: 'MaxBandwidth', name: '内网带宽', value: '4' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
          />

          {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white">
          <h3 className="text-xl font-bold text-[#0052D9]">
            {specName || '云主机 通用型 64vCPU 256GB内存'} | {specId || '2106251434380638'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 bg-white">
          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-sm font-bold text-[#64748B] border-r border-[#E2E8F0]">属性标识</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#64748B] border-r border-[#E2E8F0]">属性编码</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#64748B] border-r border-[#E2E8F0]">属性名称</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#64748B]">属性值</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {attributes.map((attr, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#64748B] border-r border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(attr.id)}
                          className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <Copy size={16} />
                        </button>
                        {attr.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1E293B] border-r border-[#E2E8F0]">{attr.code}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#1E293B] border-r border-[#E2E8F0]">{attr.name}</td>
                    <td className="px-6 py-4 text-sm text-[#1E293B] break-all">{attr.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-2.5 bg-[#F8FAFC] text-[#1E293B] rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-[#F1F5F9]"
          >
            关闭
          </button>
        </div>
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpecAttributeModal;
