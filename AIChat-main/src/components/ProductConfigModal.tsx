import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, ChevronDown, Check, HelpCircle, Loader2, Package } from 'lucide-react';

interface ProductConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductConfigModal: React.FC<ProductConfigModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('基础云产品');
  const [pricingMode, setPricingMode] = useState('按量计费');
  const [showPrompt, setShowPrompt] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCategory('基础云产品');
      setPricingMode('按量计费');
      setShowPrompt(false);
      setShowConfirm(false);
      setShowSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfigConfirm = () => {
    setShowPrompt(true);
  };

  const handlePromptConfirm = () => {
    setShowPrompt(false);
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Package size={22} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">新增产品配置</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Category Section */}
              <div className="flex items-center gap-6 py-2">
                <label className="text-sm font-bold text-slate-700 w-24 shrink-0">
                  <span className="text-red-500 mr-1">*</span>产品大类:
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['基础云产品', '增值云服务', '合营云产品'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        category === cat ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="bg-slate-50/50 rounded-[24px] p-8 space-y-8 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h4 className="text-base font-bold text-slate-800">产品基础信息</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <FormField label="产品名称" required>
                    <input
                      type="text"
                      placeholder="请输入产品名称"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    />
                  </FormField>

                  <FormField label="计费模式" required>
                    <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                      {['按量计费', '包年包月', '一次性'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setPricingMode(mode)}
                          className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${
                            pricingMode === mode ? 'bg-blue-500 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField label="生效日期" required>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="2026-03-30 00:00:00"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all pr-10"
                      />
                      <Calendar className="absolute right-3 top-3 text-blue-400" size={18} />
                    </div>
                  </FormField>

                  <FormField label="失效日期" required>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="2099-12-31 23:59:59"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all pr-10"
                      />
                      <Calendar className="absolute right-3 top-3 text-blue-400" size={18} />
                    </div>
                  </FormField>

                  <FormField label="产品类型" required>
                    <div className="relative">
                      <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none">
                        <option>计算实例</option>
                        <option>存储服务</option>
                        <option>网络资源</option>
                        <option>数据库</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </FormField>

                  <FormField label="产品规格" required>
                    <input
                      type="text"
                      placeholder="例如：4C8G / 100GB"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="产品描述">
                      <textarea
                        rows={3}
                        placeholder="请输入产品详细描述信息..."
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 px-8 py-6 border-t border-slate-50 bg-white">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleConfigConfirm}
                className="px-10 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95"
              >
                下一步
              </button>
            </div>
          </motion.div>

          {/* Submission Prompt Modal */}
          <AnimatePresence>
            {showPrompt && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
                  className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-10 flex gap-8 items-start border border-slate-100"
                >
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                    <Check size={32} className="text-green-500 stroke-[3]" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <h4 className="text-xl font-bold text-slate-800">提示信息</h4>
                    <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      该产品配置符合当前业务规则。系统检测到该产品规格属于[高频配置]范畴，将自动关联至[基础云]资源池进行快速部署。
                    </p>
                    <button
                      onClick={handlePromptConfirm}
                      className="px-8 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center gap-2"
                    >
                      <Check size={18} />
                      确认并继续
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirm && (
              <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
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
                  className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-10 flex gap-8 items-start border border-slate-100"
                >
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <HelpCircle size={40} className="text-blue-500 stroke-[2]" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <h4 className="text-xl font-bold text-slate-800">确认提交</h4>
                    <p className="text-2xl font-bold text-slate-700">确认提交产品配置审核?</p>
                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={handleConfirmCancel}
                        className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all border border-slate-200 flex items-center gap-2"
                      >
                        <X size={18} />
                        取消
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        disabled={isSubmitting}
                        className="px-10 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-70"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        确认提交
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Success Modal */}
          <AnimatePresence>
            {showSuccess && (
              <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
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
                  className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-10 flex gap-8 items-start border border-slate-100"
                >
                  <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                    <Check size={40} className="text-green-500 stroke-[3]" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <h4 className="text-xl font-bold text-slate-800">提示信息</h4>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-slate-700">产品配置提交成功！</p>
                      <p className="text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-block">产品编码: PRD-20260330-001</p>
                    </div>
                    <button
                      onClick={handleSuccessConfirm}
                      className="px-10 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center gap-2"
                    >
                      <Check size={18} />
                      完成
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="w-full">
      {children}
    </div>
  </div>
);

export default ProductConfigModal;
