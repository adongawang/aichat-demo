/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Mail, 
  StickyNote, 
  History, 
  Briefcase, 
  Settings, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Plus, 
  PlusCircle,
  Mic, 
  Send, 
  Paperclip,
  Copy,
  Check,
  Gift,
  Quote,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  User,
  Shuffle,
  Pencil,
  X,
  ChevronUp,
  ChevronDown,
  Download,
  Calendar,
  Upload,
  Flame,
  Star,
  Pin,
  FolderInput,
  ExternalLink,
  Package,
  Ticket,
  ShieldCheck,
  UserSearch,
  RotateCcw,
  Info,
  Layers,
  Loader2,
  Inbox,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { Message, Conversation, QuickAction, Suggestion, CouponDetail, Coupon, MarketingStrategyDetail } from './types';
import { KEYWORD_RULES, DEFAULT_RESPONSE, DEFAULT_SUGGESTIONS, SUGGESTION_REDIRECT_URL, CARD_DETAILS_REDIRECT_URL, COMMON_CONVERSATIONS, QUICK_ACTIONS, INITIAL_CONVERSATIONS, TYPING_SPEED, THINKING_TIME, INFO_QUERY_CONTENT } from './config';
import CouponDetailModal from './components/CouponDetailModal';
import MarketingStrategyDetailModal from './components/MarketingStrategyDetailModal';
import CouponConfigModal from './components/CouponConfigModal';
import CouponStrategyModal from './components/CouponStrategyModal';
import ProductConfigModal from './components/ProductConfigModal';
import ProductDetailModal from './components/ProductDetailModal';
import SpecAttributeModal from './components/SpecAttributeModal';
import SpecConfigModal from './components/SpecConfigModal';
import ProductRecommendationGrid from './components/ProductRecommendationGrid';
import ProductModifyModal from './components/ProductModifyModal';
import DetailedBillCard from './components/DetailedBillCard';
import CallLogCard from './components/CallLogCard';
import { WorkOrderModal } from './components/WorkOrderModal';

