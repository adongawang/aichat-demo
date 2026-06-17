import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronUp, ChevronDown, Plus, Download, Upload, Check, Calendar, HelpCircle, Loader2 } from 'lucide-react';
import { Coupon } from '../types';

interface CouponConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Coupon | null;
  onSave?: (updatedData: Coupon) => void;
}

const CouponConfigModal: React.FC<CouponConfigModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    products: false,
    resources: false,
    guide: false
  });

  const [category, setCategory] = useState('大云优惠券');
  const [name, setName] = useState('');
  const [effectiveMode, setEffectiveMode] = useState('绝对时间');
  const [effectiveDate, setEffectiveDate] = useState('2026/05/12 00:00:00');
  const [expiryDate, setExpiryDate] = useState('2026/05/12 23:59:59');
  const [type, setType] = useState('折扣券');
  const [specification, setSpecification] = useState('90');
  const [cumulativeMode, setCumulativeMode] = useState('按周期累计');
  const [totalPrice, setTotalPrice] = useState('');
  const [customerType, setCustomerType] = useState('全部客户');
  const [ruleDetails, setRuleDetails] = useState('新年营销9折优惠券');
  
  const [subscriptionTypes, setSubscriptionTypes] = useState<string[]>(['通用', '续订']);
  const [feeTypes, setFeeTypes] = useState<string[]>(['包月']);
  
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [project, setProject] = useState('--请选择--');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [rulesText, setRulesText] = useState('');

  // Restricted values and pools
  const [isCampaignExclusive, setIsCampaignExclusive] = useState('是');
  const [isCustomerExclusive, setIsCustomerExclusive] = useState('是');
  const [isSettlementDiscountConfigured, setIsSettlementDiscountConfigured] = useState('否');
  const [limitResourcePool, setLimitResourcePool] = useState('否');
  const [limitAZ, setLimitAZ] = useState('否');

  // Popup overlay control states
  const [showPrompt, setShowPrompt] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategory(initialData?.details?.category || '大云优惠券');
      setName(initialData?.details?.name || initialData?.title || '新年营销9折优惠券');
      setEffectiveMode(initialData?.details?.effectiveMode || '绝对时间');
      setEffectiveDate(initialData?.details?.effectiveDate || '2026/05/12 00:00:00');
      setExpiryDate(initialData?.details?.expiryDate || '2026/05/12 23:59:59');
      setType(initialData?.details?.type || '折扣券');
      setSpecification(
        (initialData?.details?.specification || initialData?.percentage || '90').toString().replace('%', '')
      );
      setCumulativeMode('按周期累计');
      setTotalPrice(initialData?.details?.totalPrice || '');
      setCustomerType(initialData?.details?.customerType || '全部客户');
      setRuleDetails(initialData?.details?.ruleDetails || initialData?.description || '新年营销9折优惠券');
      
      const subTypes = initialData?.details?.subscriptionTypes?.split(',').map(s => s.trim()) || ['通用', '续订'];
      setSubscriptionTypes(subTypes);

      const fees = initialData?.details?.feeTypes?.split(',').map(s => s.trim()) || ['包月'];
      setFeeTypes(fees);

      setMinQuantity(initialData?.details?.quantity ? initialData?.details?.quantity.split('~')[0]?.trim() || '' : '');
      setMaxQuantity(initialData?.details?.quantity ? initialData?.details?.quantity.split('~')[1]?.replace('组', '')?.trim() || '' : '');
      
      setProject(initialData?.details?.project || '--请选择--');
      
      setMinAmount(initialData?.details?.amount ? initialData?.details?.amount.split('~')[0]?.trim() || '' : '');
      setMaxAmount(initialData?.details?.amount ? initialData?.details?.amount.split('~')[1]?.replace('(元)', '')?.replace('元', '')?.trim() || '' : '');
      
      setRulesText(initialData?.details?.ruleDetails || '');

      setIsCampaignExclusive('是');
      setIsCustomerExclusive('是');
      setIsSettlementDiscountConfigured('否');
      setLimitResourcePool('否');
      setLimitAZ('否');

      setShowPrompt(false);
      setShowConfirm(false);
      setShowSuccess(false);
      setShowError(false);
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleConfigConfirm = () => {
    // Validation
    if (!name.trim()) {
      setErrorMsg('请输入优惠券名称');
      setShowError(true);
      return;
    }
    if (!effectiveDate.trim()) {
      setErrorMsg('请输入生效日期');
      setShowError(true);
      return;
    }
    if (!expiryDate.trim()) {
      setErrorMsg('请输入失效日期');
      setShowError(true);
      return;
    }
    if (!type || type === '请选择') {
      setErrorMsg('请选择优惠券类型');
      setShowError(true);
      return;
    }
    if (!specification.trim()) {
      setErrorMsg('请输入折扣券规格');
      setShowError(true);
      return;
    }
    if (!ruleDetails.trim()) {
      setErrorMsg('请输入适用产品描述');
      setShowError(true);
      return;
    }
    if (subscriptionTypes.length === 0) {
      setErrorMsg('请选择支持的订购类型');
      setShowError(true);
      return;
    }

    // Trigger save callback back to App logic if present
    if (onSave && initialData) {
      const quantityStr = minQuantity || maxQuantity ? `${minQuantity || 0} ~ ${maxQuantity || 0} 组` : '';
      const amountStr = minAmount || maxAmount ? `${minAmount || 0} ~ ${maxAmount || 0} 元` : '';

      onSave({
        ...initialData,
        title: name,
        description: ruleDetails,
        details: {
          ...initialData.details,
          name,
          category,
          effectiveMode,
          effectiveDate,
          expiryDate,
          type,
          specification,
          totalPrice,
          customerType,
          ruleDetails,
          subscriptionTypes: subscriptionTypes.join(', '),
          feeTypes: feeTypes.join(', '),
          quantity: quantityStr,
          amount: amountStr,
          project
        }
      } as Coupon);
    }
    onClose();
  };

  const handleToggleSub = (typeStr: string) => {
    setSubscriptionTypes(prev => 
      prev.includes(typeStr) ? prev.filter(t => t !== typeStr) : [...prev, typeStr]
    );
  };

  const handleToggleFee = (feeStr: string) => {
    setFeeTypes(prev => 
      prev.includes(feeStr) ? prev.filter(t => t !== feeStr) : [...prev, feeStr]
    );
  };

  const isCopy = !!initialData;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[1200px] max-w-[95vw] bg-[#F7F8FA] rounded-md shadow-2xl overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white shrink-0">
              <span className="text-sm font-medium text-slate-700">{isCopy ? '配置优惠券' : '新增优惠券'}</span>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 优惠券基础信息 */}
              <Section 
                title="优惠券基础信息" 
                isCollapsed={collapsedSections.basic} 
                onToggle={() => toggleSection('basic')}
              >
                <div className="space-y-4 text-[12px]">
                  {/* Row 1: 大类 */}
                  <div className="flex items-center gap-4">
                    <Label required>优惠券大类:</Label>
                    <div className="flex bg-white border border-slate-200 rounded p-0.5">
                      <Tab active={category === '大云优惠券'} onClick={() => setCategory('大云优惠券')}>大云优惠券</Tab>
                      <Tab active={category === '合营云优惠券'} onClick={() => setCategory('合营云优惠券')}>合营云优惠券</Tab>
                    </div>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <Field label="优惠券名称" required>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入优惠券名称" />
                    </Field>
                    <Field label="生效方式" required>
                      <div className="flex bg-white border border-slate-200 rounded p-0.5 w-full">
                        <Tab active={effectiveMode === '绝对时间'} onClick={() => setEffectiveMode('绝对时间')} className="flex-1">绝对时间</Tab>
                        <Tab active={effectiveMode === '相对时间'} onClick={() => setEffectiveMode('相对时间')} className="flex-1">相对时间</Tab>
                      </div>
                    </Field>

                    <Field label="生效日期" required>
                      <div className="relative">
                        <Input value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} placeholder="格式: YYYY/MM/DD HH:MM:SS" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer pointer-events-none">📅</span>
                      </div>
                    </Field>
                    <Field label="失效日期" required>
                      <div className="relative">
                        <Input value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="格式: YYYY/MM/DD HH:MM:SS" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer pointer-events-none">📅</span>
                      </div>
                    </Field>

                    <Field label="优惠券类型" required>
                      <Select 
                        value={type} 
                        onChange={setType} 
                        options={['折扣券', '组合折扣券', '满减券', '代金券']} 
                      />
                    </Field>
                    <Field label="折扣券规格" required>
                      <div className="flex items-center gap-1">
                        <Input value={specification} onChange={(e) => setSpecification(e.target.value)} placeholder="请输入折扣比例" className="flex-1" />
                        <span className="text-slate-400 shrink-0">(%) 折</span>
                      </div>
                    </Field>

                    <Field label="优惠券累计方式">
                      <Select 
                        value={cumulativeMode} 
                        onChange={setCumulativeMode} 
                        options={['按周期累计', '按月累计', '按季累计', '按年累计']} 
                      />
                    </Field>
                    <Field label="优惠总价">
                      <div className="flex items-center gap-1">
                        <Input value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} placeholder="请填写" className="flex-1" />
                        <span className="text-slate-400 shrink-0">(元)</span>
                      </div>
                    </Field>

                    <Field label="客户类型" required>
                      <Select 
                        value={customerType} 
                        onChange={setCustomerType} 
                        options={['全部客户', '新增客户', '大客户']} 
                      />
                    </Field>
                    <div />

                    <Field label="适用产品描述" required className="col-span-2">
                      <Input value={ruleDetails} onChange={(e) => setRuleDetails(e.target.value)} placeholder="请输入产品适用规则描述" />
                    </Field>
                  </div>

                  {/* 支持的订购类型 */}
                  <div className="flex items-start gap-4">
                    <Label required className="mt-1">支持的订购类型:</Label>
                    <div className="flex flex-wrap gap-4">
                      <Checkbox label="通用" checked={subscriptionTypes.includes('通用')} onChange={() => handleToggleSub('通用')} />
                      <Checkbox label="订购" checked={subscriptionTypes.includes('订购')} onChange={() => handleToggleSub('订购')} />
                      <Checkbox label="续订" checked={subscriptionTypes.includes('续订')} onChange={() => handleToggleSub('续订')} />
                      <Checkbox label="变更" checked={subscriptionTypes.includes('变更')} onChange={() => handleToggleSub('变更')} />
                      <Checkbox label="绑定" checked={subscriptionTypes.includes('绑定')} onChange={() => handleToggleSub('绑定')} />
                    </div>
                  </div>

                  {/* 支持的消费类型 */}
                  <div className="flex items-start gap-4">
                    <Label className="mt-1">支持的消费类型:</Label>
                    <div className="flex flex-wrap gap-4">
                      <Checkbox label="包月" checked={feeTypes.includes('包月')} onChange={() => handleToggleFee('包月')} />
                      <Checkbox label="包年" checked={feeTypes.includes('包年')} onChange={() => handleToggleFee('包年')} />
                      <Checkbox label="按量 (含话单)" checked={feeTypes.includes('按量 (含话单)')} onChange={() => handleToggleFee('按量 (含话单)')} />
                      <Checkbox label="一次性费用" checked={feeTypes.includes('一次性费用')} onChange={() => handleToggleFee('一次性费用')} />
                      <Checkbox label="包年一次性" checked={feeTypes.includes('包年一次性')} onChange={() => handleToggleFee('包年一次性')} />
                    </div>
                  </div>

                  {/* Row: 订购数量 & 应用项目 */}
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <Field label="订购数量">
                      <div className="flex items-center gap-2">
                        <Input value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)} placeholder="最小订购数量" className="flex-1" />
                        <span className="text-slate-400">~</span>
                        <Input value={maxQuantity} onChange={(e) => setMaxQuantity(e.target.value)} placeholder="最大订购数量" className="flex-1" />
                        <span className="text-slate-400 shrink-0">组</span>
                      </div>
                    </Field>
                    <Field label="应用项目">
                      <Select value={project} onChange={setProject} options={['--请选择--', '应用A', '应用B', '通用项目']} />
                    </Field>

                    <Field label="订购金额">
                      <div className="flex items-center gap-2">
                        <Input value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="最小订购金额" className="flex-1" />
                        <span className="text-slate-400">~</span>
                        <Input value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="最大订购金额" className="flex-1" />
                        <span className="text-slate-400 shrink-0">(元)</span>
                      </div>
                    </Field>
                    <div />

                    <Field label="规则详情" className="col-span-2">
                      <textarea 
                        value={rulesText}
                        onChange={(e) => setRulesText(e.target.value)}
                        className="w-full h-20 bg-white border border-slate-200 rounded p-2 focus:outline-none focus:border-blue-400 text-slate-700 resize-none transition-colors"
                        placeholder="请输入，最多支持1500字符内容"
                      />
                    </Field>
                  </div>
                </div>
              </Section>

              {/* 适用产品 */}
              <Section 
                title="适用产品" 
                isCollapsed={collapsedSections.products} 
                onToggle={() => toggleSection('products')}
                action={<button type="button" className="text-blue-500 flex items-center gap-1 hover:underline"><Plus size={14} /> 新增</button>}
              >
                <Table headers={['产品编码', '产品名称', '资源池', '计费方式', '折扣', '优惠金额', '原价', '操作']} />
              </Section>

              {/* 绑定指定资源标识 */}
              <Section 
                title="绑定指定资源标识" 
                isCollapsed={collapsedSections.resources} 
                onToggle={() => toggleSection('resources')}
                action={
                  <div className="flex items-center gap-3">
                    <span className="text-rose-500 text-[10px]">最大支持导入1500条资源实例</span>
                    <button type="button" className="text-blue-500 flex items-center gap-1 hover:underline"><Plus size={14} /> 新增</button>
                    <button type="button" className="text-blue-500 flex items-center gap-1 hover:underline"><Upload size={14} /> 导入</button>
                    <button type="button" className="text-blue-500 flex items-center gap-1 hover:underline"><Download size={14} /> 导出</button>
                  </div>
                }
              >
                <Table headers={['资源标识', '订单编号', '产品名称', '产品规格名称', '资源状态', '计费方式', '开通时间', '到期时间']} />
              </Section>

              {/* 立即使用引导 */}
              <Section 
                title="立即使用引导" 
                isCollapsed={collapsedSections.guide} 
                onToggle={() => toggleSection('guide')}
                action={<button type="button" className="text-blue-500 flex items-center gap-1 hover:underline"><Plus size={14} /> 新增</button>}
              >
                <Table headers={['产品编码', '产品名称', '资源池', '计费方式', '折扣', '优惠金额', '原价', '操作']} />
              </Section>

              {/* 受限规则 */}
              <div className="bg-white rounded-sm border border-slate-200 p-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <span className="text-sm font-bold text-slate-800">受限规则</span>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[12px]">
                  <Field label="是否具有营销活动规则互斥" required>
                    <Toggle value={isCampaignExclusive} onChange={setIsCampaignExclusive} />
                  </Field>
                  <Field label="是否具有客户互斥" required>
                    <Toggle value={isCustomerExclusive} onChange={setIsCustomerExclusive} />
                  </Field>
                  <Field label="是否配置结算基准折扣">
                    <Toggle value={isSettlementDiscountConfigured} onChange={setIsSettlementDiscountConfigured} />
                  </Field>
                </div>
              </div>

              {/* 资源池与可用区 */}
              <div className="bg-white rounded-sm border border-slate-200 p-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <span className="text-sm font-bold text-slate-800">资源池与可用区</span>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[12px]">
                  <Field label="是否限制资源池">
                    <Toggle value={limitResourcePool} onChange={setLimitResourcePool} />
                  </Field>
                  <Field label="是否限制可用区">
                    <Toggle value={limitAZ} onChange={setLimitAZ} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Footer Bottom Actions */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-1.5 bg-white border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                type="button"
                onClick={handleConfigConfirm}
                className="px-6 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium shadow-sm transition-all"
              >
                保存
              </button>
            </div>
          </motion.div>

          {/* Prompt Check Errors Flow (retained logic) */}
          <AnimatePresence>
            {showError && (
              <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowError(false)}
                  className="absolute inset-0 bg-black/20"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full max-w-md bg-white rounded-lg shadow-2xl p-6 flex flex-col items-center text-center border border-slate-100"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3">
                    <X size={24} className="text-rose-500" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-1">校验提示</h4>
                  <p className="text-xs text-slate-500 mb-4">{errorMsg}</p>
                  <button
                    onClick={() => setShowError(false)}
                    className="w-full py-1.5 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600 transition-colors"
                  >
                    我知道了
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

// Internal Layout & Interaction Helper UI Components
const Section: React.FC<{ 
  title: string; 
  isCollapsed: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, isCollapsed, onToggle, children, action }) => (
  <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 select-none">
      <div className="flex items-center gap-3">
        <div className="w-1 h-4 bg-blue-500 rounded-full" />
        <span className="text-sm font-bold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        {action && <div className="text-[12px]">{action}</div>}
        <button 
          type="button"
          onClick={onToggle}
          className="text-[12px] text-slate-400 flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          {isCollapsed ? '展开' : '收起'}
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </div>
    <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-white">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Label: React.FC<{ children: React.ReactNode; required?: boolean; className?: string }> = ({ children, required, className }) => (
  <div className={`w-32 shrink-0 text-right text-slate-600 font-medium ${className}`}>
    {required && <span className="text-rose-500 mr-1">*</span>}
    {children}
  </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; className?: string }> = ({ label, required, children, className }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <Label required={required}>{label}:</Label>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input 
    {...props}
    className={`w-full bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400 text-slate-700 transition-colors text-[12px] ${className}`}
  />
);

