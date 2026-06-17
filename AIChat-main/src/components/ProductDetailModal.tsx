import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Database, Layers, FileText, Search, ExternalLink, Copy, Pencil, Trash2 } from 'lucide-react';
import SpecAttributeModal from './SpecAttributeModal';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData?: any;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, productData }) => {
  const [isSpecModalOpen, setIsSpecModalOpen] = React.useState(false);
  const [selectedSpec, setSelectedSpec] = React.useState<{ id: string; name: string } | null>(null);

  if (!isOpen) return null;

  const handleShowSpecDetails = (id: string, name: string) => {
    setSelectedSpec({ id, name });
    setIsSpecModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Info size={22} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">产品详情</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30">
              
              {/* Section 1: Basic Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h4 className="text-base font-bold text-blue-600">产品基础信息</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                  <InfoItem label="产品类型" value="" />
                  <InfoItem label="产品名称" value="通用网络增强型云主机" />
                  <InfoItem label="产品目录" value="移动云 > 弹性计算 > 云主机" />
                  <InfoItem label="产品分类" value="云主机" />
                  <InfoItem label="产品生效日期" value="2024-05-09 14:49:25" />
                  <InfoItem label="产品失效日期" value="2099-12-31 23:59:59" />
                  <InfoItem label="业务平台" value="MOP平台" />
                  <InfoItem label="产品描述" value="通用网络增强型云主机规格配置" />
                  <InfoItem label="产品负责人" value="苏昕" />
                  <InfoItem label="产品管理部门" value="计算产品部" />
                  <InfoItem label="关联立项产品编码" value="PD20200001" />
                  <InfoItem label="是否合营云产品" value="否" />
                </div>
              </section>

              {/* Section 2: Attributes */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h4 className="text-base font-bold text-blue-600">产品属性信息</h4>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">属性标识</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">属性名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">属性编码</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">是否所有规格通用</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <AttributeRow id="2021010819005041" name="CPU" code="cpu" universal="否" />
                      <AttributeRow id="2021010819005116" name="内存容量(GB)" code="ram" universal="否" />
                      <AttributeRow id="2021010819005117" name="内网带宽" code="MaxBandwidth" universal="否" />
                      <AttributeRow id="2021010819005336" name="操作系统" code="os" universal="否" />
                      <AttributeRow id="2021010819005422" name="模板ID" code="FlavorRef" universal="否" />
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 3: Specifications */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h4 className="text-base font-bold text-blue-600">产品规格信息</h4>
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
                      <SpecRow id="2106251422050637" name="云主机 通用型 64vCPU 256GB内存" onShowDetails={() => handleShowSpecDetails("2106251422050637", "云主机 通用型 64vCPU 256GB内存")} />
                      <SpecRow id="2106251434380638" name="云主机 通用型 64vCPU 256GB内存" onShowDetails={() => handleShowSpecDetails("2106251434380638", "云主机 通用型 64vCPU 256GB内存")} />
                      <SpecRow id="2106251437020639" name="云主机 通用型 64vCPU 256GB内存" onShowDetails={() => handleShowSpecDetails("2106251437020639", "云主机 通用型 64vCPU 256GB内存")} />
                      <SpecRow id="2106251438420640" name="云主机 通用型 64vCPU 256GB内存" onShowDetails={() => handleShowSpecDetails("2106251438420640", "云主机 通用型 64vCPU 256GB内存")} />
                      <SpecRow id="2106251439340641" name="云主机 通用型 64vCPU 256GB内存" onShowDetails={() => handleShowSpecDetails("2106251439340641", "云主机 通用型 64vCPU 256GB内存")} />
                      
                      {/* Appended Specifications from Chat */}
                      {productData?.specs?.map((spec: any, index: number) => (
                        <SpecRow 
                          key={`appended-${index}`}
                          id={`2106251439340${642 + index}`} 
                          name={spec.name} 
                          onShowDetails={() => handleShowSpecDetails(`2106251439340${642 + index}`, spec.name)}
                          showAllActions={true}
                          isAppended={true}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4: Cost Records */}
              <section className="space-y-6 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h4 className="text-base font-bold text-blue-600">产品成本记录信息</h4>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-slate-100 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">产品成本名称</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">产品成本类型</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">产品成本</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">成本生效日期</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">成本失效日期</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">产品成本描述</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <FileText size={32} className="opacity-20" />
                    </div>
                    <p className="text-sm font-medium">没有数据</p>
                    <p className="text-xs opacity-60">请先做数据查询</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-50 bg-white flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
              >
                关闭
              </button>
            </div>
          </motion.div>

          <SpecAttributeModal 
            isOpen={isSpecModalOpen} 
            onClose={() => setIsSpecModalOpen(false)} 
            specName={selectedSpec?.name}
            specId={selectedSpec?.id}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <p className="text-sm font-medium text-slate-700">{value}</p>
  </div>
);

const AttributeRow: React.FC<{ id: string; name: string; code: string; universal: string }> = ({ id, name, code, universal }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 text-sm font-mono text-slate-500">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigator.clipboard.writeText(id)}
          className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
          title="复制规格"
        >
          <Copy size={14} />
        </button>
        {id}
      </div>
    </td>
    <td className="px-6 py-4 text-sm font-bold text-slate-700">{name}</td>
    <td className="px-6 py-4 text-sm font-mono text-slate-400">{code}</td>
    <td className="px-6 py-4 text-sm text-slate-600">{universal}</td>
  </tr>
);

const SpecRow: React.FC<{ id: string; name: string; onShowDetails: () => void; showAllActions?: boolean; isAppended?: boolean }> = ({ id, name, onShowDetails, showAllActions, isAppended }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors ${isAppended ? 'bg-blue-50/30' : ''}`}>
    <td className={`px-6 py-4 text-sm font-mono ${isAppended ? 'text-blue-500' : 'text-slate-500'}`}>{id}</td>
    <td className={`px-6 py-4 text-sm font-bold ${isAppended ? 'text-blue-600' : 'text-slate-700'}`}>{name}</td>
    <td className="px-6 py-4 text-sm text-right">
      <div className="flex items-center justify-end gap-2">
        <div className="group relative inline-flex items-center">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(id);
            }}
            className={`p-2 rounded-lg transition-all hover:scale-110 ${isAppended ? 'text-blue-400 hover:text-blue-600 hover:bg-blue-100' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
          >
            <Copy size={16} />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
            复制规格
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
          </div>
        </div>

        <div className="group relative inline-flex items-center">
          <button 
            onClick={onShowDetails}
            className={`p-2 rounded-lg transition-all hover:scale-110 ${isAppended ? 'text-blue-600 hover:bg-blue-100' : 'text-blue-500 hover:bg-blue-50'}`}
          >
            <Search size={16} />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
            查看详情
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
          </div>
        </div>

        {showAllActions && (
          <>
            <div className="group relative inline-flex items-center">
              <button 
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isAppended ? 'text-blue-400 hover:text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
              >
                <Pencil size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
                修改规格
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
              </div>
            </div>

            <div className="group relative inline-flex items-center">
              <button 
                className={`p-2 rounded-lg transition-all hover:scale-110 ${isAppended ? 'text-blue-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Trash2 size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800/95 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-y-1 group-hover:translate-y-0 border border-white/10">
                删除规格
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800/95" />
              </div>
            </div>
          </>
        )}
      </div>
    </td>
  </tr>
);

export default ProductDetailModal;
