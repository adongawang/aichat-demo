import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Calendar, ChevronDown, Check } from 'lucide-react';

interface CouponStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave?: (updatedData: any) => void;
  isReadOnly?: boolean;
}

const CouponStrategyModal: React.FC<CouponStrategyModalProps> = ({ isOpen, onClose, initialData, onSave, isReadOnly }) => {
  const [strategyName, setStrategyName] = useState('618主机折扣活动');
  const [belongingActivity, setBelongingActivity] = useState('请选择');
  const [startTime, setStartTime] = useState('2026/05/12 00:00:00');
  const [endTime, setEndTime] = useState('2026/05/12 23:59:59');
  const [province, setProvince] = useState('中国移动云能力中心');
  const [city, setCity] = useState('--请选择--');
  const [designatedIssuer, setDesignatedIssuer] = useState('请填写');
  const [description, setDescription] = useState('请填写');
  const [decisionBasis, setDecisionBasis] = useState('请上传上会材料、申请邮件、会议纪要或业务联系单等附件');

  // Coupon Strategy configs
  const [targetCustomer, setTargetCustomer] = useState('选择客户');
  const [marketingPosition, setMarketingPosition] = useState('请选择');
  const [marketingLanguage, setMarketingLanguage] = useState('请选择');
  const [reminderTemplate, setReminderTemplate] = useState('请选择');
  const [usageCount, setUsageCount] = useState('1');
  const [receiveCount, setReceiveCount] = useState('1');
  const [totalQuantityEnabled, setTotalQuantityEnabled] = useState(true);
  const [couponQuantity, setCouponQuantity] = useState('1000');
  const [authStartTime, setAuthStartTime] = useState('');
  const [authEndTime, setAuthEndTime] = useState('');
  const [limits, setLimits] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData?.details?.schemeInfo) {
        const s = initialData.details.schemeInfo;
        setStrategyName(s.schemeName || '618主机折扣活动');
        setBelongingActivity(s.belongingActivity || '请选择');
        setStartTime(s.startTime || '2026/05/12 00:00:00');
        setEndTime(s.endTime || '2026/05/12 23:59:59');
        setProvince(s.province || '中国移动云能力中心');
        setCity(s.city || '--请选择--');
        setDesignatedIssuer(s.designatedIssuer || '请填写');
        setDescription(s.description || '请填写');
        setDecisionBasis(s.decisionBasis || '请上传上会材料、申请邮件、会议纪要或业务联系单等附件');
        setTargetCustomer(s.targetCustomer || initialData.details?.customerType || '选择客户');
        setMarketingPosition(s.marketingPosition || '请选择');
        setMarketingLanguage(s.marketingLanguage || '请选择');
        setReminderTemplate(s.reminderTemplate || '请选择');
        setUsageCount(s.usageCount || '1');
        setReceiveCount(s.receiveCount || '1');
        setTotalQuantityEnabled(s.totalQuantityEnabled !== undefined ? s.totalQuantityEnabled : true);
        setCouponQuantity(s.couponQuantity || initialData.details?.quantity || '1000');
        setAuthStartTime(s.authStartTime || '');
        setAuthEndTime(s.authEndTime || '');
        setLimits(s.limits || []);
      } else {
        setStrategyName(initialData?.details?.project || '618主机折扣活动');
        setCouponQuantity(initialData?.details?.quantity || '1000');
        setStartTime('2026/05/12 00:00:00');
        setEndTime('2026/05/12 23:59:59');
        setProvince('中国移动云能力中心');
        setCity('--请选择--');
        setDesignatedIssuer('请填写');
        setDescription('请填写');
        setDecisionBasis('请上传上会材料、申请邮件、会议纪要或业务联系单等附件');
        setTargetCustomer(initialData?.details?.customerType || '选择客户');
        setBelongingActivity('请选择');
        setMarketingPosition('请选择');
        setMarketingLanguage('请选择');
        setReminderTemplate('请选择');
        setUsageCount('1');
        setReceiveCount('1');
        setTotalQuantityEnabled(true);
        setAuthStartTime('');
        setAuthEndTime('');
        setLimits([]);
      }
    }
  }, [isOpen, initialData]);

  const handleLimitChange = (limit: string) => {
    if (limits.includes(limit)) {
      setLimits(limits.filter(l => l !== limit));
    } else {
      setLimits([...limits, limit]);
    }
  };

  const handleConfirmSend = () => {
    if (onSave) {
      onSave({
        ...initialData,
        details: {
          ...initialData?.details,
          project: strategyName,
          quantity: couponQuantity,
          customerType: targetCustomer !== '选择客户' ? targetCustomer : (initialData?.details?.customerType || '全体客户'),
          hasSchemeInfo: true, // Marker of layout
          schemeInfo: {
            schemeName: strategyName,
            belongingActivity,
            startTime,
            endTime,
            province,
            city,
            designatedIssuer,
            description,
            decisionBasis,
            targetCustomer,
            marketingPosition,
            marketingLanguage,
            reminderTemplate,
            usageCount,
            receiveCount,
            totalQuantityEnabled,
            couponQuantity,
            authStartTime,
            authEndTime,
            limits
          }
        }
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
            className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800">
                  {isReadOnly ? '优惠券方案详情' : '优惠券配置修改'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
              {/* Part 1: 优惠券方案信息 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-sm font-bold text-slate-800">优惠券方案信息</h4>
                  </div>
                  <span className="text-xs text-slate-400">收起</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                  {/* Row 1 */}
                  <FormField label="方案名称" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={strategyName}
                        onChange={(e) => !isReadOnly && setStrategyName(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="请填写" 
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  <FormField label="归属营销活动">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={belongingActivity}
                        onChange={(e) => !isReadOnly && setBelongingActivity(e.target.value)}
                        readOnly={isReadOnly}
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-12 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      {!isReadOnly && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
                          {belongingActivity && belongingActivity !== '请选择' && (
                            <X size={14} className="hover:text-slate-600 cursor-pointer" onClick={() => setBelongingActivity('')} />
                          )}
                          <Search size={16} />
                        </div>
                      )}
                    </div>
                  </FormField>

                  {/* Row 2 */}
                  <FormField label="开始时间" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={startTime}
                        onChange={(e) => !isReadOnly && setStartTime(e.target.value)}
                        readOnly={isReadOnly}
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  <FormField label="结束时间" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={endTime}
                        onChange={(e) => !isReadOnly && setEndTime(e.target.value)}
                        readOnly={isReadOnly}
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  {/* Row 3 */}
                  <FormField label="所属省份" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={province}
                        onChange={(e) => !isReadOnly && setProvince(e.target.value)}
                        readOnly={isReadOnly}
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-400 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      {!isReadOnly && <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />}
                    </div>
                  </FormField>

                  <FormField label="所属地市">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => !isReadOnly && setCity(e.target.value)}
                        readOnly={isReadOnly}
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-400 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      {!isReadOnly && <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />}
                    </div>
                  </FormField>

                  {/* Row 4 */}
                  <div className="md:col-span-2">
                    <FormField label="指定人员发券">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={designatedIssuer}
                          onChange={(e) => !isReadOnly && setDesignatedIssuer(e.target.value)}
                          readOnly={isReadOnly}
                          className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                            isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      </div>
                    </FormField>
                  </div>

                  {/* Row 5 */}
                  <div className="md:col-span-2">
                    <FormField label="方案描述">
                      <textarea 
                        value={description}
                        onChange={(e) => !isReadOnly && setDescription(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="请填写"
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all h-20 resize-none text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                    </FormField>
                  </div>

                  {/* Row 6 */}
                  <div className="md:col-span-2">
                    <FormField label="决策依据" required>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={decisionBasis}
                          onChange={(e) => !isReadOnly && setDecisionBasis(e.target.value)}
                          readOnly={isReadOnly}
                          placeholder="请上传上会材料、申请邮件、会议纪要或业务联系单等附件"
                          className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                            isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Part 2: 优惠券策略配置 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h4 className="text-sm font-bold text-slate-800">优惠券策略配置</h4>
                  </div>
                  <span className="text-xs text-slate-400">收起</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                  {/* Row 7 */}
                  <div className="md:col-span-2 flex items-center gap-4">
                    <FormField label="目标客户群" required>
                      <div className="relative w-64">
                        <input 
                          type="text" 
                          placeholder="选择客户"
                          value={targetCustomer}
                          onChange={(e) => !isReadOnly && setTargetCustomer(e.target.value)}
                          readOnly={isReadOnly}
                          className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                            isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      </div>
                    </FormField>
                    {!isReadOnly && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setTargetCustomer('所有客户')}
                          className={`px-3 py-1.5 border rounded-lg text-xs transition-colors ${targetCustomer === '所有客户' ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          所有客户
                        </button>
                        <button 
                          onClick={() => setTargetCustomer('集团客户')}
                          className={`px-3 py-1.5 border rounded-lg text-xs transition-colors ${targetCustomer === '集团客户' ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          集团客户
                        </button>
                        <button 
                          onClick={() => setTargetCustomer('互联网客户')}
                          className={`px-3 py-1.5 border rounded-lg text-xs transition-colors ${targetCustomer === '互联网客户' ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          互联网客户
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Row 8 */}
                  <FormField label="营销位置" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={marketingPosition}
                        onChange={(e) => !isReadOnly && setMarketingPosition(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="请选择"
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  <FormField label="营销用语" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={marketingLanguage}
                        onChange={(e) => !isReadOnly && setMarketingLanguage(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="请选择"
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  {/* Row 9 */}
                  <FormField label="提醒模板" required>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={reminderTemplate}
                        onChange={(e) => !isReadOnly && setReminderTemplate(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="请选择"
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  <div />

                  {/* Row 10 */}
                  <FormField label="使用次数" required>
                    <input 
                      type="text" 
                      value={usageCount}
                      readOnly
                      className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed text-sm focus:outline-none animate-none"
                    />
                  </FormField>

                  <FormField label="领取张数(人/次)" required>
                    <input 
                      type="text" 
                      placeholder="请填写"
                      value={receiveCount}
                      onChange={(e) => !isReadOnly && setReceiveCount(e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all text-sm ${
                        isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                  </FormField>

                  {/* Row 11 */}
                  <FormField label="总数量设置" required>
                    <div className="flex w-32 h-9 bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => !isReadOnly && setTotalQuantityEnabled(true)}
                        className={`flex-1 rounded-md text-xs font-bold transition-all ${totalQuantityEnabled ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        是
                      </button>
                      <button 
                        onClick={() => !isReadOnly && setTotalQuantityEnabled(false)}
                        className={`flex-1 rounded-md text-xs font-bold transition-all ${!totalQuantityEnabled ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        否
                      </button>
                    </div>
                  </FormField>

                  <FormField label="优惠券数量" required>
                    <input 
                      type="text" 
                      placeholder="请填写"
                      value={couponQuantity}
                      onChange={(e) => !isReadOnly && setCouponQuantity(e.target.value)}
                      readOnly={isReadOnly}
                      className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all text-sm ${
                        isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                  </FormField>

                  {/* Row 12 */}
                  <FormField label="实名认证开始时间">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={authStartTime}
                        onChange={(e) => !isReadOnly && setAuthStartTime(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="年 / 月 / 日  --:--:--"
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  <FormField label="实名认证结束时间">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={authEndTime}
                        onChange={(e) => !isReadOnly && setAuthEndTime(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="年 / 月 / 日  --:--:--"
                        className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none transition-all pr-10 text-sm ${
                          isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="领取限制">
                      <div className="flex gap-8 py-2">
                        <Checkbox label="首购客户" checked={limits.includes('首购')} onChange={() => !isReadOnly && handleLimitChange('首购')} isReadOnly={isReadOnly} />
                        <Checkbox label="已购客户" checked={limits.includes('已购')} onChange={() => !isReadOnly && handleLimitChange('已购')} isReadOnly={isReadOnly} />
                        <Checkbox label="首次付费客户" checked={limits.includes('首次付费')} onChange={() => !isReadOnly && handleLimitChange('首次付费')} isReadOnly={isReadOnly} />
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-center gap-6">
              {isReadOnly ? (
                <button 
                  onClick={onClose}
                  className="px-20 py-2.5 bg-[#0099DE] text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-[#0088CC] transition-all transform active:scale-95 text-sm cursor-pointer"
                >
                  确定
                </button>
              ) : (
                <>
                  <button 
                    onClick={onClose}
                    className="px-12 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all transform active:scale-95 text-sm cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmSend}
                    className="px-16 py-2.5 bg-[#0099DE] hover:bg-[#0088CC] text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all transform active:scale-95 text-sm cursor-pointer"
                  >
                    发送
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="flex items-start gap-4">
    <label className="text-sm font-semibold text-slate-600 w-32 shrink-0 text-right pt-2 font-sans">
      {required && <span className="text-red-500 mr-1">*</span>}{label}：
    </label>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const Checkbox: React.FC<{ label: string; checked?: boolean; onChange?: () => void; isReadOnly?: boolean }> = ({ label, checked, onChange, isReadOnly }) => (
  <label className={`flex items-center gap-2 group ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}>
    <div 
      onClick={onChange}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
        checked ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
      } ${!isReadOnly && !checked ? 'group-hover:border-blue-400' : ''}`}
    >
      {checked && <Check size={12} className="text-white stroke-[3]" />}
    </div>
    <span className={`text-sm ${isReadOnly ? 'text-slate-400' : 'text-slate-600'} font-sans`}>{label}</span>
  </label>
);

export default CouponStrategyModal;
