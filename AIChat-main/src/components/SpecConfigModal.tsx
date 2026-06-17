import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, Plus, Search, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';

interface SpecConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (specName: string) => void;
  onUpdate?: (specName: string) => void;
  productName?: string;
  isEditMode?: boolean;
}

const SpecConfigModal: React.FC<SpecConfigModalProps> = ({ isOpen, onClose, onSave, onUpdate, productName, isEditMode }) => {
  const [isAddAttributeOpen, setIsAddAttributeOpen] = useState(false);
  const [specName, setSpecName] = useState(productName || '云主机 通用型 64vCPU 256GB内存');

  const [attributes, setAttributes] = useState([
    { label: 'CPU', value: '64', id: 'cpu', originalValue: '8' },
    { label: '内存容量(GB)', value: '256', id: 'memory', originalValue: '16' },
    { label: '内网带宽', value: '4', id: 'bandwidth' },
    { label: '操作系统', value: '2021010819005336', id: 'os' },
    { label: '模板ID', value: 'ecloud-normalNetEnhance-62', id: 'template-id' },
    { label: '模板类型', value: '通用型', id: 'template-type' },
    { label: '系统盘', value: '20', id: 'system-disk' },
    { label: '规格名称', value: 'sn4.2xlarge.2', id: 'spec-internal-name' },
    { label: '镜像ID', value: '2021010819005514', id: 'image-id' },
    { label: '镜像名称', value: '2021010819005533', id: 'image-name' },
    { label: '网卡数量', value: '2', id: 'nic-count' },
    { label: '内网收发包', value: '100', id: 'pps' },
  ]);

  // Update specName and attributes when productName changes or modal opens
  React.useEffect(() => {
    if (isOpen && productName) {
      // If it's the old default name, force the new one
      if (productName === '云主机 通用网络增强型 8vCPU 16GB内存') {
        setSpecName('云主机 通用型 64vCPU 256GB内存');
      } else {
        setSpecName(productName);
        
        // Extract CPU and Memory from productName if possible
        const cpuMatch = productName.match(/(\d+)vCPU/);
        const memMatch = productName.match(/(\d+)GB内存/);
        
        if (cpuMatch || memMatch) {
          setAttributes(prev => prev.map(attr => {
            if (attr.id === 'cpu' && cpuMatch) {
              return { ...attr, value: cpuMatch[1] };
            }
            if (attr.id === 'memory' && memMatch) {
              return { ...attr, value: memMatch[1] };
            }
            return attr;
          }));
        }
      }
    }
  }, [isOpen, productName]);

  const updateAttribute = (id: string, newValue: string) => {
    setAttributes(attributes.map(attr => attr.id === id ? { ...attr, value: newValue } : attr));
  };

  const removeAttribute = (id: string) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const handleSave = () => {
    if (isEditMode) {
      if (onUpdate) onUpdate(specName);
    } else {
      if (onSave) onSave(specName);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-[#F0F2F5] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Header */}
            <div className="flex items-center h-12 px-4 bg-[#0081CC] text-white shrink-0">
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors mr-2">
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-base font-medium">修改规格</h3>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white m-4 rounded-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="text-[#0081CC] font-bold text-lg">规格信息</h4>
                <button 
                  onClick={() => setIsAddAttributeOpen(true)}
                  className="flex items-center gap-1 text-slate-600 hover:text-[#0081CC] transition-colors text-sm"
                >
                  <Plus size={16} /> 新增
                </button>
              </div>

              <div className="space-y-6 py-4">
                {/* Spec Name - Full Width */}
                <div className="flex items-center gap-4">
                  <label 
                    className="w-32 text-right text-sm text-slate-600 cursor-help"
                    title="原始值: 云主机 通用网络增强型 8vCPU 16GB内存"
                  >
                    <span className="text-red-500 mr-1">*</span>规格名称:
                  </label>
                  <input
                    type="text"
                    value={specName}
                    onChange={(e) => setSpecName(e.target.value)}
                    className="flex-1 h-10 px-3 border border-slate-200 rounded-sm focus:outline-none focus:border-[#0081CC] text-sm text-blue-600 font-medium"
                  />
                </div>

                {/* Delivery Type - Half Width */}
                <div className="flex items-center gap-4">
                  <label className="w-32 text-right text-sm text-slate-600">
                    <span className="text-red-500 mr-1">*</span>产品交付类型:
                  </label>
                  <div className="w-[calc(50%-1rem)] relative">
                    <select className="w-full h-10 px-3 border border-slate-200 rounded-sm focus:outline-none focus:border-[#0081CC] text-sm appearance-none bg-white">
                      <option>即开即通</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Attributes Grid - 2 Columns */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {attributes.map((attr) => (
                    <div key={attr.id} className="flex items-center gap-4">
                      <label 
                        className="w-32 text-right text-sm text-slate-600 truncate cursor-help"
                        title={attr.id === 'cpu' || attr.id === 'memory' ? `原始值: ${(attr as any).originalValue}` : undefined}
                      >
                        <span className="text-red-500 mr-1">*</span>{attr.label}:
                      </label>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={attr.value}
                          readOnly={attr.id !== 'cpu' && attr.id !== 'memory'}
                          onChange={(e) => {
                            if (attr.id === 'cpu' || attr.id === 'memory') {
                              updateAttribute(attr.id, e.target.value);
                            }
                          }}
                          className={`w-full h-10 px-3 pr-10 border border-slate-200 rounded-sm focus:outline-none focus:border-[#0081CC] text-sm bg-white ${
                            attr.id === 'cpu' || attr.id === 'memory' ? 'text-blue-600 font-medium' : ''
                          }`}
                        />
                        <button 
                          onClick={() => removeAttribute(attr.id)}
                          className="absolute right-3 top-3 text-[#0081CC] hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-4 p-6 bg-[#F0F2F5] shrink-0">
              <button
                onClick={onClose}
                className="w-48 h-10 bg-white border border-[#0081CC] text-[#0081CC] rounded-sm text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="w-48 h-10 bg-[#0081CC] text-white rounded-sm text-sm font-medium hover:bg-[#006EB0] transition-colors shadow-md"
              >
                保存
              </button>
            </div>

            {/* Add Attribute Modal */}
            <AddAttributeModal 
              isOpen={isAddAttributeOpen} 
              onClose={() => setIsAddAttributeOpen(false)} 
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface AddAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAttributeModal: React.FC<AddAttributeModalProps> = ({ isOpen, onClose }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
  ]);

  const mockData = [
    { id: '1', code: '2021010819005041', name: 'CPU', desc: '' },
    { id: '2', code: '2021010819005116', name: '内存容量(GB)', desc: '' },
    { id: '3', code: '2021010819005117', name: '内网带宽', desc: '' },
    { id: '4', code: '2021010819005336', name: '操作系统', desc: '' },
    { id: '5', code: '2021010819005422', name: '模板ID', desc: '' },
    { id: '6', code: '2021010819005423', name: '模板类型', desc: '' },
    { id: '7', code: '2021010819005473', name: '系统盘', desc: '' },
    { id: '8', code: '2021010819005496', name: '规格名称', desc: '' },
    { id: '9', code: '2021010819005514', name: '镜像ID', desc: '' },
    { id: '10', code: '2021010819005533', name: '镜像名称', desc: '' },
  ];

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[120] bg-[#F0F2F5] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center h-12 px-4 bg-[#0081CC] text-white shrink-0">
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors mr-2">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-base font-medium">新增属性</h3>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white m-4 rounded-sm shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h4 className="text-[#0081CC] font-bold text-lg">选择属性</h4>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-8 py-2">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm text-slate-600 shrink-0">属性名称:</label>
            <input
              type="text"
              placeholder="请填写"
              className="flex-1 h-10 px-3 border border-slate-200 rounded-sm focus:outline-none focus:border-[#0081CC] text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm text-slate-600 shrink-0">属性标识:</label>
            <input
              type="text"
              placeholder="请填写"
              className="flex-1 h-10 px-3 border border-slate-200 rounded-sm focus:outline-none focus:border-[#0081CC] text-sm"
            />
          </div>
          <button className="h-10 px-6 bg-[#0081CC] text-white rounded-sm text-sm font-medium hover:bg-[#006EB0] transition-colors flex items-center gap-2">
            <Search size={16} /> 查询
          </button>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === mockData.length}
                    onChange={() => {
                      if (selectedIds.length === mockData.length) setSelectedIds([]);
                      else setSelectedIds(mockData.map(d => d.id));
                    }}
                    className="w-4 h-4 accent-[#0081CC]" 
                  />
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 border-r border-slate-200">属性标识</th>
                <th className="px-4 py-3 font-medium text-slate-600 border-r border-slate-200">属性名称</th>
                <th className="px-4 py-3 font-medium text-slate-600">描述</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-[#0081CC]" 
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-r border-slate-200">{item.code}</td>
                  <td className="px-4 py-3 text-slate-700 border-r border-slate-200">{item.name}</td>
                  <td className="px-4 py-3 text-slate-700">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <ChevronDown size={14} className="rotate-90" /> 共 12 条
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1 hover:text-[#0081CC] disabled:opacity-30" disabled><ChevronsLeft size={18} /></button>
            <button className="hover:text-[#0081CC]">上一页</button>
            <span className="text-slate-800">1 / 2</span>
            <button className="hover:text-[#0081CC]">下一页</button>
            <button className="p-1 hover:text-[#0081CC]"><ChevronsRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center p-6 bg-[#F0F2F5] shrink-0">
        <button
          onClick={onClose}
          className="w-[600px] h-12 bg-[#0081CC] text-white rounded-sm text-base font-medium hover:bg-[#006EB0] transition-colors shadow-md"
        >
          确定
        </button>
      </div>
    </motion.div>
  );
};

export default SpecConfigModal;
