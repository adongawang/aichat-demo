import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, X, ChevronDown } from 'lucide-react';

interface SpecEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

const SpecEditModal: React.FC<SpecEditModalProps> = ({ isOpen, onClose, initialData }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col bg-white">
          {/* Header */}
          <div className="h-14 bg-[#0086D1] flex items-center px-4 gap-4 text-white shrink-0">
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-medium">修改规格</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[#F5F7FA]">
            <div className="max-w-6xl mx-auto mt-6 bg-white shadow-sm min-h-[calc(100vh-140px)] p-8">
              {/* Section Header */}
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h3 className="text-[#0086D1] text-lg font-bold">规格信息</h3>
                <button className="flex items-center gap-1 text-[#0086D1] hover:opacity-80 transition-opacity text-sm font-medium">
                  <Plus size={18} />
                  <span>新增</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {/* Full Width Field */}
                <div className="col-span-2 flex items-center gap-4">
                  <label className="w-32 text-right text-sm text-slate-700">
                    <span className="text-red-500 mr-1">*</span>规格名称:
                  </label>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      defaultValue="云主机 通用网络增强型 8vCPU 16GB内存"
                      className="w-full h-10 px-3 border border-slate-200 rounded focus:border-[#0086D1] outline-none text-sm pr-10"
                    />
                  </div>
                </div>

                {/* Half Width Fields */}
                <FormField label="产品交付类型" required type="select" defaultValue="即开即通" />
                <div /> {/* Empty space to match layout if needed, but the image has them side by side */}

                <FormField label="CPU" required defaultValue="8" />
                <FormField label="内存容量(GB)" required defaultValue="16" />

                <FormField label="内网带宽" required defaultValue="4" />
                <FormField label="操作系统" required defaultValue="2021010819005336" />

                <FormField label="模板ID" required defaultValue="ecloud-normalNetEnhance-62" />
                <FormField label="模板类型" required defaultValue="通用网络增强型" />

                <FormField label="系统盘" required defaultValue="20" />
                <FormField label="规格名称" required defaultValue="sn4.2xlarge.2" />

                <FormField label="镜像ID" required defaultValue="2021010819005514" />
                <FormField label="镜像名称" required defaultValue="2021010819005533" />

                <FormField label="网卡数量" required defaultValue="2" />
                <FormField label="内网收发包" required defaultValue="100" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-20 bg-[#F5F7FA] border-t flex items-center justify-center gap-4 shrink-0">
            <button 
              onClick={onClose}
              className="w-48 h-11 border border-[#0086D1] text-[#0086D1] rounded hover:bg-blue-50 transition-colors font-medium"
            >
              取消
            </button>
            <button 
              onClick={onClose}
              className="w-48 h-11 bg-[#0086D1] text-white rounded hover:bg-[#0075B8] transition-colors font-medium shadow-sm"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FormField: React.FC<{ 
  label: string; 
  required?: boolean; 
  defaultValue?: string;
  type?: 'text' | 'select';
}> = ({ label, required, defaultValue, type = 'text' }) => (
  <div className="flex items-center gap-4">
    <label className="w-32 text-right text-sm text-slate-700 shrink-0">
      {required && <span className="text-red-500 mr-1">*</span>}
      {label}:
    </label>
    <div className="flex-1 relative">
      {type === 'select' ? (
        <div className="relative">
          <select className="w-full h-10 px-3 border border-slate-200 rounded focus:border-[#0086D1] outline-none text-sm appearance-none bg-white">
            <option>{defaultValue}</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
        </div>
      ) : (
        <div className="relative">
          <input 
            type="text" 
            defaultValue={defaultValue}
            className="w-full h-10 px-3 border border-slate-200 rounded focus:border-[#0086D1] outline-none text-sm pr-10"
          />
          <X className="absolute right-3 top-2.5 text-[#0086D1] cursor-pointer hover:opacity-80" size={16} />
        </div>
      )}
    </div>
  </div>
);

export default SpecEditModal;
