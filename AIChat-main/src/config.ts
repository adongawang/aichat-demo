import { Suggestion, QuickAction, Conversation } from './types';

export interface KeywordRule {
  keyword: string;
  responseType: 'card' | 'text' | 'product-list' | 'product-config-list' | 'spec-list' | 'detailed-bill' | 'call-log';
  content: string;
  data?: any;
  detailsUrl?: string;
  suggestions?: Suggestion[];
  suggestionLabel?: string;
}

export interface CommonConversation {
  id: string;
  text: string;
  isHot?: boolean;
  isPinned?: boolean;
  category: '收藏' | '查询' | '办理' | '其他';
}

export const KEYWORD_RULES: KeywordRule[] = [
  {
    keyword: '话单',
    responseType: 'call-log',
    content: '话单查询结果如下：',
    data: [
      {
        callLogName: 'CSMP202605191553001200000111805125',
        serialNumber: '2026051915490000000001338570',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849832',
        productCode: '111805',
        tariffCode: '1118054241',
        tariffSubject: 'zL5C',
        startDate: '20260519',
        startTime: '154200',
        endDate: '20260519',
        endTime: '154800',
        duration: '360',
        unitPrice: '5.687'
      },
      {
        callLogName: 'CSMP202605191553001200000111805126',
        serialNumber: '2026051915490000000001338571',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849833',
        productCode: '111805',
        tariffCode: '1118054242',
        tariffSubject: 'zL5D',
        startDate: '20260519',
        startTime: '160000',
        endDate: '20260519',
        endTime: '160500',
        duration: '300',
        unitPrice: '4.850'
      },
      {
        callLogName: 'CSMP202605191553001200000111805127',
        serialNumber: '2026051915490000000001338572',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849834',
        productCode: '111805',
        tariffCode: '1118054243',
        tariffSubject: 'zL5E',
        startDate: '20260519',
        startTime: '161500',
        endDate: '20260519',
        endTime: '162000',
        duration: '300',
        unitPrice: '4.850'
      },
      {
        callLogName: 'CSMP202605191553001200000111805128',
        serialNumber: '2026051915490000000001338573',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849835',
        productCode: '111805',
        tariffCode: '1118054244',
        tariffSubject: 'zL5F',
        startDate: '20260519',
        startTime: '163000',
        endDate: '20260519',
        endTime: '163500',
        duration: '300',
        unitPrice: '4.850'
      },
      {
        callLogName: 'CSMP202605191553001200000111805129',
        serialNumber: '2026051915490000000001338574',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849836',
        productCode: '111805',
        tariffCode: '1118054245',
        tariffSubject: 'zL5G',
        startDate: '20260519',
        startTime: '164500',
        endDate: '20260519',
        endTime: '165000',
        duration: '300',
        unitPrice: '4.850'
      },
      {
        callLogName: 'CSMP202605191553001200000111805130',
        serialNumber: '2026051915490000000001338575',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849837',
        productCode: '111805',
        tariffCode: '1118054246',
        tariffSubject: 'zL5H',
        startDate: '20260519',
        startTime: '170000',
        endDate: '20260519',
        endTime: '170500',
        duration: '300',
        unitPrice: '4.850'
      },
      {
        callLogName: 'CSMP202605191553001200000111805131',
        serialNumber: '2026051915490000000001338576',
        customerCode: 'E0002022070113858151',
        billingDate: '20260531',
        orderCode: '100033849838',
        productCode: '111805',
        tariffCode: '1118054247',
        tariffSubject: 'zL5I',
        startDate: '20260519',
        startTime: '171500',
        endDate: '20260519',
        endTime: '172000',
        duration: '300',
        unitPrice: '4.850'
      }
    ],
    suggestions: [
      { text: '账单查询', actionType: 'input', actionValue: '账单查询' }
    ],
    suggestionLabel: '您还可以'
  },
  {
    keyword: '详单',
    responseType: 'detailed-bill',
    content: '详单查询结果如下：',
    data: [
      {
        billingPeriod: '202602',
        customerName: '春生****集团',
        orderAccountName: '春生****集团',
        productName: '智能体管理平台',
        billingScenario: '包月费',
        unitPrice: '1800.00',
        usage: '1',
        usageUnit: '元/月',
        serviceDuration: '28',
        durationUnit: '天',
        catalogAmount: '1800',
        discountAmount: '0',
        receivableAmount: '1800'
      },
      {
        billingPeriod: '202602',
        customerName: '春生****集团',
        orderAccountName: '办公主账户',
        productName: '通用型云主机',
        billingScenario: '包日费',
        unitPrice: '5.00',
        usage: '30',
        usageUnit: '天',
        serviceDuration: '30',
        durationUnit: '天',
        catalogAmount: '150',
        discountAmount: '15',
        receivableAmount: '135'
      },
      {
        billingPeriod: '202602',
        customerName: '春生****集团',
        orderAccountName: '测试账户',
        productName: '云数据库MySQL',
        billingScenario: '按量计费',
        unitPrice: '2.50',
        usage: '100',
        usageUnit: '核*小时',
        serviceDuration: '100',
        durationUnit: '小时',
        catalogAmount: '250',
        discountAmount: '0',
        receivableAmount: '250'
      },
      {
        billingPeriod: '202602',
        customerName: '春生****集团',
        orderAccountName: '春生****集团',
        productName: '对象存储OSS',
        billingScenario: '按量计费',
        unitPrice: '0.15',
        usage: '500',
        usageUnit: 'GB',
        serviceDuration: '30',
        durationUnit: '天',
        catalogAmount: '75',
        discountAmount: '5',
        receivableAmount: '70'
      },
      {
        billingPeriod: '202602',
        customerName: '春生****集团',
        orderAccountName: '办公主账户',
        productName: '公网带宽',
        billingScenario: '包年包月',
        unitPrice: '100.00',
        usage: '1',
        usageUnit: 'Mbps',
        serviceDuration: '1',
        durationUnit: '月',
        catalogAmount: '100',
        discountAmount: '10',
        receivableAmount: '90'
      },
      {
        billingPeriod: '202602',
        customerName: '春生****集团',
        orderAccountName: '春生****集团',
        productName: '负载均衡SLB',
        billingScenario: '包月费',
        unitPrice: '50.00',
        usage: '1',
        usageUnit: '个/月',
        serviceDuration: '28',
        durationUnit: '天',
        catalogAmount: '50',
        discountAmount: '0',
        receivableAmount: '50'
      }
    ],
    suggestions: [
      { text: '账单查询', actionType: 'input', actionValue: '账单查询' }
    ],
    suggestionLabel: '您还可以'
  },
  {
    keyword: '查看开放云',
    responseType: 'card',
    content: '开放云订单详情',
    data: {
      isOrderDetails: true,
      orderId: 'CIDC-O-D1F77414812449649769E422301C425E',
      operationType: '变更订单同步',
      orderStatus: 'MOP完工失败',
      customerName: 'a**sd',
      createTime: '2026-4-28 13:40:31'
    },
    suggestions: [
      { text: '订单取消', actionType: 'input', actionValue: '取消订单' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '订单信息',
    responseType: 'card',
    content: '大云订单详情',
    data: {
      isDayunOrderDetails: true,
      batchId: 'MOP-O-26050809399338',
      orderId: 'MOP-T-26050804404734',
      operationType: '购物车订购',
      orderStatus: '订单送服务开通成功',
      customerName: '江**集团',
      createTime: '2026-5-08 13:24:02'
    },
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '客户信息',
    responseType: 'card',
    content: '亚信科技',
    data: {
      customerType: '金牌客户',
      managerName: '张**',
      status: '正常',
      managerPhone: '138****8888',
      pCode: 'P12345678901234567',
      cCode: 'C123456789012345678901234'
    },
    suggestions: [
      { text: '账单查询', actionType: 'input', actionValue: '查下【亚信科技】【近三个月】的账单' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '产品政策',
    responseType: 'text',
    content: '极速型云主机目前享受9折优惠，且支持按量付费。',
    suggestions: [
      { text: '如何办理', url: 'https://www.baidu.com' },
      { text: '查看更多政策', url: 'https://www.baidu.com' }
    ]
  },
  {
    keyword: '账单',
    responseType: 'card',
    content: '账单详情',
    data: [
      {
        billingPeriod: '2026-03',
        customerName: '亚信科技集团',
        accountName: 'yx_tech_admin',
        catalogAmount: '15,000.00',
        discountAmount: '2,550.00',
        receivableAmount: '12,450.00'
      },
      {
        billingPeriod: '2026-02',
        customerName: '亚信科技集团',
        accountName: 'yx_tech_admin',
        catalogAmount: '14,200.00',
        discountAmount: '2,130.00',
        receivableAmount: '12,070.00'
      },
      {
        billingPeriod: '2026-01',
        customerName: '亚信科技集团',
        accountName: 'yx_tech_admin',
        catalogAmount: '16,800.00',
        discountAmount: '3,360.00',
        receivableAmount: '13,440.00'
      }
    ],
    suggestions: [
      { text: '详单查询', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '用户信息',
    responseType: 'card',
    content: '用户360视图',
    data: {
      isUser360: true,
      customerName: '北京****有限公司',
      loginAccount: 'csy_csb****_ext',
      contact: '王**',
      userPhone: '139****6666',
      province: '北京',
      city: '北京市',
      status: '正常'
    },
    suggestions: [
      { text: '查看账单', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '登录名称',
    responseType: 'card',
    content: '互联网客户黑信息',
    data: {
      isInternetBlacklist: true,
      loginName: 'YDY_188****9733_d6',
      customerCode: 'N00020****336823',
      customerType: '互联网企业客户',
      customerStatus: '黑名单',
      contactName: '张**',
      phoneNumber: '138****8888'
    },
    suggestions: [
      { text: '黑名单记录', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '黑名单',
    responseType: 'card',
    content: '集团客户黑名单信息',
    data: {
      isBlacklist: true,
      groupCustomerName: '北京****有限公司',
      idType: '营业执照',
      idNumber: '911****MA00',
      customerStatus: '黑名单'
    },
    suggestions: [
      { text: '黑名单记录', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '合营云',
    responseType: 'card',
    content: '合营云商品详情',
    data: {
      ebossProduct: '8230210',
      categoryCode: 'CIDC-RT',
      productName: '合营云主机',
      productStatus: '商用',
      productCode: 'b7ccd669d5914a84abfe080612482a99'
    },
    suggestions: [
      { text: '商品变更新增', url: '#' },
      { text: '测试环境同步', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '开放云',
    responseType: 'card',
    content: '开放云商品详情',
    data: {
      isOpenCloud: true,
      productCode: '9209042',
      productType: 'SAASKFY-ENTApplication',
      productName: '友空间',
      productStatus: '商用',
      commodityCode: '00905801f9ef4edda785982851a789a0'
    },
    suggestions: [
      { text: '测试环境同步', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '商品信息',
    responseType: 'card',
    content: '商品详情',
    data: {
      ebossProduct: '9202974',
      categoryCode: 'VM',
      productCode: '00265ab9be394b52ba3127a134d420c9',
      productName: '通用型云主机',
      productStatus: '商用'
    },
    suggestions: [
      { text: '商品变更新增', url: '#' },
      { text: '测试环境同步', url: '#' }
    ],
    suggestionLabel: '您还可以',
    detailsUrl: 'https://www.baidu.com'
  },
  {
    keyword: '优惠券配置介绍',
    responseType: 'text',
    content: `**优惠券类型介绍**  

- **满减券**：订单金额达到指定门槛后，减免固定金额，如满100元减20元  
- **折扣券**：按订单总额的一定比例进行折扣，如8折券  
- **代金券**：无门槛或低门槛，直接抵扣固定金额，如10元代金券  
- **时长满减券**：订购时长达到指定门槛后，减免固定时长的费用，如满100个月减10个月  

**优惠券配置说明:**  
1. 标黄色背景的字段均为必填项，其余字段按情况选填。  
2. 关于生失效时间：生失效方式选择绝对时间时填入 xxxx/xx/xx-xxxx/xx/xx；选择相对时间时填入 xx（仅填数字，默认单位为天）。  
3. 优惠券配置的部分字段按如下默认值录入——  
   - 是否与现有营销活动规则互斥（必填）：默认为 **是**。  
   - 是否与客户折扣互斥（必填）：默认为 **是**。  
   - 是否配置结算基准价折扣（选填）：默认为 **否**。  
   - 数据类型（必填）：默认 **正式数据**。  
4. 若优惠券限制适用产品，则需同时录入“校验层级”和“资费编码”。  
   - 选择 **产品级-资费编码**，则根据录入的资费编码匹配到相应产品（规格不限）；  
   - 选择 **规格级-资费编码**，则根据录入的资费编码匹配到相应产品-规格，仅支持正选规格逻辑；  
   - 选择 **资费级-资费编码**，则根据录入的资费编码匹配到相应产品-资费。  

**优惠券配置入口**  
资源中心 → 电子券管理 → 优惠券管理 → 优惠券管理`,
    suggestions: [
      { text: '优惠券配置', url: '#' }
    ],
    suggestionLabel: '推荐操作'
  },
  {
    keyword: '产商品配置介绍',
    responseType: 'text',
    content: `**产商品配置介绍**  

- **产品**：最基础的业务单元，如“云主机”、“云存储”。  
- **规格**：产品的具体属性组合，如“2核4G”、“100GB”。  
- **资费**：产品的计费规则，如“按月付费”、“按量计费”。  
- **商品**：面向客户销售的实体，由一个或多个产品及其资费组成。  

**配置说明:**  
1. 录入产品基本信息，包含产品编码、产品名称、产品类型等。  
2. 配置产品规格属性，定义产品的可变参数。  
3. 关联资费计划，设定产品的价格体系。  
4. 发布商品，将配置好的产品组合上架销售。  

**配置入口**  
产商品中心 → 产商品管理 → 产品管理 → 产品配置`,
    suggestions: [
      { text: '产品变更新增', url: '#' },
      { text: '产品新增', url: '#' },
      { text: '商品变更新增', url: '#' },
      { text: '商品新增', url: '#' }
    ],
    suggestionLabel: '推荐操作'
  },
  {
    keyword: '产品新增',
    responseType: 'text',
    content: '好的，已为您开启产品配置流程。请填写产品基础信息，完成后点击下一步提交审核。',
    suggestions: [
      { text: '产品配置', url: '#' }
    ],
    suggestionLabel: '您还可以'
  },
  {
    keyword: '产品变更新增',
    responseType: 'text',
    content: '好的，已为您开启产品变更流程，您可以输入给通用型云主机新增一个64核CPU256G内存的规格',
    suggestions: [
      { text: '选择产品', url: '#' }
    ],
    suggestionLabel: '您还可以'
  },
  {
    keyword: '主机类产品',
    responseType: 'product-config-list',
    content: '为您推荐以下主机类产品，您可以点击“配置”进行个性化设置：',
    data: [
      {
        id: 'PRD-HOST-001',
        tag: '95%',
        percentage: '95%',
        title: '智算型云主机 (32核)',
        description: '适用于AI推理、大数据分析等场景，32核CPU / 512G内存',
        details: null
      },
      {
        id: 'PRD-HOST-002',
        tag: '80%',
        percentage: '80%',
        title: '智算型云主机 (64核)',
        description: '极致性能，满足大规模科学计算需求，64核CPU / 512G内存',
        details: null
      },
      {
        id: 'PRD-HOST-003',
        tag: '60%',
        percentage: '60%',
        title: '通用型云主机 (16核)',
        description: '高性价比，适用于Web应用、开发测试等，16核CPU / 64G内存',
        details: null
      }
    ],
    suggestionLabel: '您还可以',
    suggestions: [
      { text: '手工配置', url: '#' },
      { text: '查看更多主机', url: '#' }
    ]
  },
  {
    keyword: '智算型云主机配置',
    responseType: 'spec-list',
    content: '已为您生成智算型云主机配置单',
    data: {
      title: '智算型云主机',
      id: '新增',
      specs: [
        { name: '云主机 智算型 32vCPU 512GB内存' },
        { name: '云主机 智算型 64vCPU 512GB内存' }
      ]
    },
    suggestionLabel: '您还可以',
    suggestions: [
      { text: '加一个32核CPU256G内存规格', actionType: 'input', actionValue: '加一个32核CPU256G内存规格' }
    ]
  },
  {
    keyword: '通用型云主机新增',
    responseType: 'product-list',
    content: '根据您的要求为您查询出如下规格:',
    data: [
      {
        id: 'PRD-20260330-001',
        tag: '产品',
        percentage: '98%',
        title: '通用型云主机',
        description: '云主机 通用型 64vCPU 256GB内存',
        details: null
      },
      {
        id: 'PRD-20260330-001',
        tag: '产品',
        percentage: '85%',
        title: '通用型云主机',
        description: '云主机 通用型 64vCPU 128GB内存',
        details: null
      },
      {
        id: 'PRD-20260330-002',
        tag: '产品',
        percentage: '72%',
        title: '内存优化型云主机',
        description: '云主机 内存优化型型 64vCPU 16GB内存',
        details: null
      }
    ],
    suggestionLabel: '您还可以',
    suggestions: [
      { text: '选择产品', url: '#' }
    ]
  },
  {
    keyword: '商品新增',
    responseType: 'text',
    content: '好的，已为您开启商品配置流程。请关联产品并填写商品销售信息。',
    suggestions: [
      { text: '商品配置', url: '#' }
    ],
    suggestionLabel: '您还可以'
  },
  {
    keyword: '商品变更新增',
    responseType: 'text',
    content: '好的，已为您开启商品变更流程。请选择需要变更的商品并填写变更信息。',
    suggestions: [
      { text: '选择商品', url: '#' }
    ],
    suggestionLabel: '您还可以'
  },
  {
    keyword: '配置优惠',
    responseType: 'text',
    content: '好的，请输入您需要配置的优惠券信息，如名称，优惠额度、发放数量等，您也可以参照模板进行配置',
    suggestionLabel: '优惠券模板',
    suggestions: [
      { 
        text: '折扣券', 
        actionType: 'input', 
        actionValue: '名称：9折优惠券 优惠额度：9折 发放数量：1000' 
      },
      { 
        text: '满减券', 
        actionType: 'input', 
        actionValue: '名称：满100减20优惠券 优惠额度：满100减20 发放数量：500' 
      },
      { 
        text: '代金券', 
        actionType: 'input', 
        actionValue: '名称：50元代金券 优惠额度：50元 发放数量：200' 
      }
    ]
  },
  {
    keyword: '优惠额度',
    responseType: 'product-list',
    content: '根据您的要求为您查询出如下优惠券:',
    data: [
      {
        id: '315420014013',
        tag: '折扣券',
        percentage: '95%',
        title: '新年营销9折优惠券',
        description: '老用户续订9折优惠券，使用产品云主机',
        details: {
          code: '260107136712',
          name: '新年营销95折优惠券',
          effectiveDate: '2026-01-07 13:45:00',
          expiryDate: '2029-01-31 23:59:59',
          type: '折扣券',
          category: '大云优惠券',
          effectiveMode: '绝对时间',
          specification: '95%',
          totalPrice: '(元)',
          customerType: '全体客户',
          subscriptionTypes: '通用,订购,续订,变更,绑定',
          feeTypes: '包月,包年,按量（含话单）,一次性费用,包年一次性',
          quantity: '不限',
          project: '',
          amount: '无限制',
          ruleDetails: '',
          applicableProducts: [
            {
              name: '通用云主机系统盘带宽',
              id: '03e0a4a55dc74e21ba67ac9ebd4500c4',
              subName: '性能优化型系统盘',
              subId: '86549637736f3fa8eeb83e80edab2456',
              specName: '性能优化型系统盘'
            },
            {
              name: '通用云主机系统盘带宽',
              id: '03e0a4a55dc74e21ba67ac9ebd4500c4',
              subName: '通用型云主机',
              subId: 'fe0ca5a14938cfab007929bce91e06b9',
              specName: '华北-北京3 云主机 1vCP'
            }
          ]
        }
      },
      {
        id: '313320010612',
        tag: '折扣券',
        percentage: '80%',
        title: '双11活动9折优惠券',
        description: '双11新用户限定品类9折优惠券，使用产品云主机、云电脑',
        details: {
          code: '313320010612',
          name: '双11活动8折优惠券',
          effectiveDate: '2025-11-01 00:00:00',
          expiryDate: '2025-11-30 23:59:59',
          type: '折扣券',
          category: '大云优惠券',
          effectiveMode: '绝对时间',
          specification: '80%',
          totalPrice: '(元)',
          customerType: '新用户',
          subscriptionTypes: '订购',
          feeTypes: '包月,包年',
          quantity: '1',
          project: '双11活动',
          amount: '无限制',
          ruleDetails: '',
          applicableProducts: [
            {
              name: '云主机',
              id: '03e0a4a55dc74e21ba67ac9ebd4500c4',
              subName: '通用型云主机',
              subId: 'fe0ca5a14938cfab007929bce91e06b9',
              specName: '华北-北京3 云主机 2vCP'
            }
          ]
        }
      },
      {
        id: '313320010613',
        tag: '折扣券',
        percentage: '65%',
        title: '双11活动75折优惠券',
        description: '双11新用户限定品类9折优惠券，使用产品云硬盘',
        details: {
          code: '313320010613',
          name: '双11活动65折优惠券',
          effectiveDate: '2025-11-01 00:00:00',
          expiryDate: '2025-11-30 23:59:59',
          type: '折扣券',
          category: '大云优惠券',
          effectiveMode: '绝对时间',
          specification: '65%',
          totalPrice: '(元)',
          customerType: '新用户',
          subscriptionTypes: '订购',
          feeTypes: '包月,包年',
          quantity: '1',
          project: '双11活动',
          amount: '无限制',
          ruleDetails: '',
          applicableProducts: [
            {
              name: '云硬盘',
              id: '03e0a4a55dc74e21ba67ac9ebd4500c4',
              subName: '性能优化型系统盘',
              subId: '86549637736f3fa8eeb83e80edab2456',
              specName: '性能优化型系统盘'
            }
          ]
        }
      }
    ],
    suggestionLabel: '您还可以',
    suggestions: [
      { text: '手工配置', url: '#' }
    ]
  }
];

export const INFO_QUERY_CONTENT = `大云订单查询：查看[订单号/MOP用户编号/客户编号]订单信息
开放云订单查询：查看开放云[订单批次编号/订单号/MOP用户编号]订单信息
账单查询：查下【亚信科技】【近三个月】的账单
详单查询：查下【客户名称】【上个月】的详单
话单查询：查下【客户名称】【订购编码/订单项编码】【上个月】的话单
BOSS客户视图：查下【亚信科技】的客户信息
用户360视图：查询用户360视图
大云商品查询：查询【商品名称】的商品信息
开放云商品查询：查询开放云【商品名称】的商品信息
合营云商品查询：查询合营云【商品名称】的商品信息
集团客户黑名单：查询集团客户黑名单
互联网客户黑名单：查询互联网客户黑名单`;

export const DEFAULT_RESPONSE = '收到您的消息。作为您的业务助手，我正在为您处理中...';
export const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { text: '查产品政策', url: 'https://www.baidu.com' },
  { text: '优惠券配置', url: 'https://www.baidu.com' }
];
export const SUGGESTION_REDIRECT_URL = 'https://www.baidu.com';
export const CARD_DETAILS_REDIRECT_URL = 'https://msc-sooty.vercel.app';
export const TYPING_SPEED = 30; // ms per character
export const THINKING_TIME = 1000; // ms for "AI is thinking" state

export const COMMON_CONVERSATIONS: CommonConversation[] = [
  { id: '1', text: '介绍X11202101096003（极速型云电脑）的产品政策', isHot: true, category: '查询' },
  { id: '2', text: '给通用型云主机新增一个64核CPU256G内存的规格', isHot: true, category: '办理' },
  { id: '3', text: '新增优惠券，名称：9折优惠券 优惠额度：9折 发放数量：1000', isHot: true, category: '办理' },
  { id: '4', text: '查下【亚信科技】【近三个月】的账单', isHot: true, category: '查询' },
  { id: '5', text: '新增营销案 【营销案名称】【营销时间】【营销商品】', category: '办理' },
  { id: '6', text: '新增一个主机类产品测试产品，智算型云主机，一个32核CPU512G内存，一个64核CPU512G内存', category: '办理' },
  { id: '7', text: '查询本月流量使用情况', category: '查询' },
  { id: '8', text: '修改账号绑定手机号', category: '办理' },
  { id: '9', text: '申请发票开具流程', category: '查询' },
  { id: '10', text: '查看最近的优惠活动', category: '收藏' },
  { id: '11', text: '咨询人工客服', category: '其他' },
  { id: '12', text: '重置登录密码', category: '办理' },
  { id: '13', text: '查询历史订单记录', category: '查询' },
  { id: '14', text: '收藏的产品对比', category: '收藏' },
  { id: '15', text: '业务办理进度查询', category: '办理' },
  { id: '16', text: '流量包订购', category: '办理' },
  { id: '17', text: '话费余额查询', category: '查询' },
  { id: '18', text: '积分兑换礼品', category: '收藏' },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', title: '产商品配置介绍', icon: 'Package', color: 'bg-blue-50 text-blue-500', actionType: 'direct-response', actionValue: '产商品配置介绍' },
  { id: '2', title: '优惠券配置介绍', icon: 'Ticket', color: 'bg-orange-50 text-orange-500', actionType: 'direct-response', actionValue: '优惠券配置介绍' },
  { id: '3', title: '营销案配置介绍', icon: 'ShieldCheck', color: 'bg-emerald-50 text-emerald-500', actionType: 'input', actionValue: '产品政策' },
  { id: '4', title: '信息查询', icon: 'UserSearch', color: 'bg-sky-50 text-sky-500', actionType: 'input', actionValue: '信息查询' },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  { 
    id: 'c1', 
    title: '给极速型云主机配置一个...', 
    lastMessage: '好的，我已经为您准备好了...', 
    timestamp: Date.now(), 
    isPinned: false,
    messages: [
      { id: 'm1', role: 'user', content: '给极速型云主机配置一个9折优惠券', timestamp: Date.now() - 10000 },
      { id: 'm2', role: 'assistant', content: '好的，我已经为您准备好了优惠券配置方案。', timestamp: Date.now() - 5000 }
    ] 
  },
  { 
    id: 'c2', 
    title: '查看XXX近三个月的账单', 
    lastMessage: '账单查询结果如下...', 
    timestamp: Date.now() - 3600000, 
    isPinned: false,
    messages: [
      { id: 'm3', role: 'user', content: '查看XXX近三个月的账单', timestamp: Date.now() - 3610000 },
      { id: 'm4', role: 'assistant', content: '账单查询结果如下：本月消费 1200 元。', timestamp: Date.now() - 3605000 }
    ] 
  },
  { 
    id: 'c3', 
    title: '看下我有哪些待审批的工单', 
    lastMessage: '您目前有3个待审批工单...', 
    timestamp: Date.now() - 86400000, 
    isPinned: false,
    messages: [
      { id: 'm5', role: 'user', content: '看下我有哪些待审批的工单', timestamp: Date.now() - 86410000 },
      { id: 'm6', role: 'assistant', content: '您目前有3个待审批工单，请及时处理。', timestamp: Date.now() - 86405000 }
    ] 
  },
  { 
    id: 'c4', 
    title: '查询XXX集团的地址', 
    lastMessage: 'XXX集团位于...', 
    timestamp: Date.now() - 172800000, 
    isPinned: false,
    messages: [
      { id: 'm7', role: 'user', content: '查询XXX集团的地址', timestamp: Date.now() - 172810000 },
      { id: 'm8', role: 'assistant', content: 'XXX集团位于北京市海淀区。', timestamp: Date.now() - 172805000 }
    ] 
  },
];
