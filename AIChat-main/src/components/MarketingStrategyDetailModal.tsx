import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { MarketingStrategyDetail } from '../types';

interface MarketingStrategyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy?: MarketingStrategyDetail;
}

const MarketingStrategyDetailModal: React.FC<MarketingStrategyDetailModalProps> = ({ isOpen, onClose, strategy }) => {
  if (!strategy) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-[#EEF2F6] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <h3 className="text-xl font-bold text-blue-600">营销策略信息</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Basic Info Section */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-bold text-blue-600">基本信息</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                  <InfoItem label="策略名称" value={strategy.basicInfo.name} />
                  <InfoItem label="策略大类" value={strategy.basicInfo.category} />
                  <InfoItem label="策略小类" value={strategy.basicInfo.subCategory} />
                  
                  <InfoItem label="开始时间" value={strategy.basicInfo.startTime} />
                  <InfoItem label="结束时间" value={strategy.basicInfo.endTime} />
                  <InfoItem label="所属省份" value={strategy.basicInfo.province} />
                  
                  <div className="md:col-span-3">
                    <InfoItem label="指定发券人员" value={strategy.basicInfo.operatorNames} labelWidth="w-32" />
                  </div>
                  
                  <InfoItem label="归属营销活动编码" value={strategy.basicInfo.campaignCode} />
                  <div className="md:col-span-2">
                    <InfoItem label="归属营销活动名称" value={strategy.basicInfo.campaignName} labelWidth="w-40" />
                  </div>
                  
                  <InfoItem label="所属地市" value={strategy.basicInfo.city} />
                  <div className="md:col-span-2">
                    <InfoItem label="方案描述" value={strategy.basicInfo.description} labelWidth="w-40" />
                  </div>
                  
                  <div className="md:col-span-3 flex items-start gap-4 py-1">
                    <span className="text-sm text-slate-500 w-32 shrink-0 text-right">决策依据：</span>
                    <span className="text-sm text-blue-500 font-medium cursor-pointer hover:underline">
                      {strategy.basicInfo.decisionBasis}
                    </span>
                  </div>
                </div>
              </section>

              {/* Marketing Location Section */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-bold text-blue-600">营销位置信息</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <InfoItem label="运营位编码" value={strategy.locationInfo.code} />
                  <InfoItem label="运营位名称" value={strategy.locationInfo.name} />
                </div>
              </section>

              {/* Marketing Rules Section */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-bold text-blue-600">营销规则信息</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <InfoItem label="使用次数" value={strategy.ruleInfo.usageLimit} />
                  <InfoItem label="领取张数(人/次)" value={strategy.ruleInfo.receiveLimit} />
                  <InfoItem label="总数量设置" value={strategy.ruleInfo.totalLimitEnabled} />
                  <InfoItem label="优惠券数量" value={strategy.ruleInfo.quantity} />
                  <InfoItem label="折扣值" value={strategy.ruleInfo.discountValue} />
                  <InfoItem label="实名认证开始时间" value={strategy.ruleInfo.authStartTime} />
                </div>
              </section>

              {/* Marketing Language Section */}
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-bold text-blue-600">营销用语信息</h4>
                </div>
                
                <div className="space-y-4">
                  <InfoItem label="营销用语" value={strategy.languageInfo.content} labelWidth="w-32" />
                  <InfoItem label="提醒模板编码" value={strategy.languageInfo.reminderTemplateCode} labelWidth="w-32" />
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const InfoItem: React.FC<{ label: string; value: string; labelWidth?: string }> = ({ label, value, labelWidth = "w-40" }) => (
  <div className="flex items-start gap-4 py-1">
    <span className={`text-sm text-slate-500 ${labelWidth} shrink-0 text-right`}>{label}：</span>
    <span className="text-sm text-slate-800 font-medium">{value || ''}</span>
  </div>
);

export default MarketingStrategyDetailModal;
