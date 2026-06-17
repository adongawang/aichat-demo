import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronUp, ChevronDown, Plus, Download, Upload, Check } from 'lucide-react';
import { CouponDetail } from '../types';

interface CouponDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponDetail: CouponDetail | null;
}

const CouponDetailModal: React.FC<CouponDetailModalProps> = ({ isOpen, onClose, couponDetail }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    products: false,
    resources: false,
    guide: false
  });

  if (!couponDetail) return null;

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[1200px] max-w-[95vw] bg-[#F7F8FA] rounded-md shadow-2xl overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white shrink-0">
              <span className="text-sm font-medium text-slate-700">优惠券详情</span>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
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
                      <Tab active>大云优惠券</Tab>
                      <Tab>合营云优惠券</Tab>
                    </div>
                  </div>

                  {/* Grid Rows */}
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <Field label="优惠券名称" required>
                      <Input value="新年营销9折优惠券" />
                    </Field>
                    <Field label="生效方式" required>
                      <div className="flex bg-white border border-slate-200 rounded p-0.5 w-full">
                        <Tab active className="flex-1">绝对时间</Tab>
                        <Tab className="flex-1">相对时间</Tab>
                      </div>
                    </Field>

                    <Field label="生效日期" required>
                      <div className="relative">
                        <Input value="2026/05/12 00:00:00" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">📅</span>
                      </div>
                    </Field>
                    <Field label="失效日期" required>
                      <div className="relative">
                        <Input value="2026/05/12 23:59:59" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">📅</span>
                      </div>
                    </Field>

                    <Field label="优惠券类型" required>
                      <Select value="折扣券" />
                    </Field>
                    <Field label="折扣券规格" required>
                      <div className="flex items-center gap-1">
                        <Input value="90" className="flex-1" />
                        <span className="text-slate-400 shrink-0">(%) 折</span>
                      </div>
                    </Field>

                    <Field label="优惠卷累计方式">
                      <Select value="按周期累计" />
                    </Field>
                    <Field label="优惠总价">
                      <div className="flex items-center gap-1">
                        <Input placeholder="请填写" className="flex-1" />
                        <span className="text-slate-400 shrink-0">(元)</span>
                      </div>
                    </Field>

                    <Field label="客户类型" required>
                      <Select value="全部客户" />
                    </Field>
                    <div />

                    <Field label="适用产品描述" required className="col-span-2">
                      <Input value="新年营销9折优惠券" />
                    </Field>
                  </div>

                  {/* Row: 支持的订购类型 */}
                  <div className="flex items-start gap-4">
                    <Label required className="mt-1">支持的订购类型:</Label>
                    <div className="flex flex-wrap gap-4">
                      <Checkbox label="通用" checked />
                      <Checkbox label="订购" />
                      <Checkbox label="续订" checked />
                      <Checkbox label="变更" />
                      <Checkbox label="绑定" />
                    </div>
                  </div>

                  {/* Row: 支持的消费类型 */}
                  <div className="flex items-start gap-4">
                    <Label className="mt-1">支持的消费类型:</Label>
                    <div className="flex flex-wrap gap-4">
                      <Checkbox label="包月" checked />
                      <Checkbox label="包年" />
                      <Checkbox label="按量 (含话单)" />
                      <Checkbox label="一次性费用" />
                      <Checkbox label="包年一次性" />
                    </div>
                  </div>

                  {/* Row: 订购数量 & 应用项目 */}
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <Field label="订购数量">
                      <div className="flex items-center gap-2">
                        <Input placeholder="最小订购数量" className="flex-1" />
                        <span className="text-slate-400">~</span>
                        <Input placeholder="最大订购数量" className="flex-1" />
                        <span className="text-slate-400 shrink-0">组</span>
                      </div>
                    </Field>
                    <Field label="应用项目">
                      <Select value="--请选择--" />
                    </Field>

                    <Field label="订购金额">
                      <div className="flex items-center gap-2">
                        <Input placeholder="最小订购金额" className="flex-1" />
                        <span className="text-slate-400">~</span>
                        <Input placeholder="最大订购金额" className="flex-1" />
                        <span className="text-slate-400 shrink-0">(元)</span>
                      </div>
                    </Field>
                    <div />

                    <Field label="规则详情" className="col-span-2">
                      <textarea 
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
                action={<button className="text-blue-500 flex items-center gap-1 hover:underline"><Plus size={14} /> 新增</button>}
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
                    <button className="text-blue-500 flex items-center gap-1 hover:underline"><Plus size={14} /> 新增</button>
                    <button className="text-blue-500 flex items-center gap-1 hover:underline"><Upload size={14} /> 导入</button>
                    <button className="text-blue-500 flex items-center gap-1 hover:underline"><Download size={14} /> 导出</button>
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
                action={<button className="text-blue-500 flex items-center gap-1 hover:underline"><Plus size={14} /> 新增</button>}
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
                    <Toggle value="是" />
                  </Field>
                  <Field label="是否具有客户互斥" required>
                    <Toggle value="是" />
                  </Field>
                  <Field label="是否配置结算基准折扣">
                    <Toggle value="否" />
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
                    <Toggle value="否" />
                  </Field>
                  <Field label="是否限制可用区">
                    <Toggle value="否" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end shrink-0">
              <button 
                onClick={onClose}
                className="px-6 py-1.5 bg-white border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors"
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

// UI Helper Components
const Section: React.FC<{ 
  title: string; 
  isCollapsed: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, isCollapsed, onToggle, children, action }) => (
  <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-1 h-4 bg-blue-500 rounded-full" />
        <span className="text-sm font-bold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        {action && <div className="text-[12px]">{action}</div>}
        <button 
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
          <div className="p-4">
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
    className={`w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400 text-slate-700 transition-colors ${className}`}
  />
);

const Select: React.FC<{ value: string }> = ({ value }) => (
  <div className="relative">
    <div className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 flex justify-between items-center cursor-pointer hover:border-slate-300 transition-colors">
      {value}
      <ChevronDown size={14} className="text-slate-400" />
    </div>
  </div>
);

const Tab: React.FC<{ children: React.ReactNode; active?: boolean; className?: string }> = ({ children, active, className }) => (
  <button className={`px-4 py-1 text-center rounded-sm transition-all duration-200 ${active ? 'bg-white text-blue-500 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'} ${className}`}>
    {children}
  </button>
);

const Checkbox: React.FC<{ label: string; checked?: boolean }> = ({ label, checked }) => (
  <div className="flex items-center gap-2 cursor-pointer group">
    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
      {checked && <Check size={12} className="text-white" />}
    </div>
    <span className={`${checked ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{label}</span>
  </div>
);

const Toggle: React.FC<{ value: string }> = ({ value }) => (
  <div className="flex bg-slate-100 border border-slate-200 rounded p-0.5 w-64">
    <Tab active={value === '是'} className="flex-1">是</Tab>
    <Tab active={value === '否'} className="flex-1">否</Tab>
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

export default CouponDetailModal;

