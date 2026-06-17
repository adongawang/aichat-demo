import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Loader2, Package, Pencil, Plus, Info, Database, Layers, FileText, Trash2, PlusCircle } from 'lucide-react';

interface ProductModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: any;
}

const ProductModifyModal: React.FC<ProductModifyModalProps> = ({ isOpen, onClose, productData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Pencil size={22} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">修改产品信息</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-slate-50/30">
              {/* Section 1: Basic Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h4 className="text-base font-bold text-blue-600">产品基础信息</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                  <EditItem label="产品类型" defaultValue="" />
                  <EditItem label="产品名称" defaultValue={productData?.title || "智算型云主机"} />
                  <EditItem label="产品目录" defaultValue="移动云 > 弹性计算 > 云主机" />
                  <EditItem label="产品分类" defaultValue="云主机" />
                  <EditItem label="产品生效日期" defaultValue="2024-05-09 14:49:25" />
                  <EditItem label="产品失效日期" defaultValue="2099-12-31 23:59:59" />
                  <EditItem label="业务平台" defaultValue="MOP平台" />
                  <EditItem label="产品描述" defaultValue="智算型云主机规格配置" />
                  <EditItem label="产品负责人" defaultValue="苏昕" />
                  <EditItem label="产品管理部门" defaultValue="计算产品部" />
                  <EditItem label="关联立项产品编码" defaultValue="PD20200001" />
                  <EditItem label="是否合营云产品" defaultValue="否" />
                </div>
              </section>

              {/* Section 2: Attributes */}
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-base font-bold text-blue-600">产品属性信息</h4>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:bg-blue-600 transition-all">
                    <Plus size={14} /> 新增属性
                  </button>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">属性标识</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">属性名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">属性编码</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">是否规格通用</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <EditableAttributeRow id="2021010819005041" name="CPU" code="cpu" universal="否" />
                      <EditableAttributeRow id="2021010819005116" name="内存容量(GB)" code="ram" universal="否" />
                      <EditableAttributeRow id="2021010819005117" name="内网带宽" code="MaxBandwidth" universal="否" />
                      <EditableAttributeRow id="2021010819005336" name="操作系统" code="os" universal="否" />
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 3: Specifications */}
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-base font-bold text-blue-600">产品规格信息</h4>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:bg-blue-600 transition-all">
                    <Plus size={14} /> 新增规格
                  </button>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">规格标识</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">规格名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {productData?.specs?.map((spec: any, i: number) => (
                        <EditableSpecRow key={i} id={`2106251422050${637 + i}`} name={spec.name} />
                      )) || (
                        <>
                          <EditableSpecRow id="2106251422050637" name="云主机 智算型 32vCPU 512GB内存" />
                          <EditableSpecRow id="2106251434380638" name="云主机 智算型 64vCPU 512GB内存" />
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4: Cost Records */}
              <section className="space-y-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-base font-bold text-blue-600">产品成本记录信息</h4>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:bg-blue-600 transition-all">
                    <Plus size={14} /> 新增成本
                  </button>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">成本名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">成本类型</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">产品成本</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">生效日期</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <FileText size={32} className="opacity-20" />
                            <p className="text-sm">暂无成本记录，点击“新增成本”开始添加</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-6 border-t border-slate-50 bg-white">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-10 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {isSubmitting ? '智能校验中' : '确认修改'}
              </button>
            </div>
          </motion.div>

          {/* Success Modal */}
          <AnimatePresence>
            {showSuccess && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center border border-slate-100"
                >
                  <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                    <Check size={40} className="text-green-500 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">校验提示</h4>
                  <p className="text-slate-500 text-sm mb-8">产品信息已成功更新并同步至系统。</p>
                  <button
                    onClick={handleSuccessConfirm}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95"
                  >
                    确认
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

const EditItem: React.FC<{ label: string; defaultValue: string }> = ({ label, defaultValue }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <input
      type="text"
      defaultValue={defaultValue}
      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
    />
  </div>
);

const EditableAttributeRow: React.FC<{ id: string; name: string; code: string; universal: string }> = ({ id, name, code, universal }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 text-sm font-mono text-slate-400">{id}</td>
    <td className="px-6 py-4">
      <input type="text" defaultValue={name} className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 p-0" />
    </td>
    <td className="px-6 py-4">
      <input type="text" defaultValue={code} className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-slate-400 p-0" />
    </td>
    <td className="px-6 py-4">
      <select defaultValue={universal} className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 p-0">
        <option value="是">是</option>
        <option value="否">否</option>
      </select>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

const EditableSpecRow: React.FC<{ id: string; name: string }> = ({ id, name }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 text-sm font-mono text-slate-400">{id}</td>
    <td className="px-6 py-4">
      <input type="text" defaultValue={name} className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 p-0" />
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
);

export default ProductModifyModal;
