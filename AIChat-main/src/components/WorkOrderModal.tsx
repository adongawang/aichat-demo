import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, Clock, User, AlertCircle, FileText, CheckCircle2, Send, MessageSquare, ShieldAlert } from 'lucide-react';

interface WorkOrder {
  id: string;
  title: string;
  type: string;
  customerName: string;
  status: 'pending' | 'processing' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  creator: string;
  createTime: string;
  description: string;
  logs: { time: string, operator: string, action: string, remark?: string }[];
}

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "GD202606140089",
    title: "亚信科技近三月账单金额异常退返申请工单",
    type: "计费争议",
    customerName: "亚信科技",
    status: "processing",
    priority: "high",
    creator: "客户经理-张杰",
    createTime: "2026-06-14 09:30:12",
    description: "客户反馈2026年3月-5月云主机产品月度优惠折扣未生效导致账单虚高，申请全额退回对应溢收差价。",
    logs: [
      { time: "2026-06-14 09:30:12", operator: "张杰", action: "创建工单", remark: "提请计费组核验账单流水，申请退费9500元。" },
      { time: "2026-06-14 11:15:40", operator: "系统网关", action: "分配处理人", remark: "自动分配至 [财务核算组-李维]" },
      { time: "2026-06-14 14:22:10", operator: "李维", action: "开始处理", remark: "正在调取亚信科技对应月份的明细账单与计费扣款记录。" }
    ]
  },
  {
    id: "GD202606120042",
    title: "智算型云主机规格变更扩容CPU性能未达标排查",
    type: "技术排查",
    customerName: "北京云启科技有限公司",
    status: "pending",
    priority: "high",
    creator: "运维专员-王涛",
    createTime: "2026-06-12 16:45:00",
    description: "客户反映：云主机升级至32核CPU512G内存后，核心计算模块承压能力未见提升，性能监视器中单核负载极高，疑存在调度虚拟化死锁。",
    logs: [
      { time: "2026-06-12 16:45:00", operator: "王涛", action: "创建工单", remark: "客户急需上线，请立即联系IDC核心技术团队复核虚拟化实例物理绑核情况。" }
    ]
  },
  {
    id: "GD202606100013",
    title: "新春大促9折优惠券超售调账备案工单",
    type: "业务备降",
    customerName: "全体客户",
    status: "completed",
    priority: "medium",
    creator: "运营经理-刘强",
    createTime: "2026-06-10 10:00:00",
    description: "新年营销活动热度高于预期，9折折扣优惠券原定发行1000张，实际发券阶段系统并发抖动超售发出1020张。申请对多出20张优惠券做备案调账处理。",
    logs: [
      { time: "2026-06-10 10:00:00", operator: "刘强", action: "创建工单", remark: "提交调账备案申请，涉及额外营销开支约2400元。" },
      { time: "2026-06-10 14:00:22", operator: "业务组长-陈华", action: "审核通过", remark: "情况属实，系统控制缺陷已经提交修复，同意备案。" },
      { time: "2026-06-11 09:00:00", operator: "系统服务", action: "关闭工单", remark: "款项已划拨，活动已结束归档。" }
    ]
  }
];

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_WORK_ORDERS[0].id);
  const [newRemark, setNewRemark] = useState('');
  const [nextStatus, setNextStatus] = useState<WorkOrder['status']>('processing');
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemark.trim()) return;

    const timeString = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    setOrders(prev => prev.map(order => {
      if (order.id === selectedOrderId) {
        return {
          ...order,
          status: nextStatus,
          logs: [
            ...order.logs,
            {
              time: timeString,
              operator: "当前用户(管理员)",
              action: nextStatus === 'completed' ? "处理完成" : nextStatus === 'closed' ? "关闭工单" : "跟进更新",
              remark: newRemark
            }
          ]
        };
      }
      return order;
    }));

    setNewRemark('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getStatusBadge = (status: WorkOrder['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-[4px]">待处理</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-[4px] animate-pulse">处理中</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-[4px]">已解决</span>;
      case 'closed':
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-[4px]">已关闭</span>;
    }
  };

  const getPriorityBadge = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-1.5 py-0.5 rounded">紧急</span>;
      case 'medium':
        return <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-1.5 py-0.5 rounded">普通</span>;
      case 'low':
        return <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-bold px-1.5 py-0.5 rounded">低</span>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-white rounded-[28px] shadow-2xl border border-slate-100 flex flex-col h-[82vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-100">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-sans">工单处理中心</h3>
                <p className="text-xs text-slate-400 font-sans">快速跟进、审核、并处置运营及技术支持工单</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toast Alert */}
          {showToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
              <CheckCircle2 size={15} />
              工单跟进记录更新成功！
            </div>
          )}

          {/* Modal Grid Layout */}
          <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-50/40">
            
            {/* Left Column: Work Order List */}
            <div className="w-[320px] border-r border-slate-100 bg-white flex flex-col overflow-y-auto shrink-0 p-4 gap-3">
              <div className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider mb-1">
                工单列表 ({orders.length})
              </div>
              {orders.map(order => {
                const isActive = order.id === selectedOrderId;
                return (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setNextStatus(order.status);
                    }}
                    className={`flex flex-col gap-2 p-4 text-left rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-mono font-medium text-slate-400">
                        {order.id}
                      </span>
                      {getPriorityBadge(order.priority)}
                    </div>
                    <h4 className={`text-[13px] font-bold leading-tight line-clamp-2 ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>
                      {order.title}
                    </h4>
                    <div className="flex items-center justify-between w-full pt-1">
                      <span className="text-[11px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">
                        {order.type}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Work Order Details */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-8 min-h-0">
              {/* Box Header Description */}
              <div className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border border-blue-100">
                      {currentOrder.id}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {currentOrder.createTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(currentOrder.status)}
                    {getPriorityBadge(currentOrder.priority)}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 leading-snug">
                  {currentOrder.title}
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs text-slate-600 pt-1 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">提出人员:</span>
                    <span className="font-semibold text-slate-700">{currentOrder.creator}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">客户名称:</span>
                    <span className="font-semibold text-slate-700">{currentOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">服务类型:</span>
                    <span className="font-semibold text-slate-700">{currentOrder.type}</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
                  <div className="font-bold text-slate-700 mb-1">问题详情/申请说明：</div>
                  {currentOrder.description}
                </div>
              </div>

              {/* Progress Timeline & Comments Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                
                {/* Timeline Panel (Col 7) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-[20px] border border-slate-100 shadow-xs flex flex-col gap-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    处理日志与跟进链路
                  </div>
                  
                  {/* Timeline Stream */}
                  <div className="flex flex-col gap-5 pl-2 relative border-l border-slate-100 ml-2 py-2">
                    {currentOrder.logs.map((log, idx) => {
                      const isLast = idx === currentOrder.logs.length - 1;
                      return (
                        <div key={idx} className="relative pl-6 group">
                          {/* Indicator Node */}
                          <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                            isLast 
                              ? 'bg-blue-500 border-white ring-4 ring-blue-100 animate-pulse' 
                              : 'bg-slate-300 border-white'
                          }`} />

                          <div className="flex flex-col gap-0.5 text-xs">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="font-semibold text-slate-700">{log.operator}</span>
                              <span className="font-mono text-[10px]">{log.time}</span>
                            </div>
                            <div className="font-semibold text-blue-600 text-xs mt-0.5">
                              {log.action}
                            </div>
                            {log.remark && (
                              <p className="text-slate-500 bg-slate-50/40 p-2.5 rounded-lg border border-slate-100/50 mt-1 italic leading-snug">
                                "{log.remark}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Handling Form (Col 5) */}
                <form 
                  onSubmit={handleUpdate} 
                  className="lg:col-span-5 bg-white p-6 rounded-[20px] border border-slate-100 shadow-xs flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <MessageSquare size={13} />
                      添加跟进意见
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase ml-0.5 block">
                        流转状态
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['processing', 'completed'] as const).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setNextStatus(st)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                              nextStatus === st
                                ? 'bg-blue-50 border-blue-400 text-blue-600'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            {st === 'processing' ? '继续处理' : '标记已解决'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase ml-0.5 block">
                        跟进描述/批注
                      </label>
                      <textarea
                        value={newRemark}
                        onChange={(e) => setNewRemark(e.target.value)}
                        placeholder="请输入处理意见或流转批复备注..."
                        rows={3}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newRemark.trim()}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      newRemark.trim()
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-blue-100 cursor-pointer active:scale-98'
                        : 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                    }`}
                  >
                    <Send size={12} />
                    提交流转
                  </button>
                </form>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