const CouponConfirmSection: React.FC<{
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, isCollapsed, onToggle, children, action }) => (
  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm mt-3.5">
    <div 
      onClick={onToggle}
      className="flex items-center justify-between px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 cursor-pointer select-none transition-colors duration-150"
    >
      <div className="flex items-center gap-2">
        <div className="w-1 h-3 bg-blue-500 rounded-full" />
        <span className="text-xs font-bold text-slate-700">{title}</span>
      </div>
      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {action && <div className="text-[10px] text-slate-500 font-medium">{action}</div>}
        <button 
          onClick={onToggle}
          className="text-slate-400 hover:text-blue-500 p-1 rounded-md transition-colors"
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </div>
    <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-3 bg-white">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const CouponConfirmTable: React.FC<{ 
  headers: string[]; 
  rows?: React.ReactNode[][]; 
  emptyText?: string;
  subEmptyText?: string;
}> = ({ headers, rows, emptyText = "暂无数据", subEmptyText = "请先在管理端关联或执行数据关联" }) => (
  <div className="border border-slate-100 rounded-lg overflow-x-auto">
    <table className="w-full text-[11px]">
      <thead className="bg-slate-50/70 border-b border-slate-100">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 font-medium text-slate-500 text-left whitespace-nowrap border-r last:border-r-0 border-slate-100">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows && rows.length > 0 ? (
          rows.map((row, idx) => (
            <tr key={idx} className="border-b last:border-0 border-slate-100 hover:bg-slate-50/20">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2 text-slate-700 whitespace-nowrap border-r last:border-r-0 border-slate-100">{cell}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="py-8 bg-slate-50/10">
              <div className="flex items-center justify-center gap-4 py-4 text-left">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Inbox size={24} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-700 leading-none">{emptyText}</span>
                  <span className="text-[11px] text-slate-400 leading-none">{subEmptyText}</span>
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

interface CouponConfigConfirmCardProps {
  msg: any;
  setSelectedCouponForConfig: (coupon: any) => void;
  setEditingCouponMsgId: (id: string) => void;
  setIsStrategyReadOnly: (readOnly: boolean) => void;
  setIsStrategyModalOpen: (open: boolean) => void;
  CARD_DETAILS_REDIRECT_URL: string;
  setInput: (value: string) => void;
}

const NestedAccordionItem: React.FC<{
  title: string;
  subtitle?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, isOpen, onToggle, children }) => {
  return (
    <div className="border border-slate-200/80 rounded-lg hover:border-slate-300 transition-colors duration-150 mb-2 overflow-hidden bg-white">
      <div 
        onClick={onToggle}
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 cursor-pointer select-none transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronRight size={13} className={`text-blue-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          <span className="text-[12px] font-bold text-blue-600">{title}</span>
          {subtitle}
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          {isOpen ? '点击收起' : '点击展开查看详情'}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-slate-100 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormLabel: React.FC<{ label: string; required?: boolean; className?: string }> = ({ label, required, className = "w-24" }) => (
  <span className={`${className} text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-0.5`}>
    {required && <span className="text-rose-500 font-bold">*</span>}
    {label}
  </span>
);

const FormCheckbox: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-600">
    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
    <span>{label}</span>
  </label>
);

interface RiskConfirmCardProps {
  msg: Message;
  onConfirm: (msgId: string) => void;
}

const RiskConfirmCard: React.FC<RiskConfirmCardProps> = ({ msg, onConfirm }) => {
  const [checked, setChecked] = useState(false);
  const isConfirmed = msg.data?.isConfirmed;
  const isCoupon = msg.data?.riskType === 'coupon';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl w-full relative flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Blue Header Title */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-[#FAFCFF]">
        <h3 className="text-base font-bold text-[#0086D6] flex items-center gap-1.5 font-sans">
          廉洁风险提示 {isCoupon && '(优惠券)'}
        </h3>
      </div>

      {/* Content body */}
      <div className="p-6 flex flex-col gap-5">
        <h4 className="text-[17px] font-bold text-slate-800 leading-relaxed font-sans">
          {isCoupon 
            ? "相关操作将涉及嵌入式风险 “优惠券活动设计与上线执行不合规” 防控点，请仔细阅读并知晓风险描述后，再进行后续操作！"
            : "相关操作将涉及嵌入式风险 “营销活动设计与上线执行不合规” 防控点，请仔细阅读并知晓风险描述后，再进行后续操作！"
          }
        </h4>
        
        <p className="text-slate-700 text-sm font-medium leading-relaxed font-sans border-l-4 border-[#0086D6] pl-3.5 py-0.5">
          {isCoupon
            ? "1. 请确保优惠券配置及发券策略信息与活动审批方案内容的一致性。"
            : "1. 请确保营销策略配置信息与营销活动方案内容的一致性。"
          }
        </p>

        {isConfirmed ? (
          <div className="flex flex-col items-center gap-2 pt-4 border-t border-slate-50">
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 font-sans">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              您已阅读并同意上述风险描述
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-50">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[13px] text-slate-600 font-sans hover:text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-4 h-4 rounded border-amber-500 text-blue-600 focus:ring-blue-500 cursor-pointer accent-[#0086D6]"
                style={{ borderColor: '#F5A623' }}
              />
              <span className="font-semibold text-slate-600">我已阅读，且同意</span>
            </label>

            <button
              onClick={() => {
                if (checked) {
                  onConfirm(msg.id);
                }
              }}
              disabled={!checked}
              className={`px-10 py-2.5 bg-[#0086D6] disabled:bg-slate-200 hover:bg-[#0070B5] text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none font-sans`}
            >
              确认
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface MarketingRecommendationCardProps {
  msg: Message;
  onConfigure: (item: any) => void;
  onDetail: (item: any) => void;
}

const MarketingRecommendationCard: React.FC<MarketingRecommendationCardProps> = ({ msg, onConfigure, onDetail }) => {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) {
    return (
      <div className="bg-slate-50/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-500 max-w-sm animate-in fade-in duration-200">
        <span>您已收起营销案推荐</span>
        <button 
          onClick={() => setIsClosed(false)} 
          className="text-[#1A73E8] hover:underline font-bold"
        >
          重新展开
        </button>
      </div>
    );
  }

  const strategies = msg.data?.strategies || [];

  return (
    <div className="bg-[#EEF2F6] p-5 rounded-[24px] shadow-sm w-full max-w-2xl border border-slate-200/50 relative flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Title Header with Accent Line & Close Icon */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#1A73E8] rounded-full" />
          <h3 className="text-base font-bold text-slate-800">营销案推荐</h3>
        </div>
        <button 
          onClick={() => setIsClosed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-white/50 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Strategies List Container */}
      <div className="flex flex-col gap-3">
        {strategies.map((item: any, idx: number) => (
          <div 
            key={idx} 
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4 hover:border-blue-100 hover:shadow-md transition-all duration-200 group"
          >
            {/* Gift Icon Left */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] shrink-0">
                <Gift size={20} className="stroke-[2.5]" />
              </div>

              {/* Title & Tags */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-[#1A73E8] text-white px-2 py-0.5 rounded-[4px] font-bold text-[10px] tracking-wide">
                    {item.tag}
                  </span>
                  
                  <span className={`${item.discountColor || 'bg-[#FF8F00]'} text-white px-2 py-0.5 rounded-[4px] font-bold text-[10px] tracking-wide`}>
                    {item.percentage}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono font-medium">
                    {item.code}
                  </span>
                </div>

                <h4 className="text-[14px] font-bold text-[#1A73E8] hover:underline cursor-pointer leading-tight font-sans">
                  {item.name}
                </h4>

                <p className="text-[11px] text-slate-400 leading-none">
                  活动时间：{item.time}
                </p>
              </div>
            </div>

            {/* Action Buttons Right */}
            <div className="flex flex-col gap-2 shrink-0 border-l border-slate-100 pl-4 w-28 font-sans">
              <button 
                onClick={() => onConfigure(item)}
                className="flex items-center justify-center gap-1 text-[12px] font-bold text-[#1A73E8] hover:text-[#0052C2] py-1.5 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
              >
                <Settings size={13} className="group-hover:rotate-45 transition-transform" />
                立即配置
              </button>
              
              <button 
                onClick={() => onDetail(item)}
                className="flex items-center justify-center gap-1 text-[12px] font-medium text-slate-400 hover:text-slate-600 py-1.5 hover:bg-slate-50 rounded-lg transition-all cursor-pointer font-sans"
              >
                <Search size={13} />
                详情
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CouponConfigConfirmCard: React.FC<CouponConfigConfirmCardProps> = ({
  msg,
  setSelectedCouponForConfig,
  setEditingCouponMsgId,
  setIsStrategyReadOnly,
  setIsStrategyModalOpen,
  CARD_DETAILS_REDIRECT_URL,
  setInput,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    schemeInfo: false,
    strategyConfig: false,
    basics: false,
    products: true,
    resources: true,
    guide: true,
    issueStrategy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueType, setIssueType] = useState<'direct' | 'appointment'>(() => {
    return msg.data.details?.issueType || 'direct';
  });
  const [queryType, setQueryType] = useState<'user' | 'group'>(() => {
    return msg.data.details?.queryType || 'user';
  });

  const [issuedUsers, setIssuedUsers] = useState<any[]>(() => {
    return msg.data.details?.issuedUsers || [
      {
        id: 'CIDC-U-ad03210b3f62446a95854520e9a691d9',
        name: 'csy_xxxtb_ywnlz_zhangsan_ext_107',
        nickname: 'csy_xxxtb_ywnlz_zhangsan_ext_107',
        email: '173****4521@163.com',
        phone: '173****4521'
      }
    ];
  });

  const [issuedGroups, setIssuedGroups] = useState<any[]>(() => {
    return msg.data.details?.issuedGroups || [
      {
        id: 'GRP-20260527-00921',
        name: '高活跃高价值主机用户群',
        desc: '最近30天订购过主机产品的全体高价值企业客户',
        count: '1,420'
      }
    ];
  });

  useEffect(() => {
    if (msg.data.details?.issuedUsers) {
      setIssuedUsers(msg.data.details.issuedUsers);
    }
  }, [msg.data.details?.issuedUsers]);

  useEffect(() => {
    if (msg.data.details?.issuedGroups) {
      setIssuedGroups(msg.data.details.issuedGroups);
    }
  }, [msg.data.details?.issuedGroups]);

  useEffect(() => {
    if (msg.data.details?.issueType) {
      setIssueType(msg.data.details.issueType);
    }
  }, [msg.data.details?.issueType]);

  useEffect(() => {
    if (msg.data.details?.queryType) {
      setQueryType(msg.data.details.queryType);
    }
  }, [msg.data.details?.queryType]);

  const handleAddRecord = () => {
    if (queryType === 'user') {
      const nextId = `CIDC-U-ad${Math.random().toString(16).substring(2, 10)}f${Math.random().toString(16).substring(2, 6)}446a95854520e9a691d9`;
      const num = Math.floor(Math.random() * 900) + 100;
      const names = ['lisi', 'wangwu', 'zhaoliu', 'qianqi'];
      const pickedName = names[Math.floor(Math.random() * names.length)];
      setIssuedUsers(prev => [
        ...prev,
        {
          id: nextId,
          name: `csy_xxxtb_ywnlz_${pickedName}_ext_${num}`,
          nickname: `csy_xxxtb_ywnlz_${pickedName}_ext_${num}`,
          email: `158****${Math.floor(Math.random() * 9000) + 1000}@163.com`,
          phone: `158****${Math.floor(Math.random() * 9000) + 1000}`
        }
      ]);
    } else {
      const nextId = `GRP-20260527-${Math.floor(Math.random() * 90000) + 10000}`;
      const groupNames = ['华东省份主机促销群', '存量续订潜在客户群', 'KA重点大客户推荐群'];
      const pickedGroup = groupNames[Math.floor(Math.random() * groupNames.length)];
      setIssuedGroups(prev => [
        ...prev,
        {
          id: nextId,
          name: pickedGroup,
          desc: '基于多维画像筛选得到的存量潜客推荐数据集',
          count: (Math.floor(Math.random() * 5000) + 500).toLocaleString()
        }
      ]);
    }
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const headers = ['产品编码', '产品名称', '资源池', '计费方式', '折扣', '优惠金额', '原价', '操作'];
  const resourceHeaders = ['资源标识', '订单编号', '产品名称', '产品规格名称', '资源状态', '计费方式', '开通时间', '到期时间'];
  const guideHeaders = ['商品名称', '引导链接', '位置上移', '位置下移', '修改', '删除'];

  const productRows = [
    [
      <span key="code" className="font-mono text-slate-500 font-medium">75003112</span>,
      <span key="name" className="font-medium text-slate-800">容量型云硬盘-云创版</span>,
      <span key="pool" className="text-slate-600">通用资源池</span>,
      <span key="billing" className="text-slate-600">按月后付费</span>,
      <span key="discount" className="text-slate-500">90% 折</span>,
      <span key="amount" className="text-slate-800 font-medium">¥ 200.00</span>,
      <span key="price" className="text-slate-400 line-through">¥ 2000.00</span>,
      <button key="action" className="text-rose-500 hover:text-rose-600 font-medium hover:underline">删除</button>
    ]
  ];

  const hasImportedResources = msg.data.details?.hasBoundResources || msg.data.hasBoundResources || false;
  const resourceRows = hasImportedResources ? [
    [
      <span key="resId" className="font-mono font-bold text-slate-800 text-[10px]">af3c0bb2-493c-4142-b0e9-769d83d03887</span>,
      <span key="orderId" className="font-mono text-slate-500 text-[10px]">MOP-T-26052707573540</span>,
      <span key="prodName" className="font-medium text-slate-800">容量型云硬盘-云创版</span>,
      <span key="spec" className="text-slate-600">容量型云硬盘-云创版规格</span>,
      <span key="status" className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-medium text-[10px]">生效</span>,
      <span key="billing" className="text-slate-600">按月后付费</span>,
      <span key="start" className="font-mono text-slate-400 text-[10px]">2026-05-27 15:12:49</span>,
      <span key="end" className="font-mono text-slate-400 text-[10px]/[1.2]">2026-06-27 15:12:49</span>
    ]
  ] : [];

  const guideRows: React.ReactNode[][] = [];

  // Parse checkbox selections
  const subTypes = (msg.data.details?.subscriptionTypes || '通用,续订').split(',').map((x: string) => x.trim());
  const isCheckedSub = (type: string) => subTypes.some((t: string) => t === type);

  const feeTypes = (msg.data.details?.feeTypes || '包月').split(',').map((x: string) => x.trim());
  const isCheckedFee = (type: string) => feeTypes.some((t: string) => t === type);

  return (
    <div className="flex flex-col gap-4 max-w-4xl w-full">
      {/* 信息确认卡片 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse animate-duration-1000" />
            <h3 className="text-base font-bold text-slate-800">优惠券配置信息确认</h3>
          </div>
        </div>

        {/* 优惠券基础信息 section */}
        <CouponConfirmSection
          title="优惠券基础信息"
          isCollapsed={collapsedSections.basics}
          onToggle={() => toggleSection('basics')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 p-1 text-[12px] text-slate-600">
            {/* 优惠券大类 */}
            <div className="flex items-center gap-2 col-span-1 md:col-span-2">
              <FormLabel label="优惠券大类:" required />
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <span className={`px-4 py-1 text-[10px] rounded-md font-bold transition-all ${msg.data.details?.category !== '合营云优惠券' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                  大云优惠券
                </span>
                <span className={`px-4 py-1 text-[10px] rounded-md font-bold transition-all ${msg.data.details?.category === '合营云优惠券' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                  合营云优惠券
                </span>
              </div>
            </div>

            {/* 优惠券名称 & 生效方式 */}
            <div className="flex items-center gap-2 w-full">
              <FormLabel label="优惠券名称:" required />
              <div className="flex-1 flex items-center h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white font-medium">
                {msg.data.details?.name || msg.data.title || '容量型云硬盘-云创版 9折优惠券'}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <FormLabel label="生效方式:" required />
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <span className={`px-4 py-1 text-[10px] rounded-md font-bold transition-all ${msg.data.details?.effectiveMode !== '相对时间' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                  绝对时间
                </span>
                <span className={`px-4 py-1 text-[10px] rounded-md font-bold transition-all ${msg.data.details?.effectiveMode === '相对时间' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                  相对时间
                </span>
              </div>
            </div>

            {/* 生效日期 & 失效日期 */}
            <div className="flex items-center gap-2 w-full">
              <FormLabel label="生效日期:" required />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span className="font-mono">{msg.data.details?.effectiveDate || '2026/05/12 00:00:00'}</span>
                <Calendar size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <FormLabel label="失效日期:" required />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span className="font-mono">{msg.data.details?.expiryDate || '2026/05/12 23:59:59'}</span>
                <Calendar size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            {/* 优惠券类型 & 折扣规格 */}
            <div className="flex items-center gap-2 w-full">
              <FormLabel label="优惠券类型:" required />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span>{msg.data.details?.type || '折扣券'}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <FormLabel label="折扣规格:" required />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span className="font-bold text-blue-600">
                  {msg.data.details?.specification 
                    ? msg.data.details.specification.toString().replace('%', '') 
                    : '90'}
                </span>
                <span className="text-slate-400 text-[10px]">(%) 折</span>
              </div>
            </div>

            {/* 优惠券累计方式 & 优惠总价 */}
            <div className="flex items-center gap-2 w-full">
              <FormLabel label="优惠券累计方式:" />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span>{msg.data.details?.cumulativeMode || '--请选择--'}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <FormLabel label="优惠总价:" />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span>{msg.data.details?.totalPrice || '请填写'}</span>
                <span className="text-slate-400 text-[10px]">(元)</span>
              </div>
            </div>

            {/* 客户类型 & 适用产品描述 */}
            <div className="flex items-center gap-2 w-full">
              <FormLabel label="客户类型:" required />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span>{msg.data.details?.customerType || '全部客户'}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full col-span-1 md:col-span-2">
              <FormLabel label="适用产品描述:" required />
              <div className="flex-1 flex items-center h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                {msg.data.description || '容量型云硬盘-云创版'}
              </div>
            </div>

            {/* 支持的订购类型 */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-center gap-3 py-1 border-t border-slate-50 mt-1">
              <FormLabel label="支持的订购类型:" required />
              <div className="flex flex-wrap gap-4">
                <FormCheckbox label="通用" checked={isCheckedSub('通用')} />
                <FormCheckbox label="订购" checked={isCheckedSub('订购')} />
                <FormCheckbox label="续订" checked={isCheckedSub('续订')} />
                <FormCheckbox label="变更" checked={isCheckedSub('变更')} />
                <FormCheckbox label="绑定" checked={isCheckedSub('绑定')} />
              </div>
            </div>

            {/* 支持的消费类型 */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-center gap-3 py-1 mt-1">
              <FormLabel label="支持的消费类型:" />
              <div className="flex flex-wrap gap-4">
                <FormCheckbox label="包月" checked={isCheckedFee('包月')} />
                <FormCheckbox label="包年" checked={isCheckedFee('包年')} />
                <FormCheckbox label="按量 (含话单)" checked={isCheckedFee('按量（含话单）') || isCheckedFee('按量') || isCheckedFee('按量 (含话单)')} />
                <FormCheckbox label="一次性费用" checked={isCheckedFee('一次性费用')} />
                <FormCheckbox label="包年一次性" checked={isCheckedFee('包年一次性')} />
              </div>
            </div>

            {/* 订购数量, 应用项目, 订购金额 */}
            <div className="flex items-center gap-2 w-full border-t border-slate-50 pt-3 mt-1">
              <FormLabel label="订购数量:" />
              <div className="flex-1 flex items-center h-8 bg-white border border-slate-200 rounded-lg text-[11px] overflow-hidden">
                <input type="text" placeholder="最小订购数量" className="w-[45%] h-full px-2 text-center text-slate-700 bg-transparent focus:outline-none text-[11px]" disabled />
                <span className="text-slate-300 px-1 font-normal">~</span>
                <input type="text" placeholder="最大订购数量" className="w-[45%] h-full px-2 text-center text-slate-700 bg-transparent focus:outline-none text-[11px]" disabled />
                <span className="text-slate-400 text-[10px] pr-2 shrink-0">组</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full border-t border-slate-50 pt-3 mt-1">
              <FormLabel label="应用项目:" />
              <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                <span>{msg.data.details?.project || '--请选择--'}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <FormLabel label="订购金额:" />
              <div className="flex-1 flex items-center h-8 bg-white border border-slate-200 rounded-lg text-[11px] overflow-hidden">
                <input type="text" placeholder="最小订购金额" className="w-[45%] h-full px-2 text-center text-slate-700 bg-transparent focus:outline-none text-[11px]" disabled />
                <span className="text-slate-300 px-1 font-normal">~</span>
                <input type="text" placeholder="最大订购金额" className="w-[45%] h-full px-2 text-center text-slate-700 bg-transparent focus:outline-none text-[11px]" disabled />
                <span className="text-slate-400 text-[10px] pr-2 shrink-0">(元)</span>
              </div>
            </div>

            {/* 规划详情 */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1 border-t border-slate-50 pt-3 mt-1 w-full">
              <span className="text-[11px] text-slate-500 font-medium">规划详情:</span>
              <div className="w-full min-h-[52px] p-2 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-300 italic flex items-start">
                请输入，最多支持1500字符内容
              </div>
            </div>

            {/* Nested collapsible lists */}
            <div className="col-span-1 md:col-span-2 space-y-2.5 mt-2.5">
              <NestedAccordionItem 
                title="适用产品"
                isOpen={!collapsedSections.products}
                onToggle={() => toggleSection('products')}
              >
                <CouponConfirmTable headers={headers} rows={productRows} />
              </NestedAccordionItem>

              <NestedAccordionItem 
                title="绑定指定资源标识"
                subtitle={<span className="text-[10px] text-rose-500 ml-2 font-medium">最大支持导入1500条资源实例</span>}
                isOpen={!collapsedSections.resources}
                onToggle={() => toggleSection('resources')}
              >
                <CouponConfirmTable headers={resourceHeaders} rows={resourceRows} />
              </NestedAccordionItem>

              <NestedAccordionItem 
                title="立即使用引导"
                isOpen={!collapsedSections.guide}
                onToggle={() => toggleSection('guide')}
              >
                <CouponConfirmTable 
                  headers={guideHeaders} 
                  rows={guideRows} 
                  emptyText="没有数据" 
                  subEmptyText="请先做数据查询" 
                />
              </NestedAccordionItem>
            </div>

            {/* 受限规则 Sub-segment */}
            <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-3 bg-blue-500 rounded-full" />
                <span className="text-[11px] font-bold text-slate-800">受限规则</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="text-rose-500 font-bold text-xs">*</span>
                    <span className="text-[11px] text-slate-500">是否具有营销活动规则互斥:</span>
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 shrink-0">
                    <span className="px-3.5 py-0.5 text-[10px] rounded bg-white text-blue-600 font-bold shadow-sm">是</span>
                    <span className="px-3.5 py-0.5 text-[10px] rounded text-slate-400">否</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="text-rose-500 font-bold text-xs">*</span>
                    <span className="text-[11px] text-slate-500">是否具有客户互斥:</span>
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 shrink-0">
                    <span className="px-3.5 py-0.5 text-[10px] rounded bg-white text-blue-600 font-bold shadow-sm">是</span>
                    <span className="px-3.5 py-0.5 text-[10px] rounded text-slate-400">否</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 col-span-1">
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="text-[11px] text-slate-500">是否配置结算基准价折扣:</span>
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 shrink-0">
                    <span className="px-3.5 py-0.5 text-[10px] rounded text-slate-400">是</span>
                    <span className="px-3.5 py-0.5 text-[10px] rounded bg-white text-blue-600 font-bold shadow-sm">否</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 资源池与可用区 Sub-segment */}
            <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-3 bg-blue-500 rounded-full" />
                <span className="text-[11px] font-bold text-slate-800">资源池与可用区</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500">是否限制资源池:</span>
                  <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 shrink-0">
                    <span className="px-3.5 py-0.5 text-[10px] rounded text-slate-400">是</span>
                    <span className="px-3.5 py-0.5 text-[10px] rounded bg-white text-blue-600 font-bold shadow-sm">否</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500">是否限制可用区:</span>
                  <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 shrink-0">
                    <span className="px-3.5 py-0.5 text-[10px] rounded text-slate-400">是</span>
                    <span className="px-3.5 py-0.5 text-[10px] rounded bg-white text-blue-600 font-bold shadow-sm">否</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CouponConfirmSection>

        {/* 优惠券方案信息 section */}
        {msg.data.details?.hasSchemeInfo && msg.data.details?.schemeInfo && (
          <CouponConfirmSection
            title="优惠券方案信息"
            isCollapsed={collapsedSections.schemeInfo}
            onToggle={() => toggleSection('schemeInfo')}
          >
            <div className="flex flex-col gap-4 text-[12px] text-slate-600">
              {/* 方案基础表单 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-3.5 p-1">
                {/* 方案名称 */}
                <div className="flex items-center gap-2 w-full">
                  <FormLabel label="方案名称:" required />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span className="font-medium">{msg.data.details.schemeInfo.schemeName || '618主机折扣活动'}</span>
                    <Search size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 归属营销活动 */}
                <div className="flex items-center gap-2 w-full">
                  <FormLabel label="归属营销活动:" />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span className={msg.data.details.schemeInfo.belongingActivity ? 'text-slate-700 font-medium' : 'text-slate-300'}>
                      {msg.data.details.schemeInfo.belongingActivity || '请选择'}
                    </span>
                    <div className="flex items-center gap-1 text-slate-300">
                      {msg.data.details.schemeInfo.belongingActivity && <X size={12} className="text-slate-400 hover:text-slate-600 cursor-pointer" />}
                      <Search size={12} className="text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* 开始时间 */}
                <div className="flex items-center gap-2 w-full">
                  <FormLabel label="开始时间:" required />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span className="font-mono">{msg.data.details.schemeInfo.startTime || '2026/05/12 00:00:00'}</span>
                    <Calendar size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 结束时间 */}
                <div className="flex items-center gap-2 w-full">
                  <FormLabel label="结束时间:" required />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span className="font-mono">{msg.data.details.schemeInfo.endTime || '2026/05/12 23:59:59'}</span>
                    <Calendar size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 所属省份 */}
                <div className="flex items-center gap-2 w-full">
                  <FormLabel label="所属省份:" required />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span>{msg.data.details.schemeInfo.province || '中国移动云能力中心'}</span>
                    <ChevronDown size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 所属地市 */}
                <div className="flex items-center gap-2 w-full">
                  <FormLabel label="所属地市:" />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span>{msg.data.details.schemeInfo.city || '--请选择--'}</span>
                    <ChevronDown size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 指定人员发券 */}
                <div className="flex items-center gap-2 w-full col-span-1 md:col-span-3">
                  <FormLabel label="指定人员发券:" />
                  <div className="flex-1 max-w-xs flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span className={msg.data.details.schemeInfo.designatedIssuer ? 'text-slate-700 font-medium' : 'text-slate-300 italic'}>
                      {msg.data.details.schemeInfo.designatedIssuer || '请填写'}
                    </span>
                    <Search size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 方案描述 */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-1 w-full">
                  <span className="text-[11px] text-slate-500 font-medium">方案描述:</span>
                  <div className="w-full min-h-[64px] p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 whitespace-pre-wrap">
                    {msg.data.details.schemeInfo.description || <span className="text-slate-300 italic">请填写</span>}
                  </div>
                </div>

                {/* 决策依据 */}
                <div className="flex items-center gap-2 w-full col-span-1 md:col-span-3 border-t border-slate-50 pt-3">
                  <FormLabel label="决策依据:" required />
                  <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                    <span className={msg.data.details.schemeInfo.decisionBasis ? 'text-blue-600 font-semibold cursor-pointer hover:underline' : 'text-slate-300 italic'}>
                      {msg.data.details.schemeInfo.decisionBasis || '请上传上述材料、申请邮件、会议纪要或业务联系单等附件'}
                    </span>
                    <Search size={12} className="text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* 优惠券策略配置 Divider Header */}
                <div className="col-span-1 md:col-span-3 flex items-center justify-between border-t border-slate-100 pt-5 mt-4 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-3 bg-blue-500 rounded-full" />
                    <span className="text-[12px] font-bold text-slate-800">优惠券策略配置</span>
                  </div>
                  <div 
                    onClick={() => toggleSection('strategyConfig')}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer select-none"
                  >
                    <span>{collapsedSections.strategyConfig ? '展开' : '收起'}</span>
                    {collapsedSections.strategyConfig ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                  </div>
                </div>
              </div>

              {/* Sub-collapsible portion */}
              <AnimatePresence initial={false}>
                {!collapsedSections.strategyConfig && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 p-1 border-t border-slate-50/50 pt-3 mt-1">
                      {/* 目标客户群 */}
                      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-center gap-2 w-full pb-1">
                        <FormLabel label="目标客户群:" required />
                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white max-w-md">
                            <span>{msg.data.details.schemeInfo.targetCustomer || '选择客户'}</span>
                            <Search size={12} className="text-slate-400 shrink-0" />
                          </div>
                          <div className="flex gap-2">
                            {['所有客户', '集团客户', '互联网客户'].map((tCust) => {
                              const active = msg.data.details.schemeInfo.targetCustomer === tCust || 
                                             (tCust === '所有客户' && (!msg.data.details.schemeInfo.targetCustomer || msg.data.details.schemeInfo.targetCustomer === '选择客户'));
                              return (
                                <button 
                                  key={tCust} 
                                  className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                                    active 
                                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                  }`}
                                >
                                  {tCust}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 营销位置 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="营销位置:" required />
                        <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                          <span>{msg.data.details.schemeInfo.marketingPosition || '请选择'}</span>
                          <Search size={12} className="text-slate-400 shrink-0" />
                        </div>
                      </div>

                      {/* 营销用语 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="营销用语:" required />
                        <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                          <span>{msg.data.details.schemeInfo.marketingLanguage || '请选择'}</span>
                          <Search size={12} className="text-slate-400 shrink-0" />
                        </div>
                      </div>

                      {/* 提醒模板 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="提醒模板:" required />
                        <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                          <span>{msg.data.details.schemeInfo.reminderTemplate || '请选择'}</span>
                          <Search size={12} className="text-slate-400 shrink-0" />
                        </div>
                      </div>

                      {/* 使用次数 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="使用次数:" required />
                        <div className="flex-1 h-8 flex items-center px-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px]">
                          {msg.data.details.schemeInfo.usageCount || '1'}
                        </div>
                      </div>

                      {/* 领取张数(人/次) */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="领取张数(人/次):" required className="w-28 text-slate-500 font-medium text-[11px]" />
                        <div className="flex-1 h-8 flex items-center px-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px]">
                          {msg.data.details.schemeInfo.receiveCount || '1'}
                        </div>
                      </div>

                      {/* 总数量设置 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="总数量设置:" required />
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                          <span className={`px-4.5 py-0.5 text-[10px] rounded-md font-bold transition-all ${msg.data.details.schemeInfo.totalQuantityEnabled ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                            是
                          </span>
                          <span className={`px-4.5 py-0.5 text-[10px] rounded-md font-bold transition-all ${!msg.data.details.schemeInfo.totalQuantityEnabled ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                            否
                          </span>
                        </div>
                      </div>

                      {/* 优惠券数量 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="优惠券数量:" required />
                        <div className="flex-1 h-8 flex items-center px-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold text-blue-600">
                          {msg.data.details.schemeInfo.couponQuantity || '1000'}
                        </div>
                      </div>

                      {/* 实名认证开始时间 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="实名认证开始:" className="w-24 text-[11px] text-slate-500" />
                        <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                          <span className={`font-mono ${msg.data.details.schemeInfo.authStartTime ? 'text-slate-700' : 'text-slate-300'}`}>
                            {msg.data.details.schemeInfo.authStartTime || '年 / 月 / 日  --:--:--'}
                          </span>
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                        </div>
                      </div>

                      {/* 实名认证结束时间 */}
                      <div className="flex items-center gap-2 w-full">
                        <FormLabel label="实名认证结束:" className="w-24 text-[11px] text-slate-500" />
                        <div className="flex-1 flex items-center justify-between h-8 px-3 border border-slate-200 rounded-lg text-[11px] text-slate-700 bg-white">
                          <span className={`font-mono ${msg.data.details.schemeInfo.authEndTime ? 'text-slate-700' : 'text-slate-300'}`}>
                            {msg.data.details.schemeInfo.authEndTime || '年 / 月 / 日  --:--:--'}
                          </span>
                          <Calendar size={12} className="text-slate-400 shrink-0" />
                        </div>
                      </div>

                      {/* 领取限制 */}
                      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:items-center gap-3 py-1 border-t border-slate-50 mt-1">
                        <FormLabel label="领取限制:" />
                        <div className="flex flex-wrap gap-6">
                          <FormCheckbox label="首购客户" checked={msg.data.details.schemeInfo.limits?.includes('首购') || false} />
                          <FormCheckbox label="已购客户" checked={msg.data.details.schemeInfo.limits?.includes('已购') || false} />
                          <FormCheckbox label="首次付费客户" checked={msg.data.details.schemeInfo.limits?.includes('首次付费') || false} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CouponConfirmSection>
        )}

        {/* 发券策略信息 section */}
        {msg.data.details?.hasIssuingStrategy && (
          <CouponConfirmSection
            title="发券策略信息"
            isCollapsed={collapsedSections.issueStrategy}
            onToggle={() => toggleSection('issueStrategy')}
          >
            <div className="flex flex-col gap-4 text-[12px] text-slate-600">
              {/* 发放方式 */}
              <div className="flex items-center gap-6 p-1 border-b border-slate-50 pb-3">
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-slate-500 font-medium text-[11px]">发放方式:</span>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-semibold text-slate-700">
                    <input 
                      type="radio" 
                      name="issueType" 
                      checked={issueType === 'direct'} 
                      onChange={() => setIssueType('direct')}
                      className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>直接发券</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-400">
                    <input 
                      type="radio" 
                      name="issueType" 
                      checked={issueType === 'appointment'} 
                      onChange={() => setIssueType('appointment')}
                      className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>预约发券</span>
                  </label>
                </div>
              </div>

              {/* 用户查询 / 客户群查询 Title Line */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="text-blue-600 font-bold text-[12px] flex items-center gap-1">
                  <span>{queryType === 'user' ? '用户查询' : '客户群查询'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQueryType(prev => prev === 'user' ? 'group' : 'user')}
                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    <Shuffle size={12} className="text-slate-400" />
                    <span>{queryType === 'user' ? '切换为客户群查询' : '切换为用户查询'}</span>
                  </button>
                  <button 
                    onClick={handleAddRecord}
                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                  >
                    <Plus size={12} className="text-slate-400" />
                    <span>添加</span>
                  </button>
                </div>
              </div>

              {/* 用户信息列表 / 客户群信息列表 */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-700">
                  {queryType === 'user' ? '用户信息列表' : '客户群信息列表'}
                </span>
                
                {queryType === 'user' ? (
                  issuedUsers.length === 0 ? (
                    <div className="text-center py-6 text-slate-300 bg-slate-500/5 rounded-xl border border-dashed border-slate-200">
                      暂无关联用户信息，请点击上方“添加”
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="min-w-full divide-y divide-slate-100 text-left text-[11px]">
                        <thead className="bg-slate-50/70 text-slate-500 font-medium h-9">
                          <tr>
                            <th className="px-4 py-2 w-12 text-center">操作</th>
                            <th className="px-4 py-2">OP用户编码</th>
                            <th className="px-4 py-2">用户名称</th>
                            <th className="px-4 py-2">用户昵称</th>
                            <th className="px-4 py-2">邮箱</th>
                            <th className="px-4 py-2">手机号</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                          {issuedUsers.map((user, idx) => (
                            <tr key={user.id + idx} className="hover:bg-slate-50/50 h-10 transition-colors">
                              <td className="px-4 py-2 text-center">
                                <button 
                                  onClick={() => setIssuedUsers(prev => prev.filter((_, i) => i !== idx))}
                                  className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                                  title="删除"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                              <td className="px-4 py-2 font-mono text-blue-500 hover:underline cursor-pointer select-all truncate max-w-[200px]" title={user.id}>
                                {user.id}
                              </td>
                              <td className="px-4 py-2 font-medium text-slate-700 truncate max-w-[150px]" title={user.name}>
                                {user.name}
                              </td>
                              <td className="px-4 py-2 text-slate-500 truncate max-w-[150px]" title={user.nickname}>
                                {user.nickname}
                              </td>
                              <td className="px-4 py-2 font-mono text-slate-400">
                                {user.email}
                              </td>
                              <td className="px-4 py-2 font-mono text-slate-500 font-semibold">
                                {user.phone}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  issuedGroups.length === 0 ? (
                    <div className="text-center py-6 text-slate-300 bg-slate-500/5 rounded-xl border border-dashed border-slate-200">
                      暂无客户群信息，请点击上方“添加”
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="min-w-full divide-y divide-slate-100 text-left text-[11px]">
                        <thead className="bg-slate-50/70 text-slate-500 font-medium h-9">
                          <tr>
                            <th className="px-4 py-2 w-12 text-center">操作</th>
                            <th className="px-4 py-2">客户群编码</th>
                            <th className="px-4 py-2">客户群名称</th>
                            <th className="px-4 py-2">客户群描述</th>
                            <th className="px-4 py-2 w-28 text-right">用户数量</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                          {issuedGroups.map((group, idx) => (
                            <tr key={group.id + idx} className="hover:bg-slate-50/50 h-10 transition-colors">
                              <td className="px-4 py-2 text-center">
                                <button 
                                  onClick={() => setIssuedGroups(prev => prev.filter((_, i) => i !== idx))}
                                  className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                                  title="删除"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                              <td className="px-4 py-2 font-mono text-blue-500 hover:underline cursor-pointer select-all">
                                {group.id}
                              </td>
                              <td className="px-4 py-2 font-semibold text-slate-700">
                                {group.name}
                              </td>
                              <td className="px-4 py-2 text-slate-400 text-xs truncate max-w-[200px]" title={group.desc}>
                                {group.desc}
                              </td>
                              <td className="px-4 py-2 font-mono text-slate-600 font-bold text-right pr-6">
                                {group.count}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            </div>
          </CouponConfirmSection>
        )}

        {/* 只有一个确认按钮 */}
        <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
          <button 
            onClick={() => {
              setIsSubmitting(true);
              setTimeout(() => {
                setIsSubmitting(false);
                window.open(CARD_DETAILS_REDIRECT_URL, '_blank');
              }, 1200);
            }}
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 active:shadow-sm text-white font-bold text-sm px-10 py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            确认
          </button>
        </div>
      </div>

      {/* 卡片后添加 “你还可以” 操作板 */}
      <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">你还可以</span>
        <div className="flex items-center gap-2">
          {msg.data.details?.hasSchemeInfo ? (
            <button 
              onClick={() => {
                setInput('给【客户ID/客户名称/客户群ID】发券');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-200/80 hover:border-blue-300 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Settings size={14} className="text-blue-500" />
              发券策略配置
            </button>
          ) : (
            <button 
              onClick={() => {
                setInput('【方案名称】【优惠券数量】【决策依据】');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-200/80 hover:border-blue-300 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Settings size={14} className="text-blue-500" />
              优惠券方案配置
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const extractBrackets = (text: string): string[] => {
  if (!text) return [];
  const regex = /【([^】]+)】/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!matches.includes(match[0])) {
      matches.push(match[0]);
    }
  }
  return matches;
};

const resolvePlaceholders = (text: string): string => {
  if (!text) return text;
  return text.replace(/【([^】|]+)(?:\|([^】]*))?】/g, (match, name, value) => {
    return value !== undefined ? value : name;
  });
};

const ASSISTANT_AVATAR = "/headimage.png";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [editingPlaceholder, setEditingPlaceholder] = useState<{
    placeholder: string;
    contextText?: string;
    source: 'input' | 'message' | 'suggestion';
    messageId?: string;
    suggestionIdx?: number;
    matchIndex?: number;
  } | null>(null);
  const [placeholderValue, setPlaceholderValue] = useState('');
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  useEffect(() => {
    // If input is updated to something that contains brackets, reset isEditingTemplate so user gets the parameter widgets
    if (input.includes('【')) {
      setIsEditingTemplate(false);
    }
  }, [input]);

  const handleSavePlaceholderReplacement = () => {
    if (!editingPlaceholder) return;
    const val = placeholderValue.trim();
    
    // Extract the placeholder name
    const bracketMatch = editingPlaceholder.placeholder.match(/【([^】|]+)(?:\|([^】]*))?】/);
    const name = bracketMatch ? bracketMatch[1] : '';
    
    // If val is provided, form 【name|value】; otherwise revert to standard placeholder 【name】
    const newPlaceholder = name ? (val ? `【${name}|${val}】` : `【${name}】`) : val;

    if (editingPlaceholder.source === 'input') {
      setInput(prev => prev.replaceAll(editingPlaceholder.placeholder, newPlaceholder));
    } else if (editingPlaceholder.contextText) {
      const updatedText = editingPlaceholder.contextText.replaceAll(editingPlaceholder.placeholder, newPlaceholder);
      setInput(updatedText);
    }
    setEditingPlaceholder(null);
    setPlaceholderValue('');
  };

  const renderTextWithPlaceholders = (
    text: string, 
    source: 'input' | 'message' | 'suggestion',
    contextText?: string,
    messageId?: string,
    suggestionIdx?: number
  ) => {
    if (!text) return text;
    
    const bracketRegex = /【([^】]+)】/g;
    const parts = [];
    let lastIdx = 0;
    let match;
    let bracketIndex = 0;
    
    while ((match = bracketRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const fullBracket = match[0];
      const placeholderContent = match[1];
      const pipeIdx = placeholderContent.indexOf('|');
      const placeholderName = pipeIdx !== -1 ? placeholderContent.substring(0, pipeIdx) : placeholderContent;
      const placeholderVal = pipeIdx !== -1 ? placeholderContent.substring(pipeIdx + 1) : '';
      const currentBracketIdx = bracketIndex++;
      
      if (matchIndex > lastIdx) {
        parts.push(text.substring(lastIdx, matchIndex));
      }
      
      const isCurrentlyEditing = 
        editingPlaceholder &&
        editingPlaceholder.placeholder === fullBracket &&
        editingPlaceholder.source === source &&
        (source === 'message' ? editingPlaceholder.messageId === messageId : true) &&
        (source === 'suggestion' ? editingPlaceholder.suggestionIdx === suggestionIdx : true) &&
        editingPlaceholder.matchIndex === currentBracketIdx;
        
      if (isCurrentlyEditing) {
        parts.push(
          <span
            key={`edit-${matchIndex}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="inline-flex items-center gap-1 bg-white border border-blue-400 rounded-lg px-2 py-0.5 mx-1 shadow-sm"
          >
            <input
              type="text"
              autoFocus
              placeholder={placeholderName}
              value={placeholderValue}
              onChange={(e) => setPlaceholderValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSavePlaceholderReplacement();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditingPlaceholder(null);
                }
              }}
              className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-100 text-slate-800 max-w-[140px]"
            />
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                handleSavePlaceholderReplacement();
              }}
              className="text-emerald-600 hover:text-emerald-700 p-0.5 hover:bg-emerald-50 rounded transition-colors cursor-pointer shrink-0"
              title="确定"
            >
              <Check size={12} />
            </button>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                setEditingPlaceholder(null);
              }}
              className="text-rose-500 hover:text-rose-600 p-0.5 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
              title="取消"
            >
              <X size={12} />
            </button>
          </span>
        );
      } else if (placeholderVal !== '') {
        parts.push(
          <span
            key={matchIndex}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditingPlaceholder({
                placeholder: fullBracket,
                contextText: contextText || text,
                source,
                messageId,
                suggestionIdx,
                matchIndex: currentBracketIdx
              });
              setPlaceholderValue(placeholderVal);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-505 text-emerald-700 hover:text-white text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-95 group"
            title={`点击修改“${placeholderName}”`}
          >
            <span className="opacity-60 text-[10px] font-bold">{placeholderName}:</span>
            <span className="font-bold">{placeholderVal}</span>
            <Pencil size={10} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
          </span>
        );
      } else {
        parts.push(
          <span
            key={matchIndex}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditingPlaceholder({
                placeholder: fullBracket,
                contextText: contextText || text,
                source,
                messageId,
                suggestionIdx,
                matchIndex: currentBracketIdx
              });
              setPlaceholderValue('');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-0.5 rounded-lg bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-500 text-blue-600 hover:text-white text-xs font-bold transition-all duration-150 cursor-pointer select-none active:scale-95 group"
            title={`点击替换“${placeholderName}”`}
          >
            {placeholderName}
            <Pencil size={10} className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
          </span>
        );
      }
      
      lastIdx = bracketRegex.lastIndex;
    }
    
    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }
    
    return parts.length > 0 ? <span className="inline-flex items-center flex-wrap gap-y-1">{parts}</span> : text;
  };

  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; size: number }[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleImportConfirm = (promptMsgId: string, fileName: string) => {
    setMessages(prev => {
      const updatedMessagesWithFlag = prev.map(m => {
        if (m.id === promptMsgId && m.type === 'import-confirm-prompt') {
          return { ...m, data: { ...m.data, actionTaken: 'confirmed' } };
        }
        return m;
      });

      const userMsgId = Date.now().toString();
      const userMsg: Message = {
        id: userMsgId,
        role: 'user',
        content: `确认导入并在优惠券配置中绑定：${fileName}`,
        timestamp: Date.now()
      };

      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: `已成功将文件 \`${fileName}\` 中的资源标识导入并绑定至【容量型云硬盘-云创版】优惠券配置中。`,
        type: 'coupon-config-card',
        data: {
          id: 'coupon-disk-config',
          title: '容量型云硬盘-云创版 优惠券配置',
          description: '容量型云硬盘-云创版',
          tag: '优惠券',
          details: {
            name: '容量型云硬盘-云创版 9折优惠券',
            category: '大云优惠券',
            effectiveMode: '绝对时间',
            type: '折扣券',
            effectiveDate: '2026-05-27 15:12:49',
            expiryDate: '2026-06-27 15:12:49',
            specification: '90%',
            cumulativeMode: '按周期累计',
            totalPrice: '200',
            customerType: '全体客户',
            subscriptionTypes: '通用, 续订',
            feeTypes: '包月',
            project: '通用项目',
            quantity: '1000',
            hasAttachedFiles: true,
            hasBoundResources: true,
            boundResources: [
              {
                resourceId: 'af3c0bb2-493c-4142-b0e9-769d83d03887',
                orderId: 'MOP-T-26052707573540',
                productName: '容量型云硬盘-云创版',
                specName: '容量型云硬盘-云创版规格',
                status: '生效',
                billingMode: '按月后付费',
                startTime: '2026-05-27 15:12:49',
                endTime: '2026-06-27 15:12:49'
              }
            ]
          }
        },
        timestamp: Date.now() + 10,
        isComplete: true
      };

      const finalMessages = [...updatedMessagesWithFlag, userMsg, aiMsg];
      if (currentConversationId) {
        setHistoryConversations(hPrev => hPrev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: finalMessages,
              lastMessage: aiMsg.content,
              timestamp: Date.now()
            };
          }
          return conv;
        }));
      }
      return finalMessages;
    });
  };

  const handleImportCancel = (promptMsgId: string) => {
    setMessages(prev => {
      const updatedMessagesWithFlag = prev.map(m => {
        if (m.id === promptMsgId && m.type === 'import-confirm-prompt') {
          return { ...m, data: { ...m.data, actionTaken: 'cancelled' } };
        }
        return m;
      });

      const userMsgId = Date.now().toString();
      const userMsg: Message = {
        id: userMsgId,
        role: 'user',
        content: `取消导入`,
        timestamp: Date.now()
      };

      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: `已取消将资源标识导入及绑定。`,
        timestamp: Date.now() + 10,
        isComplete: true
      };

      const finalMessages = [...updatedMessagesWithFlag, userMsg, aiMsg];
      if (currentConversationId) {
        setHistoryConversations(hPrev => hPrev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: finalMessages,
              lastMessage: aiMsg.content,
              timestamp: Date.now()
            };
          }
          return conv;
        }));
      }
      return finalMessages;
    });
  };

  const handleConfirmRisk = (msgId: string) => {
    setMessages(prev => {
      // Find the confirmed risk record to check its type
      const targetRiskMsg = prev.find(m => m.id === msgId);
      const isCouponRisk = targetRiskMsg?.data?.riskType === 'coupon';

      // Mark the risk-confirm message as successfully confirmed in database/conversations list
      const updated = prev.map(m => {
        if (m.id === msgId && m.type === 'risk-confirm') {
          return {
            ...m,
            data: { ...m.data, isConfirmed: true }
          };
        }
        return m;
      });

      // Add a user confirm chat line
      const userMsgId = Date.now().toString();
      const userMsg: Message = {
        id: userMsgId,
        role: 'user',
        content: '我已阅读风险提示，确认无误并同意。',
        timestamp: Date.now()
      };

      let finalMessages: Message[] = [];
      let lastMsgText = '';

      if (isCouponRisk) {
        // Find the "优惠额度" rule from KEYWORD_RULES
        const rule = KEYWORD_RULES.find(r => r.keyword === '优惠额度');
        const couponRecommendationMsgId = (Date.now() + 2).toString();
        const couponRecommendationMsg: Message = {
          id: couponRecommendationMsgId,
          role: 'assistant',
          content: '基于风险信息确认，为您推荐以下可用优惠券选项。请选择并进行配置：',
          type: 'product-list',
          timestamp: Date.now() + 10,
          isComplete: true,
          data: rule?.data || []
        };
        finalMessages = [...updated, userMsg, couponRecommendationMsg];
        lastMsgText = '已为您载入推荐优惠券，请进行后续配置';
      } else {
        // Add the new recommended marketing card
        const recommendationMsgId = (Date.now() + 2).toString();
        const recommendationMsg: Message = {
          id: recommendationMsgId,
          role: 'assistant',
          content: '基于风险信息确认，为您推荐以下新春专享营销案选项。请检查是否适合您的配置需求：',
          type: 'marketing-recommendation',
          timestamp: Date.now() + 10,
          isComplete: true,
          data: {
            strategies: [
              {
                id: "315420014013",
                title: "数据库传输服务产品",
                name: "云启新春，数智惠民：数据库传输服务产品",
                code: "315420014013",
                tag: "营销统一折扣",
                percentage: "95%",
                time: "2026年1月12日-2026年3月21日",
                discountColor: "bg-[#00B96B]" // Green pill for 95%
              },
              {
                id: "313320010612",
                title: "云主机产品",
                name: "云启新春，数智惠民：云主机产品",
                code: "313320010612",
                tag: "营销统一折扣",
                percentage: "80%",
                time: "2026年1月12日-2026年3月21日",
                discountColor: "bg-[#FF8F00]" // Orange/Amber pill for 80%
              },
              {
                id: "313320010613",
                title: "云电脑产品",
                name: "云启新春，数智惠民：云电脑产品",
                code: "313320010613",
                tag: "营销统一折扣",
                percentage: "65%",
                time: "2026年1月12日-2026年3月21日",
                discountColor: "bg-[#FF2E59]" // Red pill for 65%
              }
            ]
          }
        };
        finalMessages = [...updated, userMsg, recommendationMsg];
        lastMsgText = '已为您载入推荐营销案，请进行后续配置';
      }

      // Also update history conversations
      if (currentConversationId) {
        setHistoryConversations(hPrev => hPrev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: finalMessages,
              lastMessage: lastMsgText,
              timestamp: Date.now()
            };
          }
          return conv;
        }));
      }
      
      return finalMessages;
    });
  };

  const handleConfigureRecommendation = (item: any) => {
    // Translate the item ID/code to the complete coupon strategy payload!
    let couponData = null;
    if (item.code === '315420014013') {
      // Database Transmission Service Product
      couponData = {
        id: 'coupon-db-config',
        title: '数据库传输服务产品 95折优惠券',
        description: '云启新春，数智惠民：数据库传输服务产品',
        tag: '产品折扣',
        details: {
          name: '数据库传输服务产品 9折优惠券', // Base name
          category: '大云优惠券',
          effectiveMode: '绝对时间',
          type: '折扣券',
          effectiveDate: '2026-01-12 00:00:00',
          expiryDate: '2026-03-21 23:59:59',
          specification: '95%',
          cumulativeMode: '按周期累计',
          totalPrice: '200',
          customerType: '全体客户',
          subscriptionTypes: '通用, 续订',
          feeTypes: '包月',
          project: '云启新春，数智惠民：数据库传输服务产品',
          quantity: '3000',
          schemeInfo: {
            schemeName: '云启新春，数智惠民：数据库传输服务产品',
            belongingActivity: '云启新春，数智惠民',
            startTime: '2026/01/12 00:00:00',
            endTime: '2026/03/21 23:59:59',
            province: '中国移动云能力中心',
            city: '北京市',
            designatedIssuer: '管理员(王**)',
            description: '针对数据库传输服务产品核心资源进行的95%折扣优待优惠率方案。',
            decisionBasis: '新春大促企画案-V2.pdf',
            targetCustomer: '全体客户',
            marketingPosition: '数据库传输服务订购面板',
            marketingLanguage: '【新春惠民】北京移动大客户专享，数据库传输服务限时95折优惠！',
            reminderTemplate: 'TM-NEWYEAR-DB-01',
            usageCount: '1',
            receiveCount: '1',
            totalQuantityEnabled: true,
            couponQuantity: '3000',
          }
        }
      };
    } else if (item.code === '313320010612') {
      // Cloud Host Product
      couponData = {
        id: 'coupon-host-config',
        title: '云主机产品 80%折扣优惠券',
        description: '云启新春，数智惠民：云主机产品',
        tag: '产品折扣',
        details: {
          name: '针对企业云主机核心计算资源进行的80%折扣力度限时优惠率方案。',
          category: '大云优惠券',
          effectiveMode: '绝对时间',
          type: '折扣券',
          effectiveDate: '2026-01-12 00:00:00',
          expiryDate: '2026-03-21 23:59:59',
          specification: '80%',
          cumulativeMode: '按周期累计',
          totalPrice: '200',
          customerType: '全体客户',
          subscriptionTypes: '通用, 续订',
          feeTypes: '包月',
          project: '云启新春，数智惠民：云主机产品',
          quantity: '5000',
          schemeInfo: {
            schemeName: '云启新春，数智惠民：云主机产品',
            belongingActivity: '云启新春，数智惠民',
            startTime: '2026/01/12 00:00:00',
            endTime: '2026/03/21 23:59:59',
            province: '中国移动云能力中心',
            city: '北京市',
            designatedIssuer: '管理员(王**)',
            description: '针对企业云主机核心计算资源进行的80%折扣力度限时优惠率方案。',
            decisionBasis: '新春大促企画案-V2.pdf',
            targetCustomer: '全体客户',
            marketingPosition: '大云云主机业务订购页面',
            marketingLanguage: '【新春惠民】北京移动大客户专享，核心云主机限时8折优惠，邀您体验数智计算！',
            reminderTemplate: 'TM-NEWYEAR-HOST-01',
            usageCount: '1',
            receiveCount: '1',
            totalQuantityEnabled: true,
            couponQuantity: '5000',
          }
        }
      };
    } else if (item.code === '313320010613') {
      // Cloud PC Product
      couponData = {
        id: 'coupon-pc-config',
        title: '云电脑产品 65%折扣优惠券',
        description: '云启新春，数智惠民：云电脑产品',
        tag: '产品折扣',
        details: {
          name: '针对云电脑终端产品核心资源进行的65%折扣力度限时优惠率方案。',
          category: '大云优惠券',
          effectiveMode: '绝对时间',
          type: '折扣券',
          effectiveDate: '2026-01-12 00:00:00',
          expiryDate: '2026-03-21 23:59:59',
          specification: '65%',
          cumulativeMode: '按周期累计',
          totalPrice: '200',
          customerType: '全体客户',
          subscriptionTypes: '通用, 续订',
          feeTypes: '包月',
          project: '云启新春，数智惠民：云电脑产品',
          quantity: '1500',
          schemeInfo: {
            schemeName: '云启新春，数智惠民：云电脑产品',
            belongingActivity: '云启新春，数智惠民',
            startTime: '2026/01/12 00:00:00',
            endTime: '2026/03/21 23:59:59',
            province: '中国移动云能力中心',
            city: '北京市',
            designatedIssuer: '管理员(王**)',
            description: '针对云电脑终端产品核心资源进行的65%折扣力度限时优惠率方案。',
            decisionBasis: '新春大促企画案-V2.pdf',
            targetCustomer: '全体客户',
            marketingPosition: '云电脑业务订购二级页面',
            marketingLanguage: '【新春惠民】北京移动大客户专享，云电脑服务核心配置限时65折优惠！',
            reminderTemplate: 'TM-NEWYEAR-PC-01',
            usageCount: '1',
            receiveCount: '1',
            totalQuantityEnabled: true,
            couponQuantity: '1500',
          }
        }
      };
    }

    if (couponData) {
      setSelectedCouponForConfig(couponData);
      setIsStrategyReadOnly(false);
      setIsStrategyModalOpen(true);
    }
  };

  const handleViewRecommendationDetail = (item: any) => {
    let strategyDetail = null;
    if (item.code === '315420014013') {
      strategyDetail = {
        id: "315420014013",
        basicInfo: {
          name: "云启新春，数智惠民：数据库传输服务产品",
          category: "产品折扣",
          subCategory: "限时优惠",
          startTime: "2026-01-12 00:00:00",
          endTime: "2026-03-21 23:59:59",
          province: "北京市",
          operatorNames: "管理员(王**)",
          campaignCode: "CMP-20260112-998",
          campaignName: "云启新春，数智惠民",
          city: "北京市",
          description: "对企业数据库传输服务产品核心资源进行的95%折扣优待优惠率方案。",
          decisionBasis: "新春大促评会纪要-副本.pdf",
        },
        locationInfo: {
          code: "POS-DB-001",
          name: "数据库传输服务订购面板",
        },
        ruleInfo: {
          usageLimit: "每位客户限享受一次优惠",
          receiveLimit: "1",
          totalLimitEnabled: "是",
          quantity: "3000",
          discountValue: "95折",
          authStartTime: "2026-01-12 00:00:00",
        },
        languageInfo: {
          content: "【新春惠民】北京移动大客户专享，数据库传输服务限时95折优惠！",
          reminderTemplateCode: "TM-NEWYEAR-DB-01",
        },
      };
    } else if (item.code === '313320010612') {
      strategyDetail = {
        id: "313320010612",
        basicInfo: {
          name: "云启新春，数智惠民：云主机产品",
          category: "产品折扣",
          subCategory: "限时优惠",
          startTime: "2026-01-12 00:00:00",
          endTime: "2026-03-21 23:59:59",
          province: "北京市",
          operatorNames: "管理员(王**)",
          campaignCode: "CMP-20260112-998",
          campaignName: "云启新春，数智惠民",
          city: "北京市",
          description: "针对企业云主机核心计算资源进行的80%折扣力度限时优惠率方案。",
          decisionBasis: "新春大促企策划案-V2.pdf",
        },
        locationInfo: {
          code: "POS-CH-001",
          name: "大云云主机业务订购页面",
        },
        ruleInfo: {
          usageLimit: "每位客户限享受一次优惠",
          receiveLimit: "1",
          totalLimitEnabled: "是",
          quantity: "5000",
          discountValue: "8折",
          authStartTime: "2026-01-12 00:00:00",
        },
        languageInfo: {
          content: "【新春惠民】北京移动大客户专享，核心云主机限时8折优惠，邀您体验数智计算！",
          reminderTemplateCode: "TM-NEWYEAR-HOST-01",
        },
      };
    } else if (item.code === '313320010613') {
      strategyDetail = {
        id: "313320010613",
        basicInfo: {
          name: "云启新春，数智惠民：云电脑产品",
          category: "产品折扣",
          subCategory: "限时优惠",
          startTime: "2026-01-12 00:00:00",
          endTime: "2026-03-21 23:59:59",
          province: "北京市",
          operatorNames: "管理员(王**)",
          campaignCode: "CMP-20260112-998",
          campaignName: "云启新春，数智惠民",
          city: "北京市",
          description: "针对云电脑终端产品核心资源进行的65%折扣力度限时优惠率方案。",
          decisionBasis: "新春大促大联办纪要-修正.pdf",
        },
        locationInfo: {
          code: "POS-CPC-001",
          name: "云电脑业务订购二级页面",
        },
        ruleInfo: {
          usageLimit: "每位客户限享受一次优惠",
          receiveLimit: "1",
          totalLimitEnabled: "是",
          quantity: "1500",
          discountValue: "65折",
          authStartTime: "2026-01-12 00:00:00",
        },
        languageInfo: {
          content: "【新春惠民】北京移动大客户专享，云电脑服务核心配置限时65折优惠！",
          reminderTemplateCode: "TM-NEWYEAR-PC-01",
        },
      };
    }

    if (strategyDetail) {
      setSelectedStrategyDetail(strategyDetail);
      setIsStrategyDetailModalOpen(true);
    }
  };

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSpecConfigModalOpen, setIsSpecConfigModalOpen] = useState(false);
  const [isSpecEditMode, setIsSpecEditMode] = useState(false);
  const [editingSpecInfo, setEditingSpecInfo] = useState<{ msgId: string, index: number } | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [isSpecAttributeModalOpen, setIsSpecAttributeModalOpen] = useState(false);
  const [isProductModifyModalOpen, setIsProductModifyModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [focusedFunction, setFocusedFunction] = useState<'faq' | 'query' | 'coupon' | 'product' | 'goods' | 'workorder' | null>(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isStrategyDetailModalOpen, setIsStrategyDetailModalOpen] = useState(false);
  const [isStrategyReadOnly, setIsStrategyReadOnly] = useState(false);
  const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);
  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<any>(null);
  const [selectedCouponForConfig, setSelectedCouponForConfig] = useState<Coupon | null>(null);
  const [editingCouponMsgId, setEditingCouponMsgId] = useState<string | null>(null);
  const [selectedCouponDetail, setSelectedCouponDetail] = useState<CouponDetail | null>(null);
  const [selectedStrategyDetail, setSelectedStrategyDetail] = useState<MarketingStrategyDetail | null>(null);
  const [activeNav, setActiveNav] = useState('chat');
  const [isCommonModalOpen, setIsCommonModalOpen] = useState(false);
  const [conversations, setConversations] = useState(COMMON_CONVERSATIONS);
  const [historyConversations, setHistoryConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editingHistoryTitle, setEditingHistoryTitle] = useState('');
  const [commonModalTab, setCommonModalTab] = useState('全部');
  const [commonSearchQuery, setCommonSearchQuery] = useState('');
  const [commonCurrentPage, setCommonCurrentPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [queryButtonsConfig, setQueryButtonsConfig] = useState(() => {
    const saved = localStorage.getItem('queryButtonsConfig');
    if (saved) {
      try {
        let config = JSON.parse(saved);
        
        // Ensure new items are added at the beginning if they don't exist
        const hasDayunOrder = config.some((btn: any) => btn.label === '大云订单查询');
        const hasOpenCloudOrder = config.some((btn: any) => btn.label === '开放云订单查询');
        const hasDetailedBill = config.some((btn: any) => btn.label === '详单查询');
        
        if (!hasOpenCloudOrder) {
          config = [{ label: '开放云订单查询', value: '查看开放云[订单批次编号/订单号/MOP用户编号]订单信息' }, ...config];
        }
        if (!hasDayunOrder) {
          config = [{ label: '大云订单查询', value: '查看[订单号/MOP用户编号/客户编号]订单信息' }, ...config];
        }
        if (!hasDetailedBill) {
          // Find the index of "账单查询" to insert "详单查询" after it if possible, otherwise at the start
          const billingIdx = config.findIndex((btn: any) => btn.label === '账单查询');
          if (billingIdx !== -1) {
            config.splice(billingIdx + 1, 0, { label: '详单查询', value: '查下【客户名称】【上个月】的详单' });
          } else {
            config = [{ label: '详单查询', value: '查下【客户名称】【上个月】的详单' }, ...config];
          }
        }

        // Ensure BOSS客户视图, 账单查询, 话单查询 and 大云商品查询 are updated to the new requirements
        return config.map((btn: any) => {
          if (btn.label === 'BOSS客户视图' && btn.value === '查询BOSS客户视图') {
            return { ...btn, value: '查下【亚信科技】的客户信息' };
          }
          if (btn.label === '账单查询' && (btn.value === '查询客户近三个月账单' || btn.value === '查下【亚信科技】【近三个月】的账单')) {
            return { ...btn, value: '查下【亚信科技】【近三个月】的账单' };
          }
          if (btn.label === '话单查询') {
            return { ...btn, value: '查下【客户名称】【订购编码/订单项编码】【上个月】的话单' };
          }
          if (btn.label === '详单查询') {
             return { ...btn, value: '查下【客户名称】【上个月】的详单' };
          }
          if (btn.label === '大云商品查询' && (btn.value === '查询大云商品信息' || btn.value === '查询【云主机】的商品信息')) {
            return { ...btn, value: '查询【云主机】的商品信息' };
          }
          return btn;
        });
      } catch (e) {
        console.error('Failed to parse saved queryButtonsConfig', e);
      }
    }
    const lines = INFO_QUERY_CONTENT.split('\n').filter(l => l.trim());
    return lines.map(line => {
      const [label, value] = line.split('：');
      return { label: label || '', value: value || '' };
    });
  });

  useEffect(() => {
    localStorage.setItem('queryButtonsConfig', JSON.stringify(queryButtonsConfig));
  }, [queryButtonsConfig]);
  const ITEMS_PER_PAGE = 5;

  const filteredConversations = conversations
    .filter(item => {
      const matchesTab = commonModalTab === '全部' || 
                        (commonModalTab === '我的收藏' && item.category === '收藏') ||
                        (commonModalTab === '业务查询' && item.category === '查询') ||
                        (commonModalTab === '业务操作' && item.category === '办理');
      const matchesSearch = item.text.toLowerCase().includes(commonSearchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(item => item.id !== id));
  };

  const handlePinConversation = (id: string) => {
    setConversations(prev => prev.map(item => 
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    ));
  };

  const handleEditConversation = (id: string, newText: string) => {
    setConversations(prev => prev.map(item => 
      item.id === id ? { ...item, text: newText } : item
    ));
  };

  const filteredHistory = historyConversations
    .filter(conv => {
      const query = historySearchQuery.toLowerCase();
      const titleMatch = conv.title.toLowerCase().includes(query);
      const contentMatch = conv.messages.some(msg => msg.content.toLowerCase().includes(query));
      return titleMatch || contentMatch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });

  const handlePinHistory = (id: string) => {
    setHistoryConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
    ));
  };

  const handleHistoryEditSubmit = (id: string) => {
    if (!editingHistoryTitle.trim()) {
      setEditingHistoryId(null);
      return;
    }
    setHistoryConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, title: editingHistoryTitle } : conv
    ));
    setEditingHistoryId(null);
  };

  const totalPages = Math.ceil(filteredConversations.length / ITEMS_PER_PAGE);
  const paginatedConversations = filteredConversations.slice(
    (commonCurrentPage - 1) * ITEMS_PER_PAGE,
    commonCurrentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCommonCurrentPage(1);
  }, [commonModalTab, commonSearchQuery]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = (text: string, id: string, msg?: Message) => {
    let copyText = text;
    if (msg && msg.type === 'query-buttons' && Array.isArray(msg.data)) {
      const buttonList = msg.data.map((b: any) => `${b.label}：${b.value}`).join('\n');
      copyText = `${msg.content}\n${buttonList}`;
    } else if (msg && msg.type === 'detailed-bill' && Array.isArray(msg.data)) {
      const headers = ['账期', '客户名称', '订购账户名称', '商品名称', '计费场景', '计费项单价', '使用量', '单位', '服务时长', '时长单位', '目录金额(元)', '优惠金额(元)', '应收金额(元)'];
      const rows = msg.data.map((item: any) => [
        item.billingPeriod, item.customerName, item.orderAccountName, item.productName,
        item.billingScenario, item.unitPrice, item.usage, item.usageUnit,
        item.serviceDuration, item.durationUnit, item.catalogAmount,
        item.discountAmount, item.receivableAmount
      ].join('\t'));
      copyText = `${msg.content}\n${headers.join('\t')}\n${rows.join('\n')}`;
    } else if (msg && msg.type === 'call-log' && Array.isArray(msg.data)) {
      const headers = ['话单名', '流水', '客户编码', '账单日期', '订购编码', '商品编码', '资费编码', '资费科目', '开始日期', '开始时间', '结束日期', '结束时间', '时长(秒)', '单价'];
      const rows = msg.data.map((item: any) => [
        item.callLogName, item.serialNumber, item.customerCode, item.billingDate,
        item.orderCode, item.productCode, item.tariffCode, item.tariffSubject,
        item.startDate, item.startTime, item.endDate, item.endTime,
        item.duration, item.unitPrice
      ].join('\t'));
      copyText = `${msg.content}\n${headers.join('\t')}\n${rows.join('\n')}`;
    }
    navigator.clipboard.writeText(copyText).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleRegenerate = async (id: string) => {
    if (isGenerating || !currentConversationId) return;
    
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex <= 0) return;
    
    // The previous message should be the user's message
    const userMsg = messages[msgIndex - 1];
    if (userMsg.role !== 'user') return;
    
    // Keep messages up to the user's message
    const newMessages = messages.slice(0, msgIndex);
    setMessages(newMessages);
    
    // Update history
    const convId = currentConversationId;
    setHistoryConversations(prev => prev.map(conv => 
      conv.id === convId 
        ? { ...conv, messages: newMessages, lastMessage: userMsg.content, timestamp: Date.now() }
        : conv
    ));
    
    await generateResponse(userMsg.content, convId);
  };

  const generateResponse = async (userContent: string, convId: string, updatedMessages?: Message[], hasFiles?: boolean) => {
    setIsGenerating(true);
    
    const isMarketingConfig = 
      userContent.includes('新增营销案') || 
      userContent.includes('新增营销活动') || 
      userContent.includes('新建营销案') || 
      userContent.includes('新建营销活动') ||
      userContent.includes('营销案推荐');

    const isQueryMessage = !isMarketingConfig && (
      userContent.includes('详单') ||
      userContent.includes('话单') ||
      userContent.includes('账单') ||
      userContent.includes('360') ||
      userContent.includes('黑名单') ||
      userContent.includes('黑信息') ||
      userContent.includes('信息查询') ||
      userContent.includes('客户信息') ||
      userContent.includes('用户信息') ||
      userContent.includes('用户编号') ||
      userContent.includes('客户编号') ||
      userContent.includes('登录账号') ||
      userContent.includes('登录名称') ||
      userContent.includes('用户视图') ||
      userContent.includes('客户视图') ||
      userContent.includes('亚信') ||
      userContent.includes('BOSS') ||
      userContent.includes('商品') ||
      userContent.includes('订单')
    );

    const isCouponModify = !isQueryMessage && (
      userContent.includes('客户会类型') || 
      userContent.includes('客户类型') || 
      userContent.includes('订购类型') || 
      userContent.includes('消费类型') ||
      userContent.includes('类型改成')
    );

    const isSchemeConfig = !isQueryMessage && (
      userContent.includes('【方案名称】') || 
      userContent.includes('【优惠券数量】') || 
      userContent.includes('【决策依据】') ||
      userContent.includes('方案名称')
    );

    const isIssuingConfig = !isQueryMessage && (
      userContent.includes('发券') || 
      userContent.includes('发券策略') || 
      userContent.includes('客户群ID') || 
      userContent.includes('客户ID') ||
      userContent.includes('客户名称')
    );

    const isCouponSchemeModify = !isQueryMessage && (
      userContent.includes('数量改成') || 
      userContent.includes('客户群改成') || 
      (userContent.includes('优惠券数量') && userContent.includes('改成')) || 
      (userContent.includes('目标客户群') && userContent.includes('改成'))
    );

    const isCouponConfig = !isQueryMessage && 
      !isCouponModify && 
      !isSchemeConfig && 
      !isIssuingConfig && 
      !isCouponSchemeModify && 
      !userContent.includes('af3c0bb2') && 
      !userContent.includes('资源标识') && 
      !userContent.includes('导入') && (
        userContent.includes('新增优惠券') || 
        userContent.includes('优惠券配置') || 
        userContent.includes('配置优惠') || 
        userContent.includes('优惠额度') ||
        userContent.includes('新建优惠券')
      );

    // Skip thinking time for specific keywords like '研发' or '信息查询' or '新增营销案'
    const skipThinking = userContent.includes('信息查询') || userContent.includes('客户信息') || userContent.includes('优惠券配置介绍') || userContent.includes('开放云') || userContent.includes('合营云') || userContent.includes('黑名单') || userContent.includes('登录名称') || userContent.includes('用户信息') || userContent.includes('360') || userContent.includes('360视图') || userContent.includes('用户360') || userContent.includes('主机类产品') || userContent.includes('智算型云主机配置') || userContent.includes('加一个') || hasFiles || userContent.includes('af3c0bb2') || userContent.includes('资源标识') || isCouponModify || isSchemeConfig || isIssuingConfig || isCouponSchemeModify || isMarketingConfig || isCouponConfig;
    
    if (!skipThinking) {
      setIsTyping(true);
      // Thinking time
      await new Promise(resolve => setTimeout(resolve, THINKING_TIME));
    }
    
    // Multi-turn and specific logic for customer information
    const hasAsiainfo = userContent.includes('亚信') || userContent.includes('BOSS客户视图');
    const phoneRegex = /\d*8888\b/;
    const hasTargetPhone = phoneRegex.test(userContent) || userContent.includes('用户360视图') || userContent.includes('用户360') || userContent.includes('360视图') || userContent.includes('360') || userContent.includes('用户信息');
    const isQueryingBill = userContent.includes('账单查询') || userContent.includes('查下【亚信科技】【近三个月】的账单');
    
    let aiMsg: Message | null = null;

    if (isMarketingConfig) {
      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `检测到新增营销案配置需求，在进行后续操作前，请先核对并确认廉洁风险：`,
        type: 'risk-confirm',
        timestamp: Date.now(),
        isComplete: true,
        data: {
          isConfirmed: false,
          riskType: 'marketing'
        }
      };
    } else if (isCouponConfig) {
      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `检测到新增优惠券配置需求，在进行后续操作前，请先核对并确认廉洁风险：`,
        type: 'risk-confirm',
        timestamp: Date.now(),
        isComplete: true,
        data: {
          isConfirmed: false,
          riskType: 'coupon'
        }
      };
    } else if (isSchemeConfig) {
      // Find previous coupon config card
      const msgsToSearch = updatedMessages || messages;
      const lastCouponMsg = [...msgsToSearch].reverse().find(m => m.type === 'coupon-config-card');
      
      const baseDetails = lastCouponMsg?.data?.details ? { ...lastCouponMsg.data.details } : {
        name: '容量型云硬盘-云创版 9折优惠券',
        category: '大云优惠券',
        effectiveMode: '绝对时间',
        type: '折扣券',
        effectiveDate: '2026-05-27 15:12:49',
        expiryDate: '2026-06-27 15:12:49',
        specification: '90%',
        cumulativeMode: '按周期累计',
        totalPrice: '200',
        customerType: '全体客户',
        subscriptionTypes: '通用, 续订',
        feeTypes: '包月',
        project: '通用项目',
        quantity: '1000',
        hasAttachedFiles: false,
        hasBoundResources: false,
        boundResources: []
      };

      let sName = '618主机折扣活动';
      let cQty = '1000';
      let dBasis = '业务说明书';

      // Parse fields
      const planNameMatch1 = userContent.match(/【?方案名称】?\s*[:：]?\s*([^\n【】]*)/);
      if (planNameMatch1 && planNameMatch1[1].trim()) {
        sName = planNameMatch1[1].trim();
      }
      
      const qtyMatch1 = userContent.match(/【?优惠券数量】?\s*[:：]?\s*([^\n【】]*)/);
      if (qtyMatch1 && qtyMatch1[1].trim()) {
        cQty = qtyMatch1[1].trim();
      }
      
      const basisMatch1 = userContent.match(/【?决策依据】?\s*[:：]?\s*([^\n【】]*)/);
      if (basisMatch1 && basisMatch1[1].trim()) {
        dBasis = basisMatch1[1].trim();
      }

      // If user literally submitted the exact brackets without values like "【方案名称】【优惠券数量】【决策依据】"
      if (sName === '' || sName === '方案名称') sName = '618主机折扣活动';
      if (cQty === '' || cQty === '优惠券数量') cQty = '1000';
      if (dBasis === '' || dBasis === '决策依据') dBasis = '业务说明书';

      const updatedSchemeInfo = {
        schemeName: sName,
        belongingActivity: '请选择',
        startTime: '2026/05/12 00:00:00',
        endTime: '2026/05/12 23:59:59',
        province: '中国移动云能力中心',
        city: '--请选择--',
        designatedIssuer: '请填写',
        description: '请填写',
        decisionBasis: dBasis,
        targetCustomer: '选择客户',
        marketingPosition: '请选择',
        marketingLanguage: '请选择',
        reminderTemplate: '请选择',
        usageCount: '1',
        receiveCount: '1',
        totalQuantityEnabled: true,
        couponQuantity: cQty,
        authStartTime: '',
        authEndTime: '',
        limits: []
      };

      const newDetails = {
        ...baseDetails,
        project: sName,
        quantity: cQty,
        hasSchemeInfo: true,
        schemeInfo: updatedSchemeInfo
      };

      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `好的，已基于您输入的内容，为您在确认卡片上添加新了优惠券方案信息：\n- **方案名称**：${sName}\n- **优惠券数量**：${cQty}\n- **决策依据**：${dBasis}\n\n您可滑动下方组件，在【优惠券方案信息】区块中查看完整效果。`,
        type: 'coupon-config-card',
        data: {
          id: lastCouponMsg?.data?.id || 'coupon-disk-config',
          title: lastCouponMsg?.data?.title || '容量型云硬盘-云创版 优惠券配置',
          description: lastCouponMsg?.data?.description || '容量型云硬盘-云创版',
          tag: lastCouponMsg?.data?.tag || '优惠券',
          details: newDetails
        },
        timestamp: Date.now(),
        isComplete: true
      };
    } else if (isCouponSchemeModify) {
      // Find previous coupon config card
      const msgsToSearch = updatedMessages || messages;
      const lastCouponMsg = [...msgsToSearch].reverse().find(m => m.type === 'coupon-config-card');
      
      const baseDetails = lastCouponMsg?.data?.details ? { ...lastCouponMsg.data.details } : {
        name: '容量型云硬盘-云创版 9折优惠券',
        category: '大云优惠券',
        effectiveMode: '绝对时间',
        type: '折扣券',
        effectiveDate: '2026-05-27 15:12:49',
        expiryDate: '2026-06-27 15:12:49',
        specification: '90%',
        cumulativeMode: '按周期累计',
        totalPrice: '200',
        customerType: '全体客户',
        subscriptionTypes: '通用, 续订',
        feeTypes: '包月',
        project: '通用项目',
        quantity: '1000',
        hasAttachedFiles: false,
        hasBoundResources: false,
        boundResources: []
      };

      let newQty = baseDetails.schemeInfo?.couponQuantity || '1000';
      const qtyMatch = userContent.match(/(?:优惠券)?数量(?:改成|修改为|设置为|为)[:：]?\s*([0-9]+)/);
      if (qtyMatch && qtyMatch[1]) {
        newQty = qtyMatch[1];
      } else if (userContent.includes('2000')) {
        newQty = '2000';
      }
      
      let newCust = baseDetails.schemeInfo?.targetCustomer || '选择客户';
      const custMatch = userContent.match(/(?:目标)?客户群(?:改成|修改为|设置为|为)[:：]?\s*([^\s，。；;,\d]+)/);
      if (custMatch && custMatch[1]) {
        newCust = custMatch[1];
      } else if (userContent.includes('互联网客户')) {
        newCust = '互联网客户';
      }

      const updatedSchemeInfo = baseDetails.schemeInfo ? { ...baseDetails.schemeInfo } : {
        schemeName: '618主机折扣活动',
        belongingActivity: '请选择',
        startTime: '2026/05/12 00:00:00',
        endTime: '2026/05/12 23:59:59',
        province: '中国移动云能力中心',
        city: '--请选择--',
        designatedIssuer: '请填写',
        description: '请填写',
        decisionBasis: '业务说明书',
        targetCustomer: '选择客户',
        marketingPosition: '请选择',
        marketingLanguage: '请选择',
        reminderTemplate: '请选择',
        usageCount: '1',
        receiveCount: '1',
        totalQuantityEnabled: true,
        couponQuantity: '1000',
        authStartTime: '',
        authEndTime: '',
        limits: []
      };

      updatedSchemeInfo.couponQuantity = newQty;
      updatedSchemeInfo.targetCustomer = newCust;

      const newDetails = {
        ...baseDetails,
        quantity: newQty,
        hasSchemeInfo: true,
        schemeInfo: updatedSchemeInfo
      };

      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `好的，已基于您的指令修改了优惠券确认信息中对应的方案配置参数：\n- **优惠券数量**：已成功设为 **\`${newQty}\`** 张\n- **目标客户群**：已成功变更为 **\`${newCust}\`**\n\n您可以滑动下方卡片查看修改后的【优惠券方案信息】区块。`,
        type: 'coupon-config-card',
        data: {
          id: lastCouponMsg?.data?.id || 'coupon-disk-config',
          title: lastCouponMsg?.data?.title || '容量型云硬盘-云创版 优惠券配置',
          description: lastCouponMsg?.data?.description || '容量型云硬盘-云创版',
          tag: lastCouponMsg?.data?.tag || '优惠券',
          details: newDetails
        },
        timestamp: Date.now(),
        isComplete: true
      };
    } else if (isIssuingConfig) {
      // Find previous coupon config card
      const msgsToSearch = updatedMessages || messages;
      const lastCouponMsg = [...msgsToSearch].reverse().find(m => m.type === 'coupon-config-card');
      
      const baseDetails = lastCouponMsg?.data?.details ? { ...lastCouponMsg.data.details } : {
        name: '容量型云硬盘-云创版 9折优惠券',
        category: '大云优惠券',
        effectiveMode: '绝对时间',
        type: '折扣券',
        effectiveDate: '2026-05-27 15:12:49',
        expiryDate: '2026-06-27 15:12:49',
        specification: '90%',
        cumulativeMode: '按周期累计',
        totalPrice: '200',
        customerType: '全体客户',
        subscriptionTypes: '通用, 续订',
        feeTypes: '包月',
        project: '通用项目',
        quantity: '1000',
        hasAttachedFiles: false,
        hasBoundResources: false,
        boundResources: []
      };

      let targetId = '';
      const idMatch = userContent.match(/给\s*([a-zA-Z0-9-_\u4e00-\u9fa5]+)\s*发券/);
      if (idMatch && idMatch[1]) {
        const idStr = idMatch[1].trim();
        if (idStr !== '客户ID/客户名称/客户群ID' && !idStr.includes('客户ID')) {
          targetId = idStr;
        }
      }

      const nextUsers = baseDetails.issuedUsers 
        ? [...baseDetails.issuedUsers]
        : [
            {
              id: 'CIDC-U-ad03210b3f62446a95854520e9a691d9',
              name: 'csy_xxxtb_ywnlz_zhangsan_ext_107',
              nickname: 'csy_xxxtb_ywnlz_zhangsan_ext_107',
              email: '173****4521@163.com',
              phone: '173****4521'
            }
          ];

      const nextGroups = baseDetails.issuedGroups
        ? [...baseDetails.issuedGroups]
        : [
            {
              id: 'GRP-20260527-00921',
              name: '高活跃高价值主机用户群',
              desc: '最近30天订购过主机产品的全体高价值企业客户',
              count: '1,420'
            }
          ];

      let qType = baseDetails.queryType || 'user';
      let addedMsg = '';

      if (targetId) {
        if (targetId.startsWith('CIDC-')) {
          const exists = nextUsers.some((u: any) => u.id === targetId);
          if (!exists) {
            nextUsers.push({
              id: targetId,
              name: 'csy_xxxtb_ywnlz_user_new',
              nickname: 'csy_xxxtb_ywnlz_user_new',
              email: '138****6688@163.com',
              phone: '138****6688'
            });
            qType = 'user';
            addedMsg = `并且在发券策略的用户信息列表中成功追加了对应记录（ID: ${targetId}）`;
          } else {
            addedMsg = `，该用户记录（ID: ${targetId}）已在列表中`;
          }
        } else if (targetId.includes('群') || targetId.startsWith('GRP-')) {
          const exists = nextGroups.some((g: any) => g.id === targetId || g.name === targetId);
          if (!exists) {
            nextGroups.push({
              id: targetId.startsWith('GRP-') ? targetId : `GRP-20260528-${Math.floor(Math.random() * 9000) + 1000}`,
              name: targetId.startsWith('GRP-') ? '自定义追加用户群' : targetId,
              desc: '用户通过自然语言指令发起添加的发券目标客户群',
              count: '250'
            });
            qType = 'group';
            addedMsg = `并且成功在客户群信息列表中追加了 "${targetId}" 群组记录`;
          } else {
            addedMsg = `，该群组 "${targetId}" 已在列表中`;
          }
        } else {
          const exists = nextUsers.some((u: any) => u.id === targetId || u.name === targetId);
          if (!exists) {
            nextUsers.push({
              id: `CIDC-U-${Math.random().toString(16).substring(2, 10)}`,
              name: targetId,
              nickname: targetId,
              email: '189****5566@139.com',
              phone: '189****5566'
            });
            qType = 'user';
            addedMsg = `并且在用户信息列表中成功添加了用户 "${targetId}"`;
          } else {
            addedMsg = `，该用户记录 "${targetId}" 已在列表中`;
          }
        }
      }

      const newDetails = {
        ...baseDetails,
        hasIssuingStrategy: true,
        issuedUsers: nextUsers,
        issuedGroups: nextGroups,
        queryType: qType,
        issueType: baseDetails.issueType || 'direct'
      };

      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: targetId 
          ? `好的，已执行给 **${targetId}** 发券的指令：\n- **发券策略信息**：已激活并展现发券策略模块；\n- **数据集变更**：${addedMsg}。\n\n请滑动下方组件到最底部【发券策略信息】核对最新列表情况。`
          : `好的，已基于您的指令在优惠券配置确认卡片上添加并启用了**发券策略信息**！\n- 您可以滑动下方组件至最底部，在新增的【发券策略信息】区块中查看结构与数据；\n- 您可以直接在该模块中进行**发放方式切换**、**用户与客户群查询切换**、以及在线**添加、删除**对应的发券目标信息。`,
        type: 'coupon-config-card',
        data: {
          id: lastCouponMsg?.data?.id || 'coupon-disk-config',
          title: lastCouponMsg?.data?.title || '容量型云硬盘-云创版 优惠券配置',
          description: lastCouponMsg?.data?.description || '容量型云硬盘-云创版',
          tag: lastCouponMsg?.data?.tag || '优惠券',
          details: newDetails
        },
        timestamp: Date.now(),
        isComplete: true
      };
    } else if (isCouponModify) {
      // Find previous coupon config card
      const msgsToSearch = updatedMessages || messages;
      const lastCouponMsg = [...msgsToSearch].reverse().find(m => m.type === 'coupon-config-card');
      
      const baseDetails = lastCouponMsg?.data?.details ? { ...lastCouponMsg.data.details } : {
        name: '容量型云硬盘-云创版 9折优惠券',
        category: '大云优惠券',
        effectiveMode: '绝对时间',
        type: '折扣券',
        effectiveDate: '2026-05-27 15:12:49',
        expiryDate: '2026-06-27 15:12:49',
        specification: '90%',
        cumulativeMode: '按周期累计',
        totalPrice: '200',
        customerType: '全体客户',
        subscriptionTypes: '通用, 续订',
        feeTypes: '包月',
        project: '通用项目',
        quantity: '1000',
        hasAttachedFiles: false,
        hasBoundResources: false,
        boundResources: []
      };

      const changedLogs: string[] = [];
      
      // 1. Customer Type change
      let targetCustomerType = baseDetails.customerType || '全体客户';
      const custMatch = userContent.match(/客户(?:会)?类型(?:改成|修改为|设置为|为)([^，。,\s]+)/);
      if (custMatch) {
        targetCustomerType = custMatch[1].trim();
        changedLogs.push(`客户类型由【${baseDetails.customerType || '全体客户'}】修改为【${targetCustomerType}】`);
      } else if (userContent.includes('互联网客户') || (userContent.includes('客户') && userContent.includes('互联网'))) {
        targetCustomerType = '互联网客户';
        changedLogs.push(`客户类型由【${baseDetails.customerType || '全体客户'}】修改为【${targetCustomerType}】`);
      }

      // 2. Subscription Type change
      let targetSubscriptionTypes = baseDetails.subscriptionTypes || '通用, 续订';
      if (userContent.includes('订购类型') && (userContent.includes('增加') || userContent.includes('加') || userContent.includes('变更'))) {
        if (userContent.includes('变更') && !targetSubscriptionTypes.includes('变更')) {
          targetSubscriptionTypes = targetSubscriptionTypes ? `${targetSubscriptionTypes}, 变更` : '变更';
          changedLogs.push(`支持订购类型增加【变更】（现为【${targetSubscriptionTypes}】）`);
        }
      } else {
        const subMatch = userContent.match(/订购类型(?:改成|修改为|设置为|为)([^，。,\s]+)/);
        if (subMatch) {
          const matchedTypes = subMatch[1].trim();
          changedLogs.push(`支持的订购类型修改为【${matchedTypes}】`);
          targetSubscriptionTypes = matchedTypes;
        }
      }

      // 3. Fee Type change
      let targetFeeTypes = baseDetails.feeTypes || '包月';
      const feeMatch = userContent.match(/消费类型(?:改成|修改为|设置为|为)([^，。,\s]+)/);
      if (feeMatch) {
        targetFeeTypes = feeMatch[1].trim();
        changedLogs.push(`支持的消费类型修改为【${targetFeeTypes}】`);
      } else if (userContent.includes('消费类型') && userContent.includes('包年')) {
        targetFeeTypes = '包年';
        changedLogs.push(`支持的消费类型修改为【包年】`);
      }

      // Merge into details
      const newDetails = {
        ...baseDetails,
        customerType: targetCustomerType,
        subscriptionTypes: targetSubscriptionTypes,
        feeTypes: targetFeeTypes
      };

      const changeDesc = changedLogs.length > 0 ? changedLogs.join('，') : '已更新优惠券配置信息';

      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `好的，我已经根据您的要求完成了修改。更新内容：${changeDesc}。您可以在下方卡片中进行确认。`,
        type: 'coupon-config-card',
        data: {
          id: lastCouponMsg?.data?.id || 'coupon-disk-config',
          title: lastCouponMsg?.data?.title || '容量型云硬盘-云创版 优惠券配置',
          description: lastCouponMsg?.data?.description || '容量型云硬盘-云创版',
          tag: lastCouponMsg?.data?.tag || '优惠券',
          details: newDetails
        },
        timestamp: Date.now(),
        isComplete: true
      };
    } else if (hasFiles) {
      const fileMatch = userContent.match(/已上传附件:\s*([^\n]+)/);
      const fileName = fileMatch ? fileMatch[1].trim() : 'resource_ids.csv';
      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `检测到您上传了资源标识文件：${fileName}。是否确认将其中的资源标识导入并绑定到当前优惠券配置的“绑定指定资源标识”中？`,
        type: 'import-confirm-prompt',
        data: {
          fileName,
          actionTaken: null
        },
        timestamp: Date.now(),
        isComplete: true
      };
    } else if (userContent.includes('af3c0bb2') || userContent.includes('资源标识') || userContent.includes('导入')) {
      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `已为您完成容量型云硬盘-云创版优惠券配置信息确认，并成功将附件中的指定资源标识绑定至列表中。`,
        type: 'coupon-config-card',
        data: {
          id: 'coupon-disk-config',
          title: '容量型云硬盘-云创版 优惠券配置',
          description: '容量型云硬盘-云创版',
          tag: '优惠券',
          details: {
            name: '容量型云硬盘-云创版 9折优惠券',
            category: '大云优惠券',
            effectiveMode: '绝对时间',
            type: '折扣券',
            effectiveDate: '2026-05-27 15:12:49',
            expiryDate: '2026-06-27 15:12:49',
            specification: '90%',
            cumulativeMode: '按周期累计',
            totalPrice: '200',
            customerType: '全体客户',
            subscriptionTypes: '通用, 续订',
            feeTypes: '包月',
            project: '通用项目',
            quantity: '1000',
            hasAttachedFiles: true,
            hasBoundResources: false, // Default to empty
            boundResources: [
              {
                resourceId: 'af3c0bb2-493c-4142-b0e9-769d83d03887',
                orderId: 'MOP-T-26052707573540',
                productName: '容量型云硬盘-云创版',
                specName: '容量型云硬盘-云创版规格',
                status: '生效',
                billingMode: '按月后付费',
                startTime: '2026-05-27 15:12:49',
                endTime: '2026-06-27 15:12:49'
              }
            ]
          }
        },
        timestamp: Date.now(),
        isComplete: true
      };
    } else if (userContent.includes('CPU改成') || userContent.includes('内存改成')) {
      const cpuMatch = userContent.match(/CPU改成(\d+)/);
      const memMatch = userContent.match(/内存改成(\d+)/);
      
      const newCpu = cpuMatch ? cpuMatch[1] : null;
      const newMem = memMatch ? memMatch[1] : null;

      // Use provided messages or current state
      const msgsToSearch = updatedMessages || messages;
      const lastSpecMsg = [...msgsToSearch].reverse().find(m => m.type === 'spec-list');
      
      let updatedSpecs = lastSpecMsg ? [...lastSpecMsg.data.specs] : [{ name: '云主机 通用型 64vCPU 256GB内存' }];
      let newName = updatedSpecs[0].name;

      if (newCpu) newName = newName.replace(/\d+vCPU/, `${newCpu}vCPU`);
      if (newMem) newName = newName.replace(/\d+GB内存/, `${newMem}GB内存`);
      
      // Final check to ensure format
      if (!newName.includes('vCPU') || !newName.includes('GB内存')) {
         const currentCpuMatch = updatedSpecs[0].name.match(/(\d+)vCPU/);
         const currentMemMatch = updatedSpecs[0].name.match(/(\d+)GB内存/);
         const fallbackCpu = currentCpuMatch ? currentCpuMatch[1] : '64';
         const fallbackMem = currentMemMatch ? currentMemMatch[1] : '256';
         
         newName = `云主机 通用型 ${newCpu || fallbackCpu}vCPU ${newMem || fallbackMem}GB内存`;
      }

      updatedSpecs[0] = { ...updatedSpecs[0], name: newName };

      let descParts = [];
      if (newCpu) descParts.push(`CPU已修改为 ${newCpu}核`);
      if (newMem) descParts.push(`内存已修改为 ${newMem}G`);

      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `好的，我已经为您修改了规格。${descParts.join('，')}。`,
        timestamp: Date.now(),
      };
    } else if (userContent.match(/加一个(.*)规格/)) {
      const addSpecMatch = userContent.match(/加一个(.*)规格/);
      const rawSpecName = addSpecMatch ? addSpecMatch[1] : '';
      
      const msgsToSearch = updatedMessages || messages;
      const lastSpecMsg = [...msgsToSearch].reverse().find(m => m.type === 'spec-list');
      
      if (lastSpecMsg) {
        // Format the spec name: "32核CPU256G内存" -> "云主机 智算型 32vCPU 256GB内存"
        let formattedSpecName = rawSpecName;
        const specPattern = /(\d+)核CPU(\d+)G内存/;
        const match = rawSpecName.match(specPattern);
        
        if (match) {
          const cpu = match[1];
          const mem = match[2];
          // Use the title from the last message to determine product type if possible
          let productType = lastSpecMsg.data.title || '智算型';
          // Clean up productType to avoid redundancy (e.g., "智算型云主机" -> "智算型")
          productType = productType.replace('云主机', '').trim();
          formattedSpecName = `云主机 ${productType} ${cpu}vCPU ${mem}GB内存`;
        }

        const updatedSpecs = [...lastSpecMsg.data.specs, { name: formattedSpecName }];
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `好的，已为您在配置单中添加了规格：${formattedSpecName}`,
          type: 'spec-list',
          data: {
            ...lastSpecMsg.data,
            specs: updatedSpecs
          },
          timestamp: Date.now(),
          isComplete: true,
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `抱歉，我没有找到之前的配置单。您可以先输入“主机类产品”来生成一个。`,
          timestamp: Date.now(),
        };
      }
    } else if (userContent.includes('信息查询')) {
      aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '请选择您要查询的信息：',
        type: 'query-buttons',
        data: queryButtonsConfig,
        timestamp: Date.now(),
      };
    } else if (userContent.includes('客户信息')) {
      if (hasAsiainfo || hasTargetPhone) {
        const rule = KEYWORD_RULES.find(r => r.keyword === '客户信息');
        if (rule) {
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: rule.content,
            type: rule.responseType,
            data: rule.data,
            detailsUrl: rule.detailsUrl,
            suggestions: rule.suggestions,
            suggestionLabel: rule.suggestionLabel,
            timestamp: Date.now(),
          };
        }
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '请输入客户名称或者客户联系方式',
          suggestions: [
            { text: 'BOSS客户视图', url: '#' },
            { text: '用户360视图', url: '#' }
          ],
          suggestionLabel: '推荐操作',
          timestamp: Date.now(),
        };
      }
    } else if ((hasAsiainfo || hasTargetPhone) && !isQueryingBill) {
      // If user just enters "亚信" or phone number, also show the card for better UX
      const is360 = userContent.includes('用户360视图') || userContent.includes('用户信息') || userContent.includes('360');
      const rule = KEYWORD_RULES.find(r => r.keyword === (is360 ? '用户信息' : '客户信息'));
      if (rule) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: rule.content,
          type: rule.responseType,
          data: rule.data,
          detailsUrl: rule.detailsUrl,
          suggestions: rule.suggestions,
          suggestionLabel: rule.suggestionLabel,
          timestamp: Date.now(),
        };
      }
    }

    if (!aiMsg) {
      let matchedRule = null;
      if (userContent.includes('详单')) {
        matchedRule = KEYWORD_RULES.find(rule => rule.keyword === '详单');
      } else if (userContent.includes('话单')) {
        matchedRule = KEYWORD_RULES.find(rule => rule.keyword === '话单');
      } else if (userContent.includes('账单') || userContent.includes('近三个月】的账单')) {
        matchedRule = KEYWORD_RULES.find(rule => rule.keyword === '账单');
      } else if (userContent.includes('用户360') || userContent.includes('用户信息') || userContent.includes('360视图') || userContent.includes('360') || userContent.includes('用户360视图')) {
        matchedRule = KEYWORD_RULES.find(rule => rule.keyword === '用户信息');
      } else if (userContent.includes('互联网') && userContent.includes('黑名单')) {
        matchedRule = KEYWORD_RULES.find(rule => rule.keyword === '登录名称');
      } else if (userContent.includes('集团') && userContent.includes('黑名单')) {
        matchedRule = KEYWORD_RULES.find(rule => rule.keyword === '黑名单');
      }

      if (matchedRule) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: matchedRule.content,
          type: matchedRule.responseType,
          data: matchedRule.data,
          detailsUrl: matchedRule.detailsUrl,
          suggestions: matchedRule.suggestions,
          suggestionLabel: matchedRule.suggestionLabel,
          timestamp: Date.now(),
        };
      } else {
        const fallBackMatched = KEYWORD_RULES.find(rule => userContent.includes(rule.keyword));
        if (fallBackMatched) {
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallBackMatched.content,
            type: fallBackMatched.responseType,
            data: fallBackMatched.data,
            detailsUrl: fallBackMatched.detailsUrl,
            suggestions: fallBackMatched.suggestions,
            suggestionLabel: fallBackMatched.suggestionLabel,
            timestamp: Date.now(),
          };
        } else {
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `收到您的消息："${userContent}"。${DEFAULT_RESPONSE}`,
            suggestions: DEFAULT_SUGGESTIONS,
            timestamp: Date.now(),
          };
        }
      }
    }

    if (aiMsg.type === 'card' || aiMsg.type === 'product-list' || aiMsg.type === 'query-buttons' || aiMsg.type === 'spec-list' || aiMsg.type === 'detailed-bill' || aiMsg.type === 'call-log' || aiMsg.content === INFO_QUERY_CONTENT || userContent.includes('优惠券配置介绍') || userContent.includes('产商品配置介绍')) {
      // Cards, query buttons and specific info query content are shown directly after thinking
      const completeMsg = { ...aiMsg, isComplete: true };
      setMessages(prev => [...prev, completeMsg]);
      setHistoryConversations(prev => prev.map(conv => 
        conv.id === convId 
          ? { ...conv, messages: [...conv.messages, completeMsg], lastMessage: aiMsg.content, timestamp: Date.now() }
          : conv
      ));
      setIsTyping(false);
      setIsGenerating(false);
    } else {
      // Text responses are streamed
      const fullContent = aiMsg.content;
      const streamingMsg = { ...aiMsg, content: '', isComplete: false };
      
      setMessages(prev => [...prev, streamingMsg]);
      setIsTyping(false); // Stop showing thinking bubble once typing starts

      let currentText = '';
      const contentArray = Array.from(fullContent);
      
      for (let i = 0; i < contentArray.length; i++) {
        await new Promise(resolve => setTimeout(resolve, TYPING_SPEED));
        currentText += contentArray[i];
        
        setMessages(prev => prev.map(m => 
          m.id === streamingMsg.id ? { ...m, content: currentText } : m
        ));
      }

      // Final update to message state to mark as complete
      setMessages(prev => prev.map(m => 
        m.id === streamingMsg.id ? { ...m, isComplete: true } : m
      ));

      // Final update to history
      setHistoryConversations(prev => prev.map(conv => 
        conv.id === convId 
          ? { ...conv, messages: conv.messages.map(m => m.id === streamingMsg.id ? { ...m, content: fullContent, isComplete: true } : m), lastMessage: fullContent, timestamp: Date.now() }
          : conv
      ));
      setIsGenerating(false);
    }
  };

  const [lastSpecListMsgId, setLastSpecListMsgId] = useState<string | null>(null);

  const handleDeleteSpec = (msgId: string, specIndex: number) => {
    setMessages(prev => {
      let updatedMessages = prev.map(msg => {
        if (msg.id === msgId && msg.type === 'spec-list') {
          const updatedSpecs = [...msg.data.specs];
          updatedSpecs.splice(specIndex, 1);
          return {
            ...msg,
            data: { ...msg.data, specs: updatedSpecs }
          };
        }
        return msg;
      });

      const targetMsg = updatedMessages.find(m => m.id === msgId);
      if (targetMsg && targetMsg.type === 'spec-list' && targetMsg.data.specs.length === 0) {
        updatedMessages = updatedMessages.filter(m => m.id !== msgId);
        if (lastSpecListMsgId === msgId) {
          setLastSpecListMsgId(null);
        }
      }

      // Update history
      if (currentConversationId) {
        setHistoryConversations(hPrev => hPrev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: updatedMessages }
            : conv
        ));
      }

      return updatedMessages;
    });
  };

  const handleSpecUpdate = (newName: string) => {
    if (!editingSpecInfo) return;

    setMessages(prev => {
      const updatedMessages = prev.map(msg => {
        if (msg.id === editingSpecInfo.msgId && msg.type === 'spec-list') {
          const updatedSpecs = [...msg.data.specs];
          updatedSpecs[editingSpecInfo.index] = { ...updatedSpecs[editingSpecInfo.index], name: newName };
          return {
            ...msg,
            data: { ...msg.data, specs: updatedSpecs }
          };
        }
        return msg;
      });

      if (currentConversationId) {
        setTimeout(() => {
          setHistoryConversations(hPrev => hPrev.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, messages: updatedMessages }
              : conv
          ));
        }, 0);
      }

      return updatedMessages;
    });
    
    setEditingSpecInfo(null);
    setIsSpecEditMode(false);
  };

  const handleSpecSave = (specName: string, targetMsgId?: string) => {
    let newMsgId = '';
    const productTitle = selectedProductForDetail?.title || '云主机';
    const productId = selectedProductForDetail?.id || '7503700218';

    setMessages(prev => {
      const msgIdToUpdate = targetMsgId;
      const existingMsgIndex = msgIdToUpdate ? prev.findIndex(m => m.id === msgIdToUpdate) : -1;
      
      if (existingMsgIndex !== -1) {
        const updatedMessages = [...prev];
        const existingMsg = { ...updatedMessages[existingMsgIndex] };
        const updatedSpecs = [...(existingMsg.data.specs || []), { name: specName }];
        
        updatedMessages[existingMsgIndex] = {
          ...existingMsg,
          data: { ...existingMsg.data, specs: updatedSpecs }
        };

        newMsgId = updatedMessages[existingMsgIndex].id;
        return updatedMessages;
      } else {
        const newId = Date.now().toString();
        const newMsg: Message = {
          id: newId,
          role: 'assistant',
          content: `已为您生成 ${productTitle} 的配置方案`,
          type: 'spec-list',
          data: {
            title: productTitle,
            id: productId,
            specs: [
              { name: specName }
            ]
          },
          timestamp: Date.now(),
          isComplete: true
        };

        const updatedMessages = [...prev, newMsg];
        newMsgId = newId;
        return updatedMessages;
      }
    });

    if (newMsgId) {
      setLastSpecListMsgId(newMsgId);
      if (currentConversationId) {
        setMessages(currentMessages => {
          setHistoryConversations(hPrev => hPrev.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, messages: currentMessages, timestamp: Date.now() }
              : conv
          ));
          return currentMessages;
        });
      }
    }
  };

  const handleSend = async (textOverride?: string | any) => {
    if (isGenerating) return;
    const contentToSend = typeof textOverride === 'string' ? textOverride : input;
    const fileListToUse = typeof textOverride === 'string' ? [] : [...uploadedFiles];
    
    if ((!contentToSend || typeof contentToSend !== 'string' || !contentToSend.trim()) && fileListToUse.length === 0) return;

    const rawSendText = contentToSend || '导入指定资源标识文件';
    const sendText = resolvePlaceholders(rawSendText);
    const finalContent = fileListToUse.length > 0 
      ? `${sendText}\n📂 **已上传附件:** ${fileListToUse.map(f => f.name).join(', ')}`
      : sendText;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalContent,
      timestamp: Date.now(),
    };

    const currentInput = sendText;
    if (typeof textOverride !== 'string') setInput('');
    setUploadedFiles([]);
    setFocusedFunction(null);

    let convId = currentConversationId;
    let updatedMessages = [...messages, userMsg];

    if (!convId) {
      // Create new conversation
      convId = Date.now().toString();
      const newConv: Conversation = {
        id: convId,
        title: currentInput, // Use first message as title
        lastMessage: currentInput,
        timestamp: Date.now(),
        messages: [userMsg],
      };
      setHistoryConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(convId);
      setMessages([userMsg]);
      updatedMessages = [userMsg];
    } else {
      // Update existing conversation
      setMessages(updatedMessages);
      setHistoryConversations(prev => prev.map(conv => 
        conv.id === convId 
          ? { ...conv, messages: updatedMessages, lastMessage: currentInput, timestamp: Date.now() }
          : conv
      ));
    }

    // Check for keywords "CPU改成" or "内存改成"
    const cpuMatch = currentInput.match(/CPU改成(\d+)/);
    const memMatch = currentInput.match(/内存改成(\d+)/);

    if (cpuMatch || memMatch) {
      const newCpu = cpuMatch ? cpuMatch[1] : null;
      const newMem = memMatch ? memMatch[1] : null;
      
      // Find the last spec-list message (excluding the user message we just added)
      const lastSpecMsgIndex = [...updatedMessages].slice(0, -1).reverse().findIndex(m => m.type === 'spec-list');
      
      if (lastSpecMsgIndex !== -1) {
        const actualIndex = updatedMessages.length - 2 - lastSpecMsgIndex;
        const msg = { ...updatedMessages[actualIndex] };
        
        const currentSpec = msg.data.specs[0];
        let newName = currentSpec.name;
        
        if (newCpu) {
          newName = newName.replace(/\d+vCPU/, `${newCpu}vCPU`);
        }
        if (newMem) {
          newName = newName.replace(/\d+GB内存/, `${newMem}GB内存`);
        }
        
        // Final check to ensure format
        if (!newName.includes('vCPU') || !newName.includes('GB内存')) {
           const currentCpuMatch = currentSpec.name.match(/(\d+)vCPU/);
           const currentMemMatch = currentSpec.name.match(/(\d+)GB内存/);
           const fallbackCpu = currentCpuMatch ? currentCpuMatch[1] : '64';
           const fallbackMem = currentMemMatch ? currentMemMatch[1] : '256';
           
           newName = `云主机 通用型 ${newCpu || fallbackCpu}vCPU ${newMem || fallbackMem}GB内存`;
        }

        const updatedSpecs = [...msg.data.specs];
        updatedSpecs[0] = { ...updatedSpecs[0], name: newName };
        
        updatedMessages[actualIndex] = {
          ...msg,
          data: { ...msg.data, specs: updatedSpecs }
        };
        
        setMessages(updatedMessages);
        
        // Update history as well
        if (convId) {
          setHistoryConversations(hPrev => hPrev.map(conv => 
            conv.id === convId 
              ? { ...conv, messages: updatedMessages }
              : conv
          ));
        }
      }
    }

    await generateResponse(currentInput, convId, updatedMessages, fileListToUse.length > 0);
  };

  const handleEditSubmit = async (id: string) => {
    if (isGenerating || !editValue.trim() || !currentConversationId) {
      setEditingMessageId(null);
      return;
    }

    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex === -1) return;

    // Keep messages up to the edited one, update the edited one
    const newMessages = messages.slice(0, msgIndex + 1);
    newMessages[msgIndex] = {
      ...newMessages[msgIndex],
      content: editValue,
      timestamp: Date.now()
    };

    setMessages(newMessages);
    const convId = currentConversationId;
    setHistoryConversations(prev => prev.map(conv => 
      conv.id === convId 
        ? { 
            ...conv, 
            messages: newMessages, 
            lastMessage: editValue, 
            timestamp: Date.now(),
            title: msgIndex === 0 ? editValue : conv.title
          }
        : conv
    ));
    setEditingMessageId(null);
    await generateResponse(editValue, convId);
  };

  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditValue(msg.content);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.actionType === 'link' && action.actionValue) {
      window.open(action.actionValue, '_blank');
    } else if (action.actionType === 'input' && action.actionValue) {
      handleSend(action.actionValue);
    } else if (action.actionType === 'direct-response' && action.actionValue) {
      handleDirectResponse(action.actionValue);
    }
  };

  const handleDirectResponse = (keyword: string) => {
    const matchedRule = KEYWORD_RULES.find(rule => keyword.includes(rule.keyword));
    if (!matchedRule) return;

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: matchedRule.content,
      type: 'direct-response',
      data: matchedRule.data,
      detailsUrl: matchedRule.detailsUrl,
      suggestions: matchedRule.suggestions,
      suggestionLabel: matchedRule.suggestionLabel,
      timestamp: Date.now(),
      isComplete: true,
    };

    let convId = currentConversationId;
    if (!convId) {
      convId = Date.now().toString();
      const newConv: Conversation = {
        id: convId,
        title: keyword,
        lastMessage: aiMsg.content,
        timestamp: Date.now(),
        messages: [aiMsg]
      };
      setHistoryConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(convId);
      setMessages([aiMsg]);
    } else {
      setMessages(prev => [...prev, aiMsg]);
      setHistoryConversations(prev => prev.map(conv => 
        conv.id === convId 
          ? { ...conv, messages: [...conv.messages, aiMsg], lastMessage: aiMsg.content, timestamp: Date.now() }
          : conv
      ));
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Leftmost Icon Sidebar */}
      <aside className="w-16 flex flex-col items-center py-6 bg-sidebar-bg border-r border-blue-100 shrink-0">
        <div className="mb-8">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-blue-200">
            <img src={ASSISTANT_AVATAR} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
        
        <nav className="flex flex-col gap-6 flex-1">
          <NavIcon icon={<MessageSquare size={22} />} active={activeNav === 'chat'} onClick={() => setActiveNav('chat')} label="聊天" />
          <NavIcon icon={<Mail size={22} />} active={activeNav === 'msg'} onClick={() => setActiveNav('msg')} label="消息" />
          <NavIcon icon={<StickyNote size={22} />} active={activeNav === 'memo'} onClick={() => setActiveNav('memo')} label="备忘" />
          <NavIcon 
            icon={<History size={22} />} 
            active={activeNav === 'history' || isSidebarOpen} 
            onClick={() => {
              const nextState = !isSidebarOpen;
              setIsSidebarOpen(nextState);
              if (nextState) {
                setActiveNav('history');
              } else {
                setActiveNav('chat');
              }
            }} 
            label="历史" 
          />
        </nav>

        <div className="flex flex-col gap-6 mt-auto">
          <NavIcon 
            icon={<Briefcase size={22} />} 
            label="工单" 
            active={isWorkOrderModalOpen}
            onClick={() => setIsWorkOrderModalOpen(true)}
          />
          <NavIcon 
            icon={<Settings size={22} />} 
            label="设置" 
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </aside>

      {/* Middle History Panel */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-slate-100 flex flex-col shrink-0"
          >
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">历史</h2>
              <button 
                onClick={() => {
                  setIsSidebarOpen(false);
                  setActiveNav('chat');
                }} 
                className="p-1 hover:bg-slate-100 rounded-md text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <div className="px-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索记录" 
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-slate-50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button 
                  onClick={() => setHistorySearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                >
                  {historySearchQuery ? <X size={16} /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <div className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">我的对话</div>
              <div className="space-y-1">
                {filteredHistory.map(conv => (
                  <div 
                    key={conv.id} 
                    onClick={() => {
                      if (editingHistoryId === conv.id) return;
                      setCurrentConversationId(conv.id);
                      setMessages(conv.messages);
                      const lastSpecList = [...conv.messages].reverse().find(m => m.type === 'spec-list');
                      if (lastSpecList) setLastSpecListMsgId(lastSpecList.id);
                      else setLastSpecListMsgId(null);
                    }}
                    className={`p-3 rounded-xl cursor-pointer group transition-all flex items-center justify-between gap-2 ${currentConversationId === conv.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}
                  >
                    {editingHistoryId === conv.id ? (
                      <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingHistoryTitle}
                          onChange={(e) => setEditingHistoryTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleHistoryEditSubmit(conv.id);
                            if (e.key === 'Escape') setEditingHistoryId(null);
                          }}
                          autoFocus
                          className="flex-1 bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none"
                        />
                        <button onClick={() => handleHistoryEditSubmit(conv.id)} className="text-blue-500">
                          <Send size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className={`text-sm truncate flex-1 ${currentConversationId === conv.id ? 'text-blue-600 font-bold' : 'text-slate-700 font-medium'}`}>
                          {conv.title}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePinHistory(conv.id);
                            }}
                            className={`p-1 transition-colors ${conv.isPinned ? 'text-blue-500' : 'hover:text-blue-500 text-slate-400'}`}
                          >
                            <Pin size={14} className={conv.isPinned ? 'fill-blue-500' : ''} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingHistoryId(conv.id);
                              setEditingHistoryTitle(conv.title);
                            }}
                            className="p-1 hover:text-blue-500 text-slate-400 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryConversations(prev => prev.filter(c => c.id !== conv.id));
                              if (currentConversationId === conv.id) {
                                setCurrentConversationId(null);
                                setMessages([]);
                              }
                            }}
                            className="p-1 hover:text-red-500 text-slate-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main 
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.types.includes('Files')) {
            setIsDraggingFile(true);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
            setIsDraggingFile(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingFile(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
          }
        }}
        className="flex-1 flex flex-col bg-bg-main relative"
      >
        {isDraggingFile && (
          <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-[2px] border-4 border-dashed border-blue-500 rounded-2xl flex flex-col items-center justify-center p-8 transition-all animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center gap-3 border border-slate-100 max-w-xs text-center transform scale-100 animate-in zoom-in-95 duration-250">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 animate-bounce">
                <Upload size={32} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">拖入此区域直接上传</h3>
              <p className="text-[11px] text-slate-400">支持拖拽 CSV, TSV, TXT, Excel 等格式的资源标识文件进行智能添加和信息确认绑定</p>
            </div>
          </div>
        )}
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-white/80 px-3 py-1 rounded-full text-sm font-mono text-slate-600 border border-white/50 shadow-sm">
              吕*****5680
            </div>
          </div>
          <button 
            onClick={() => {
              setCurrentConversationId(null);
              setMessages([]);
              setInput('');
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-medium border border-blue-100 shadow-sm hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} />
            新建对话
          </button>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Section */}
          <div className="max-w-4xl mx-auto text-center mb-4">
            <div className="inline-block p-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 mb-4">
              <p className="text-sm text-slate-600">作为您的智能伙伴，我既能帮您查资料、办业务，又能陪您聊天、学知识。</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map(action => {
                const IconComponent = {
                  Package: Package,
                  Ticket: Ticket,
                  ShieldCheck: ShieldCheck,
                  UserSearch: UserSearch
                }[action.icon] || Package;

                return (
                  <button 
                    key={action.id} 
                    onClick={() => handleQuickAction(action)}
                    disabled={isGenerating}
                    className={`flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-50 transition-all text-left group ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-blue-100'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-inner`}>
                      <IconComponent size={20} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{action.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="max-w-4xl mx-auto space-y-1.5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm overflow-hidden mt-0.5">
                    <img src={ASSISTANT_AVATAR} alt="AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                
                <div className="max-w-[85%] flex flex-col gap-1 relative">
                  {msg.type === 'query-buttons' ? (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 min-w-[320px] relative">
                      <h3 className="text-sm font-medium text-slate-500 mb-4">{msg.content}</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {msg.data.map((btn: { label: string, value: string }, i: number) => (
                          <button
                            key={i}
                            onClick={() => setInput(btn.value)}
                            className="px-1 py-1 bg-blue-50 border border-blue-200 rounded-lg text-[10px] text-blue-600 hover:bg-blue-100 transition-colors shadow-sm font-medium text-center leading-tight h-10 flex items-center justify-center"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : msg.type === 'card' ? (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 w-[320px] relative">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">{msg.content}</h3>
                      <div className="space-y-4 mb-4">
                        {Array.isArray(msg.data) && msg.data[0]?.billingPeriod ? (
                          msg.data.map((bill: any, idx: number) => (
                            <div key={idx} className={`space-y-3 ${idx > 0 ? 'pt-4 border-t border-slate-100' : ''}`}>
                              <div className="grid grid-cols-1 gap-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 w-24 shrink-0">账期：</span>
                                  <span className="text-slate-700 font-medium truncate">{bill.billingPeriod}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 w-24 shrink-0">客户名称：</span>
                                  <span className="text-slate-700 font-medium truncate">{bill.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 w-24 shrink-0">订购账号名称：</span>
                                  <span className="text-slate-700 font-medium truncate">{bill.accountName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 w-24 shrink-0">目录金额：</span>
                                  <span className="text-slate-700 font-medium font-mono truncate">¥{bill.catalogAmount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 w-24 shrink-0">优惠金额：</span>
                                  <span className="text-slate-700 font-medium font-mono text-emerald-600 truncate">¥{bill.discountAmount}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-50/50">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400 w-24 shrink-0 font-bold">应收金额：</span>
                                    <span className="text-blue-600 font-bold font-mono text-lg truncate">¥{bill.receivableAmount}</span>
                                  </div>
                                  <div className="group relative">
                                    <button 
                                      onClick={() => window.open(msg.detailsUrl || CARD_DETAILS_REDIRECT_URL, '_blank')}
                                      className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-all shadow-sm"
                                    >
                                      <ExternalLink size={12} />
                                    </button>
                                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                                      查看账单详情
                                      <div className="absolute top-full right-2 border-[4px] border-transparent border-t-slate-800/95" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : msg.data.billingPeriod ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">账期：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.billingPeriod}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">订购账号名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.accountName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">目录金额：</span>
                              <span className="text-slate-700 font-medium font-mono truncate">¥{msg.data.catalogAmount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">优惠金额：</span>
                              <span className="text-slate-700 font-medium font-mono text-emerald-600 truncate">¥{msg.data.discountAmount}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                              <span className="text-slate-400 w-24 shrink-0 font-bold">应收金额：</span>
                              <span className="text-blue-600 font-bold font-mono text-lg truncate">¥{msg.data.receivableAmount}</span>
                            </div>
                          </div>
                        ) : msg.data.isOpenCloud ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">产品编码：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productCode}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">产品类型：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品状态：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productStatus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品编码：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.commodityCode}</span>
                            </div>
                          </div>
                        ) : msg.data.isOrderDetails ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">订单号：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.orderId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">操作类型：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.operationType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">订单状态：</span>
                              <span className="text-rose-600 font-bold truncate">{msg.data.orderStatus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">创建时间：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.createTime}</span>
                            </div>
                          </div>
                        ) : msg.data.isDayunOrderDetails ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">订单批次号：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.batchId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">订单号：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.orderId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">操作类型：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.operationType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">订单状态：</span>
                              <span className="text-emerald-600 font-bold truncate">{msg.data.orderStatus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">创建时间：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.createTime}</span>
                            </div>
                          </div>
                        ) : msg.data.ebossProduct ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">EBOSS产品：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.ebossProduct}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品品类编码：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.categoryCode}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品状态：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productStatus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">商品编码：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.productCode}</span>
                            </div>
                          </div>
                        ) : msg.data.isBlacklist ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">集团客户名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.groupCustomerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">证件类型：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.idType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">证件编号：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.idNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户状态：</span>
                              <span className="text-rose-600 font-bold truncate">{msg.data.customerStatus}</span>
                            </div>
                          </div>
                        ) : msg.data.isInternetBlacklist ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">登录名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.loginName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户编码：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerCode}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户类型：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户状态：</span>
                              <span className="text-rose-600 font-bold truncate">{msg.data.customerStatus}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">联系人姓名：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.contactName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">手机号：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.phoneNumber}</span>
                            </div>
                          </div>
                        ) : msg.data.isUser360 ? (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">登录账号：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.loginAccount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">联系人：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.contact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">用户手机：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.userPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">所在省份：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.province}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">城市：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">状态：</span>
                              <span className="text-emerald-600 font-bold truncate">{msg.data.status}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户类型：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.customerType || msg.data.level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">状态：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户经理名称：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.managerName || msg.data.contact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">客户经理电话：</span>
                              <span className="text-slate-700 font-medium truncate">{msg.data.managerPhone || msg.data.phone || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">P码：</span>
                              <span className="text-slate-700 font-medium font-mono text-xs truncate">{msg.data.pCode || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 w-24 shrink-0">C码：</span>
                              <span className="text-slate-700 font-medium font-mono text-xs truncate">{msg.data.cCode || '-'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {!(Array.isArray(msg.data) && msg.data[0]?.billingPeriod) && (
                        <div className="flex justify-end">
                          <div className="group relative">
                            <button 
                              onClick={() => window.open(msg.detailsUrl || CARD_DETAILS_REDIRECT_URL, '_blank')}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-all shadow-sm"
                            >
                              <ExternalLink size={14} />
                            </button>
                            {/* Custom Tooltip */}
                            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
                              {msg.data.billingPeriod ? '查看账单详情' : (msg.data.ebossProduct || msg.data.isOpenCloud) ? '查看商品详情' : msg.data.isOrderDetails ? '跳转到开放云产品订单查询' : msg.data.isDayunOrderDetails ? '跳转到产品订单查询' : msg.data.isUser360 ? '跳转到用户360视图菜单' : msg.data.isBlacklist ? '跳转到集团客户黑名单菜单' : msg.data.isInternetBlacklist ? '跳转到互联网客户黑名单菜单' : '跳转到BOSS客户视图菜单'}
                              <div className="absolute top-full right-3 border-[5px] border-transparent border-t-slate-800/95" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : msg.type === 'product-list' ? (
                    <div className="flex flex-col gap-3 w-full max-w-2xl">
                      <div className="text-sm font-medium text-slate-600 mb-1">{msg.content}</div>
                      <div className="bg-slate-50/50 p-4 rounded-[28px] border border-slate-100 space-y-3">
                        {msg.data.map((item: any, i: number) => (
                          <div key={i} className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                              {item.details ? <Ticket size={24} /> : <Package size={24} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-500 text-[10px] font-bold text-white rounded-md uppercase tracking-wider">
                                  {item.tag}
                                </span>
                                {item.percentage && (
                                  <span className={`px-2 py-0.5 ${
                                    parseInt(item.percentage) > 90 
                                      ? 'bg-emerald-500' 
                                      : parseInt(item.percentage) >= 80 
                                        ? 'bg-amber-500' 
                                        : 'bg-rose-500'
                                  } text-[10px] font-bold text-white rounded-md uppercase tracking-wider`}>
                                    {item.percentage}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-slate-400 font-mono">{item.id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center min-w-0">
                                <span className="truncate">{item.title}</span>
                                {!item.details && (
                                  <div className="group relative flex items-center ml-1.5 shrink-0">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProductForDetail(item);
                                        setIsProductDetailModalOpen(true);
                                      }}
                                      className="text-slate-400 hover:text-blue-600 hover:scale-110 transition-all flex items-center justify-center p-0.5"
                                    >
                                      <Info size={16} />
                                    </button>
                                    {/* Custom Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
                                      查看详情
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
                                    </div>
                                  </div>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0 self-center">
                              <button 
                                onClick={() => {
                                  if (item.tag === '产品') {
                                    setSelectedProductForDetail(item);
                                    setIsSpecEditMode(false);
                                    setIsSpecConfigModalOpen(true);
                                  } else {
                                    // Extract info from a user message that contains configuration details
                                    const configMsg = [...messages].reverse().find(m => m.role === 'user' && m.content.includes('名称'))?.content || '';
                                    
                                    let extractedName = item.title;
                                    let extractedDiscount = item.details?.specification || '90%';
                                    let extractedQuantity = item.details?.quantity || '1000';

                                    const nameMatch = configMsg.match(/名称[：:]([^ ，, \s]+)/);
                                    const discountMatch = configMsg.match(/优惠额度[：:]([^ ，, \s]+)/);
                                    const quantityMatch = configMsg.match(/发放数量[：:]([^ ，, \s]+)/);

                                    if (nameMatch) extractedName = nameMatch[1];
                                    if (discountMatch) {
                                      const discountStr = discountMatch[1];
                                      if (discountStr.includes('折')) {
                                        const num = parseFloat(discountStr.replace('折', ''));
                                        if (!isNaN(num)) {
                                          extractedDiscount = (num * 10).toString();
                                        }
                                      } else {
                                        extractedDiscount = discountStr.replace('%', '');
                                      }
                                    }
                                    if (quantityMatch) extractedQuantity = quantityMatch[1];

                                    // Date logic
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    const month = String(now.getMonth() + 1).padStart(2, '0');
                                    const day = String(now.getDate()).padStart(2, '0');
                                    const effectiveDate = `${year}-${month}-${day} 00:00:00`;
                                    const expiryDate = `${year}-${month}-${day} 23:59:59`;

                                    const updatedItem = {
                                      ...item,
                                      title: extractedName,
                                      description: extractedName, // 适用产品描述用优惠券名称
                                      details: {
                                        ...item.details,
                                        name: extractedName,
                                        ruleDetails: extractedName,
                                        specification: extractedDiscount,
                                        quantity: extractedQuantity,
                                        effectiveDate,
                                        expiryDate,
                                        customerType: '全体客户'
                                      }
                                    };

                                    // Directly reply with a coupon config card
                                    const newMsg: Message = {
                                      id: Date.now().toString(),
                                      role: 'assistant',
                                      content: `已为您生成 ${extractedName} 的配置方案`,
                                      type: 'coupon-config-card',
                                      data: updatedItem,
                                      timestamp: Date.now(),
                                      isComplete: true
                                    };
                                    
                                    setMessages(prev => {
                                      const updated = [...prev, newMsg];
                                      if (currentConversationId) {
                                        setHistoryConversations(hPrev => hPrev.map(conv => 
                                          conv.id === currentConversationId 
                                            ? { ...conv, messages: updated, lastMessage: newMsg.content, timestamp: Date.now() }
                                            : conv
                                        ));
                                      }
                                      return updated;
                                    });
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Settings size={12} /> 立即配置
                              </button>
                              <button 
                                onClick={() => {
                                  if (item.tag !== '产品') {
                                    // Construct CouponDetail from basic item and message context if needed
                                    // or just use whatever is in item.details
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    const month = String(now.getMonth() + 1).padStart(2, '0');
                                    const day = String(now.getDate()).padStart(2, '0');
                                    const effectiveDate = `${year}-${month}-${day} 00:00:00`;
                                    const expiryDate = `${year + 3}-${month}-${day} 23:59:59`;

                                    const detail: CouponDetail = item.details || {
                                      code: item.id || '260107136712',
                                      name: item.title,
                                      effectiveDate,
                                      expiryDate,
                                      type: '组合折扣券',
                                      category: '大云优惠券',
                                      effectiveMode: '绝对时间',
                                      specification: item.percentage || '70%',
                                      totalPrice: '',
                                      customerType: '全体客户',
                                      subscriptionTypes: '通用,订购,续订,变更,绑定',
                                      feeTypes: '包月,包年,按量（含话单）,一次性费用,包年一次性',
                                      quantity: '不限',
                                      project: '',
                                      amount: '无限制',
                                      ruleDetails: '详情',
                                      applicableProducts: []
                                    };
                                    setSelectedCouponDetail(detail);
                                    setIsModalOpen(true);
                                  } else {
                                    setSelectedProductForDetail(item);
                                    setIsSpecAttributeModalOpen(true);
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <Search size={12} /> 详情
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : msg.type === 'detailed-bill' ? (
                    <div className="w-full max-w-4xl">
                      <div className="text-sm font-medium text-slate-600 mb-2">{msg.content}</div>
                      <DetailedBillCard data={msg.data} />
                    </div>
                  ) : msg.type === 'call-log' ? (
                    <div className="w-full max-w-4xl">
                      <div className="text-sm font-medium text-slate-600 mb-2">{msg.content}</div>
                      <CallLogCard data={msg.data} />
                    </div>
                  ) : msg.type === 'product-config-list' ? (
                    <ProductRecommendationGrid 
                      content={msg.content}
                      data={msg.data}
                      onConfigure={(item) => {
                        if (item.title.includes('智算型')) {
                          // Directly show the spec-list card
                          const newId = Date.now().toString();
                          const newMsg: Message = {
                            id: newId,
                            role: 'assistant',
                            content: '已为您生成智算型云主机配置单',
                            type: 'spec-list',
                            data: {
                              title: '智算型云主机',
                              id: '新增',
                              specs: [
                                { name: '云主机 智算型 32vCPU 512GB内存' },
                                { name: '云主机 智算型 64vCPU 512GB内存' }
                              ]
                            },
                            timestamp: Date.now(),
                            isComplete: true
                          };
                          
                          setMessages(prev => {
                            const updated = [...prev, newMsg];
                            if (currentConversationId) {
                              setHistoryConversations(hPrev => hPrev.map(conv => 
                                conv.id === currentConversationId 
                                  ? { ...conv, messages: updated, lastMessage: newMsg.content, timestamp: Date.now() }
                                  : conv
                              ));
                            }
                            return updated;
                          });
                        } else {
                          setSelectedProductForDetail(item);
                          setIsProductModalOpen(true);
                        }
                      }}
                      onDetail={(item) => {
                        setSelectedProductForDetail(item);
                        setIsProductDetailModalOpen(true);
                      }}
                    />
                  ) : msg.type === 'spec-list' ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-w-[420px] relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          {msg.data.id === '新增' && (
                            <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                              <span className="text-xs font-bold">产品新增</span>
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-blue-700">{msg.data.title}</h3>
                          {msg.data.id !== '新增' && (
                            <span className="text-lg font-medium text-blue-500">{msg.data.id}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedProductForDetail({ 
                              title: msg.data.title, 
                              id: msg.data.id,
                              specs: msg.data.specs 
                            });
                            setIsProductModifyModalOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <Pencil size={12} /> 修改
                        </button>
                      </div>
                      <div className="space-y-4 mb-8">
                        {msg.data.specs.map((spec: any, i: number) => (
                          <div key={i} className="flex items-center justify-between group">
                            <span className="text-base text-blue-600 font-medium truncate pr-4">{spec.name}</span>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button 
                                onClick={() => {
                                  handleSpecSave(spec.name, msg.id);
                                }}
                                className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-sm transition-colors bg-[#E6F4FF]"
                              >
                                <Copy size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedProductForDetail({ 
                                    title: spec.name,
                                    id: msg.data.id 
                                  });
                                  setIsSpecAttributeModalOpen(true);
                                }}
                                className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-sm transition-colors bg-[#E6F4FF]"
                              >
                                <Search size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedProductForDetail({ title: spec.name });
                                  setEditingSpecInfo({ msgId: msg.id, index: i });
                                  setIsSpecEditMode(true);
                                  setIsSpecConfigModalOpen(true);
                                }}
                                className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-sm transition-colors bg-[#E6F4FF]"
                              >
                                <Pencil size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSpec(msg.id, i)}
                                className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-sm transition-colors bg-[#E6F4FF]"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : msg.type === 'import-confirm-prompt' ? (
                    <div className="bg-white p-5 rounded-[22px] shadow-sm border border-slate-100 max-w-sm w-full relative flex flex-col gap-4 animate-in fade-in duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                          <Paperclip size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 mb-1">导入并绑定资源标识</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                            检测到已上传文件 <span className="font-mono font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[10px]">{msg.data?.fileName || '文件'}</span>。
                            是否确认将此文件中的资源标识导入，并绑定至【容量型云硬盘-云创版】优惠券配置中？
                          </p>
                        </div>
                      </div>

                      {msg.data?.actionTaken ? (
                        <div className="text-[11px] font-medium text-slate-400 text-right italic pt-2 border-t border-slate-50 font-sans">
                          {msg.data.actionTaken === 'confirmed' ? '✓ 已确认导入并绑定' : '✕ 已取消'}
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50 font-sans">
                          <button
                            onClick={() => handleImportCancel(msg.id)}
                            className="px-3 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 font-medium hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleImportConfirm(msg.id, msg.data?.fileName)}
                            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-md shadow-blue-100 transition-all cursor-pointer"
                          >
                            确认导入绑定
                          </button>
                        </div>
                      )}
                    </div>
                  ) : msg.type === 'risk-confirm' ? (
                    <RiskConfirmCard
                      msg={msg}
                      onConfirm={handleConfirmRisk}
                    />
                  ) : msg.type === 'marketing-recommendation' ? (
                    <MarketingRecommendationCard
                      msg={msg}
                      onConfigure={handleConfigureRecommendation}
                      onDetail={handleViewRecommendationDetail}
                    />
                  ) : msg.type === 'coupon-config-card' ? (
                    <CouponConfigConfirmCard
                      msg={msg}
                      setSelectedCouponForConfig={setSelectedCouponForConfig}
                      setEditingCouponMsgId={setEditingCouponMsgId}
                      setIsStrategyReadOnly={setIsStrategyReadOnly}
                      setIsStrategyModalOpen={setIsStrategyModalOpen}
                      CARD_DETAILS_REDIRECT_URL={CARD_DETAILS_REDIRECT_URL}
                      setInput={setInput}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {editingMessageId === msg.id ? (
                        <div className="flex flex-col gap-2 w-full min-w-[240px]">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleEditSubmit(msg.id);
                              } else if (e.key === 'Escape') {
                                setEditingMessageId(null);
                              }
                            }}
                            autoFocus
                            className="w-full p-2 rounded-xl bg-white text-slate-700 border border-blue-300 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm min-h-[60px]"
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingMessageId(null)}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-slate-600 font-medium"
                            >
                              取消
                            </button>
                            <button 
                              onClick={() => handleEditSubmit(msg.id)}
                              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-sm transition-colors"
                            >
                              保存并重新生成
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                            {msg.role === 'assistant' ? (
                              <div className="markdown-body">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : (
                              renderTextWithPlaceholders(msg.content, 'message')
                            )}
                          </div>
                          {msg.role === 'user' && (
                            <button 
                              onClick={() => startEditing(msg)}
                              disabled={isGenerating}
                              className={`p-1.5 text-slate-400 rounded-lg transition-colors shrink-0 ${isGenerating ? 'opacity-30 cursor-not-allowed' : 'hover:text-blue-500 hover:bg-white/50'}`}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {msg.role === 'assistant' && !['card', 'direct-response', 'product-list'].includes(msg.type || '') && msg.isComplete && (
                            <div className="flex items-center gap-0.5">
                              <button 
                                onClick={() => handleRegenerate(msg.id)}
                                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white/50 rounded-lg transition-colors shrink-0"
                                title="重新生成"
                                disabled={isGenerating}
                              >
                                <RotateCcw size={14} className={isGenerating ? 'opacity-50' : ''} />
                              </button>
                              <button 
                                onClick={() => handleCopy(msg.content, msg.id, msg)}
                                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-white/50 rounded-lg transition-colors shrink-0"
                                title="复制内容"
                              >
                                {copiedId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Suggestions integrated into the message container */}
                  {msg.role === 'assistant' && msg.isComplete && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-100 mt-1 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="text-sm font-medium text-slate-400 mb-3">{msg.suggestionLabel || '猜你想问'}</div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((s: Suggestion, i: number) => (
                          <div key={i} className="group relative">
                            <button 
                              onClick={() => {
                                if (isGenerating) return;
                                if (s.text === '手工配置') {
                                  setSelectedCouponForConfig(null);
                                  setIsConfigModalOpen(true);
                                  return;
                                }
                                if (s.text === '产品配置' || s.text === '选择产品') {
                                  setIsProductModalOpen(true);
                                  return;
                                }
                                if (s.actionType === 'input' && s.actionValue) {
                                  setInput(s.actionValue);
                                } else if (s.url === '#' || !s.url) {
                                  const textToSend = msg.type === 'card' ? `${msg.content}${s.text}` : s.text;
                                  if (textToSend.includes('【')) {
                                    setInput(textToSend);
                                  } else {
                                    handleSend(textToSend);
                                  }
                                } else {
                                  window.open(s.url || SUGGESTION_REDIRECT_URL, '_blank');
                                }
                              }}
                              disabled={isGenerating}
                              className={`px-5 py-2 bg-white border border-blue-400 rounded-xl text-sm text-blue-500 transition-colors shadow-sm font-medium ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                            >
                              {renderTextWithPlaceholders(s.text, 'suggestion', s.actionValue || s.text)}
                            </button>
                            {s.text === '账单查询' && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
                                点击此账单查询按钮，携带上一步的客户信息进行查询
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
                              </div>
                            )}
                            {s.text === '详单查询' && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
                                点击此详单查询按钮，携带上一步的账单信息进行详单查询
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-sm mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm overflow-hidden mt-0.5">
                  <img src={ASSISTANT_AVATAR} alt="AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="chat-bubble-ai flex items-center gap-1 py-3 px-4">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="mb-2">
              <button 
                onClick={() => setIsCommonModalOpen(true)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-3 py-1 bg-white/80 rounded-lg text-xs font-medium text-slate-600 border border-white/50 shadow-sm transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
              >
                <MessageCircle size={14} className="text-blue-500" />
                常用会话
              </button>
            </div>
            
            <div className={`bg-white rounded-2xl shadow-lg border border-slate-100 p-4 transition-all ${isGenerating ? 'bg-slate-50/50' : ''}`}>
              {/* File list displays here */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-slate-100">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50/60 border border-blue-100/50 text-slate-700 text-xs rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-200">
                      <Paperclip size={12} className="text-blue-500 shrink-0" />
                      <span className="max-w-[150px] truncate font-medium text-[11px] text-blue-900">{file.name}</span>
                      <button 
                        onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                        className="p-0.5 hover:bg-blue-100/80 rounded-md text-blue-400 hover:text-blue-600 cursor-pointer"
                        title="移除文件"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative min-h-[60px] w-full">
                {extractBrackets(input).length > 0 ? (
                  /* Visual Parameter Mode: Display interactive text with inline placeholder components */
                  <div className="w-full text-slate-700 text-sm leading-relaxed p-1 py-1.5 whitespace-pre-wrap select-text pr-14 transition-all animate-in fade-in duration-300">
                    {renderTextWithPlaceholders(input, 'input')}
                  </div>
                ) : (
                  /* Plain Text Input for regular questions */
                  <div className="w-full relative">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isGenerating}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (e.ctrlKey) {
                            // Ctrl + Enter: Insert a newline manually
                            e.preventDefault();
                            const target = e.target as HTMLTextAreaElement;
                            const start = target.selectionStart;
                            const end = target.selectionEnd;
                            const value = target.value;
                            setInput(value.substring(0, start) + "\n" + value.substring(end));
                            // Set cursor position after state update
                            setTimeout(() => {
                              target.selectionStart = target.selectionEnd = start + 1;
                            }, 0);
                          } else if (!e.shiftKey) {
                            // Enter (without Ctrl or Shift): Send message
                            e.preventDefault();
                            handleSend();
                          }
                        }
                      }}
                      placeholder={
                        isGenerating 
                          ? "AI 正在回复中..." 
                          : focusedFunction === 'faq'
                            ? "请输入要咨询的知识内容或业务政策..."
                            : focusedFunction === 'query'
                              ? "请输入要查询的信息，如：查下亚信科技近三个月账单"
                              : focusedFunction === 'coupon'
                                ? "请输入优惠券方案，例如：新增优惠券，名称：9折优惠券 优惠额度：9折 发放数量：1000"
                                : focusedFunction === 'product'
                                  ? "请输入主机规格修改或新增描述，如：给通用型云主机新增一个64核CPU256G内存的规格"
                                  : focusedFunction === 'goods'
                                    ? "请输入商品配置详情或修改上架需求描述..."
                                    : focusedFunction === 'workorder'
                                      ? "请输入要匹配或操作的工单单号/说明..."
                                      : "请输入您想问的内容，回车发送，ctrl+回车换行"
                      }
                      className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-slate-700 placeholder:text-slate-300 min-h-[60px] caret-blue-500 ${isGenerating ? 'cursor-not-allowed mx-0' : 'pr-14'}`}
                    />
                  </div>
                )}

                {input && (
                  <div className="absolute right-0 top-0.5 z-10 flex items-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      disabled={isGenerating}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50/50 border border-slate-100 hover:border-rose-100/60 rounded-xl transition-all cursor-pointer shadow-xs select-none active:scale-95 ${isGenerating ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
                      title="一键清空"
                    >
                      <Trash2 size={12} className="shrink-0" />
                      <span>清空</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 relative">
                <div className="flex items-center gap-2 overflow-visible py-1 pr-4 max-w-[calc(100%-80px)]">
                  {/* File Upload / Plus */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating}
                    className={`p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 ${isGenerating ? 'opacity-30 cursor-not-allowed' : ''}`}
                    title="上传文件"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">上传</span>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files);
                        }
                      }}
                      multiple
                    />
                  </button>

                  {/* Vertical Divider */}
                  <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

                  {focusedFunction ? (
                    /* Focused Feature Tag Pill (Doubao Active Pill Style) */
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 shadow-sm border ${
                      focusedFunction === 'faq' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      focusedFunction === 'query' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                      focusedFunction === 'coupon' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      focusedFunction === 'product' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      focusedFunction === 'goods' ? 'bg-violet-50 text-violet-600 border-violet-200' :
                      'bg-rose-50 text-rose-600 border-rose-200' // workorder
                    }`}>
                      {focusedFunction === 'faq' && <Sparkles size={13} className="text-blue-500 shrink-0" />}
                      {focusedFunction === 'query' && <Search size={13} className="text-indigo-500 shrink-0" />}
                      {focusedFunction === 'coupon' && <Ticket size={13} className="text-amber-500 shrink-0" />}
                      {focusedFunction === 'product' && <Package size={13} className="text-emerald-500 shrink-0" />}
                      {focusedFunction === 'goods' && <Pencil size={13} className="text-violet-500 shrink-0" />}
                      {focusedFunction === 'workorder' && <Briefcase size={13} className="text-rose-500 shrink-0" />}
                      
                      <span>
                        {focusedFunction === 'faq' && '知识问答'}
                        {focusedFunction === 'query' && '智能查询'}
                        {focusedFunction === 'coupon' && '优惠券配置'}
                        {focusedFunction === 'product' && '产品配置'}
                        {focusedFunction === 'goods' && '商品配置'}
                        {focusedFunction === 'workorder' && '工单处理'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setFocusedFunction(null)}
                        className="p-0.5 hover:bg-black/5 rounded-full transition-colors ml-1 cursor-pointer"
                        title="取消聚焦"
                      >
                        <X size={12} className="stroke-[2.5]" />
                      </button>
                    </div>
                  ) : (
                    /* Default Mode Prompt Helpers list */
                    <>
                      {/* 1. 知识问答 */}
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedFunction('faq');
                        }}
                        disabled={isGenerating}
                        className={`flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 transition-all shrink-0 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Sparkles size={13} className="text-blue-500 animate-pulse" />
                        <span>知识问答</span>
                      </button>

                      {/* 2. 智能查询 */}
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedFunction('query');
                        }}
                        disabled={isGenerating}
                        className={`flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 transition-all shrink-0 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Search size={13} className="text-indigo-500" />
                        <span>智能查询</span>
                      </button>

                      {/* 3. 优惠券配置 */}
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedFunction('coupon');
                        }}
                        disabled={isGenerating}
                        className={`flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 transition-all shrink-0 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Ticket size={13} className="text-amber-500" />
                        <span>优惠券配置</span>
                      </button>

                      {/* 4. 产品配置 */}
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedFunction('product');
                        }}
                        disabled={isGenerating}
                        className={`flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 transition-all shrink-0 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Package size={13} className="text-emerald-500" />
                        <span>产品配置</span>
                      </button>

                      {/* 5. 更多 (Trigger only without nested dropdown to prevent clipping) */}
                      <div className="relative shrink-0">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMoreMenuOpen(!isMoreMenuOpen);
                          }}
                          disabled={isGenerating}
                          className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/50 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer select-none'}`}
                        >
                          <LayoutGrid size={13} className="text-slate-700 shrink-0" />
                          <span>更多</span>
                          <ChevronUp size={11} className={`text-slate-500 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isMoreMenuOpen && !focusedFunction && (
                            <>
                              <div 
                                className="fixed inset-0 z-40 bg-transparent" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsMoreMenuOpen(false);
                                }}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.12, ease: "easeOut" }}
                                className="absolute bottom-full mb-2 right-0 z-50 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 flex flex-col gap-1 origin-bottom"
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMoreMenuOpen(false);
                                    setFocusedFunction('goods');
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 text-left rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer whitespace-nowrap w-full"
                                >
                                  <Pencil size={13} className="text-slate-400 shrink-0" />
                                  商品配置
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMoreMenuOpen(false);
                                    setFocusedFunction('workorder');
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 text-left rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer whitespace-nowrap w-full"
                                >
                                  <Briefcase size={13} className="text-slate-400 shrink-0" />
                                  工单处理
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Aligned Submit Actions */}
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button 
                    type="button"
                    disabled={isGenerating}
                    className={`p-2 text-slate-400 rounded-lg transition-colors hover:text-blue-500 hover:bg-blue-50 ${isGenerating ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <Mic size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSend()}
                    disabled={(!input.trim() && uploadedFiles.length === 0) || isGenerating}
                    className={`p-2 rounded-xl transition-all ${(input.trim() || uploadedFiles.length > 0) && !isGenerating ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 cursor-pointer' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    title="发送消息"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-300"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              <motion.div 
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[85vh] border border-white/20"
              >
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <Settings size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">信息查询设置</h2>
                      <p className="text-xs text-slate-400">配置“信息查询”回复中的 10 个功能按钮</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {queryButtonsConfig.map((btn, index) => (
                      <div key={index} className="p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm space-y-4 hover:border-blue-200 transition-all group">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-500 rounded-full uppercase tracking-wider">按钮 {index + 1}</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">按钮名称</label>
                            <input 
                              type="text"
                              value={btn.label}
                              onChange={(e) => {
                                const newConfig = [...queryButtonsConfig];
                                newConfig[index].label = e.target.value;
                                setQueryButtonsConfig(newConfig);
                              }}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all"
                              placeholder="例如：账单查询"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">查询描述 (点击后填入输入框)</label>
                            <textarea 
                              value={btn.value}
                              onChange={(e) => {
                                const newConfig = [...queryButtonsConfig];
                                newConfig[index].value = e.target.value;
                                setQueryButtonsConfig(newConfig);
                              }}
                              rows={2}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all resize-none"
                              placeholder="例如：查询客户近三个月账单"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-slate-50 bg-white flex justify-end gap-3">
                  <button 
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setIsSettingsModalOpen(false);
                    }}
                    className="px-8 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 hover:shadow-blue-300 transition-all transform active:scale-95"
                  >
                    保存配置
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Common Conversations Modal */}
        <AnimatePresence>
          {isCommonModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent"
              onClick={() => setIsCommonModalOpen(false)}
            >
              <motion.div 
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden border border-white/20"
              >
                {/* Modal Header */}
                <div className="p-6 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <MessageCircle size={18} className="text-blue-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">常用会话</h2>
                  </div>
                  <button 
                    onClick={() => setIsCommonModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Tabs */}
                <div className="px-6 py-2 flex items-center gap-6 border-b border-slate-50">
                  <ModalTab label="全部" active={commonModalTab === '全部'} onClick={() => setCommonModalTab('全部')} />
                  <ModalTab label="我的收藏" active={commonModalTab === '我的收藏'} onClick={() => setCommonModalTab('我的收藏')} />
                  <ModalTab label="业务查询" active={commonModalTab === '业务查询'} onClick={() => setCommonModalTab('业务查询')} />
                  <ModalTab label="业务操作" active={commonModalTab === '业务操作'} onClick={() => setCommonModalTab('业务操作')} />
                  <div className="ml-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="搜索" 
                      value={commonSearchQuery}
                      onChange={(e) => setCommonSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-slate-50 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-32"
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3">
                  {paginatedConversations.length > 0 ? (
                    paginatedConversations.map((item) => (
                      <CommonItem 
                        key={item.id}
                        icon={item.isHot ? <Flame size={16} className="text-orange-500" /> : <MessageCircle size={16} className="text-blue-400" />} 
                        text={item.text} 
                        isPinned={item.isPinned}
                        onClick={() => {
                          setInput(item.text);
                          setIsCommonModalOpen(false);
                        }}
                        onDelete={() => handleDeleteConversation(item.id)}
                        onPin={() => handlePinConversation(item.id)}
                        onEdit={(newText) => handleEditConversation(item.id, newText)}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <Search size={40} className="mb-2 opacity-20" />
                      <p className="text-sm">未找到相关会话</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination Footer */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-50 bg-white">
                    <div className="flex items-center justify-center gap-4">
                      <button 
                        onClick={() => setCommonCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={commonCurrentPage === 1}
                        className={`p-1 rounded-lg transition-colors ${commonCurrentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-500'}`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCommonCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${commonCurrentPage === page ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setCommonCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={commonCurrentPage === totalPages}
                        className={`p-1 rounded-lg transition-colors ${commonCurrentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-500'}`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <CouponDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        couponDetail={selectedCouponDetail} 
      />



      <CouponConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setEditingCouponMsgId(null);
        }}
        initialData={selectedCouponForConfig}
        onSave={(updatedData) => {
          if (editingCouponMsgId) {
            const updatedMessages = messages.map(msg => 
              msg.id === editingCouponMsgId 
                ? { ...msg, data: updatedData } 
                : msg
            );
            setMessages(updatedMessages);
            
            if (currentConversationId) {
              setHistoryConversations(prev => prev.map(conv => 
                conv.id === currentConversationId 
                  ? { ...conv, messages: updatedMessages, timestamp: Date.now() }
                  : conv
              ));
            }
          }
        }}
      />

      <ProductConfigModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />

      <ProductDetailModal
        isOpen={isProductDetailModalOpen}
        onClose={() => setIsProductDetailModalOpen(false)}
        productData={selectedProductForDetail}
      />

      <SpecAttributeModal
        isOpen={isSpecAttributeModalOpen}
        onClose={() => setIsSpecAttributeModalOpen(false)}
        specName={selectedProductForDetail?.title}
        specId={selectedProductForDetail?.id || '2106251434380638'}
      />

      <SpecConfigModal
        isOpen={isSpecConfigModalOpen}
        onClose={() => {
          setIsSpecConfigModalOpen(false);
          setIsSpecEditMode(false);
          setEditingSpecInfo(null);
        }}
        onSave={handleSpecSave}
        onUpdate={handleSpecUpdate}
        isEditMode={isSpecEditMode}
        productName={selectedProductForDetail?.description || selectedProductForDetail?.title}
      />

      <ProductModifyModal 
        isOpen={isProductModifyModalOpen}
        onClose={() => setIsProductModifyModalOpen(false)}
        productData={selectedProductForDetail}
      />

      <WorkOrderModal 
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
      />

      <CouponStrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => {
          setIsStrategyModalOpen(false);
          setEditingCouponMsgId(null);
          setIsStrategyReadOnly(false);
        }}
        initialData={selectedCouponForConfig}
        isReadOnly={isStrategyReadOnly}
        onSave={(updatedData) => {
          if (editingCouponMsgId) {
            const updatedMessages = messages.map(msg => 
              msg.id === editingCouponMsgId 
                ? { ...msg, data: updatedData } 
                : msg
            );
            setMessages(updatedMessages);
            
            if (currentConversationId) {
              setHistoryConversations(prev => prev.map(conv => 
                conv.id === currentConversationId 
                  ? { ...conv, messages: updatedMessages, timestamp: Date.now() }
                  : conv
              ));
            }
          }
        }}
      />

      <MarketingStrategyDetailModal
        isOpen={isStrategyDetailModalOpen}
        onClose={() => setIsStrategyDetailModalOpen(false)}
        strategy={selectedStrategyDetail}
      />

      <AnimatePresence>
        {isSubmitSuccessOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20"
              onClick={() => setIsSubmitSuccessOpen(false)}
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
                  <p className="text-2xl font-bold text-slate-700">提交成功！</p>
                  <p className="text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-block">工单号: 26031700233342</p>
                </div>
                <button
                  onClick={() => setIsSubmitSuccessOpen(false)}
                  className="px-10 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center gap-2"
                >
                  <Check size={18} />
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSaveSuccessOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20"
              onClick={() => setIsSaveSuccessOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 flex flex-col items-center text-center border border-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <Check size={32} className="text-blue-500 stroke-[3]" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-8">保存成功</h4>
              <button
                onClick={() => setIsSaveSuccessOpen(false)}
                className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform active:scale-95"
              >
                确定
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalTab({ label, active, onClick }: { label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`py-3 text-sm font-medium relative transition-colors ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {label}
      {active && <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
    </button>
  );
}

interface CommonItemProps {
  icon: React.ReactNode;
  text: string;
  isPinned?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onEdit?: (newText: string) => void;
}

const CommonItem: React.FC<CommonItemProps> = ({ icon, text, isPinned, onClick, onDelete, onPin, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== text) {
      onEdit?.(editText);
    }
    setIsEditing(false);
  };

  return (
    <div 
      onClick={isEditing ? undefined : onClick}
      className={`p-4 bg-white hover:bg-blue-50/80 rounded-2xl border transition-all cursor-pointer group ${isPinned ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {icon}
          {isEditing ? (
            <input 
              autoFocus
              className="flex-1 bg-white border border-blue-400 rounded px-2 py-1 text-sm focus:outline-none"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSubmit();
                if (e.key === 'Escape') {
                  setEditText(text);
                  setIsEditing(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`text-sm font-medium truncate transition-colors ${isPinned ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600'}`}>
              {text}
              {isPinned && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">已置顶</span>}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 ml-2 shrink-0">
          {!isEditing && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-600 font-medium"
              >
                <Pencil size={12} />编辑
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPin?.();
                }}
                className={`flex items-center gap-1 text-[10px] font-medium ${isPinned ? 'text-orange-500 hover:text-orange-600' : 'text-blue-500 hover:text-blue-600'}`}
              >
                <Pin size={12} />{isPinned ? '取消置顶' : '置顶'}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-600 font-medium"
              >
                <Trash2 size={12} />删除
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon, active, onClick, label }: { icon: React.ReactNode, active?: boolean, onClick?: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 w-full transition-all group ${active ? 'text-blue-600' : 'text-slate-400 hover:text-blue-400'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-white shadow-sm' : 'group-hover:bg-white/50'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function ActionItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg text-xs text-slate-600 transition-colors w-full text-left">
      <span className="text-slate-400">{icon}</span>
      {label}
    </button>
  );
}