const Select: React.FC<{ value: string; onChange?: (val: string) => void; options: string[] }> = ({ value, onChange, options }) => (
  <div className="relative w-full">
    <select 
      value={value} 
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-400 hover:border-slate-300 transition-colors cursor-pointer appearance-none text-[12px]"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <ChevronDown size={14} className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

const Tab: React.FC<{ children: React.ReactNode; active?: boolean; className?: string; onClick?: () => void }> = ({ children, active, className, onClick }) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`px-4 py-1 text-center rounded-sm transition-all duration-200 text-[12px] ${active ? 'bg-white text-blue-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'} ${className}`}
  >
    {children}
  </button>
);

const Checkbox: React.FC<{ label: string; checked?: boolean; onChange?: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <div onClick={() => onChange?.(!checked)} className="flex items-center gap-2 cursor-pointer group select-none">
    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
      {checked && <Check size={12} className="text-white" />}
    </div>
    <span className={`text-[12px] ${checked ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{label}</span>
  </div>
);

const Toggle: React.FC<{ value: string; onChange?: (val: string) => void }> = ({ value, onChange }) => (
  <div className="flex bg-slate-100 border border-slate-200 rounded p-0.5 w-64 select-none">
    <button 
      type="button" 
      onClick={() => onChange?.('是')} 
      className={`flex-1 px-4 py-1 text-center rounded-sm transition-all duration-200 text-[12px] ${value === '是' ? 'bg-white text-blue-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
    >
      是
    </button>
    <button 
      type="button" 
      onClick={() => onChange?.('否')} 
      className={`flex-1 px-4 py-1 text-center rounded-sm transition-all duration-200 text-[12px] ${value === '否' ? 'bg-white text-blue-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
    >
      否
    </button>
  </div>
);

const Table: React.FC<{ headers: string[] }> = ({ headers }) => {
  const isResourceTable = headers[0] === '资源标识';

  return (
    <div className="border border-slate-100 rounded overflow-hidden">
      <table className="w-full text-[12px]">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 font-medium text-slate-500 text-left whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isResourceTable ? (
            <tr className="hover:bg-slate-50/50">
              <td className="px-4 py-2 text-slate-800 font-mono font-medium">af3c0bb2-493c-4142-b0e9-769d83d03887</td>
              <td className="px-4 py-2 text-slate-600 font-mono">MOP-T-26052707573540</td>
              <td className="px-4 py-2 text-slate-800 font-medium">容量型云硬盘-云创版</td>
              <td className="px-4 py-2 text-slate-600">容量型云硬盘-云创版规格</td>
              <td className="px-4 py-2">
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-medium text-[10px]">生效</span>
              </td>
              <td className="px-4 py-2 text-slate-600">按月后付费</td>
              <td className="px-4 py-2 text-slate-500 font-mono">2026-05-27 15:12:49</td>
              <td className="px-4 py-2 text-slate-500 font-mono">2026-06-27 15:12:49</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={headers.length} className="py-20 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <X size={24} className="opacity-20" />
                  </div>
                  <span className="text-[12px]">没有数据</span>
                  <span className="text-[10px]">请先做数据查询</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CouponConfigModal;
