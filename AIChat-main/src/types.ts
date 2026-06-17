export interface Suggestion {
  text: string;
  url?: string;
  actionType?: 'input' | 'link' | 'direct-response';
  actionValue?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'card' | 'query-buttons' | 'direct-response' | 'product-list' | 'spec-list' | 'product-config-list' | 'coupon-config-card' | 'detailed-bill' | 'call-log' | 'import-confirm-prompt' | 'risk-confirm' | 'marketing-recommendation';
  data?: any;
  detailsUrl?: string;
  suggestions?: Suggestion[];
  suggestionLabel?: string;
  timestamp: number;
  isComplete?: boolean;
}

export interface CallLogItem {
  callLogName: string;
  serialNumber: string;
  customerCode: string;
  billingDate: string;
  orderCode: string;
  productCode: string;
  tariffCode: string;
  tariffSubject: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: string;
  unitPrice: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
  isPinned?: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  actionType?: 'input' | 'link' | 'direct-response';
  actionValue?: string;
}

export interface ApplicableProduct {
  name: string;
  id: string;
  subName: string;
  subId: string;
  specName: string;
}

export interface MarketingStrategyDetail {
  id: string;
  basicInfo: {
    name: string;
    category: string;
    subCategory: string;
    startTime: string;
    endTime: string;
    province: string;
    operatorNames: string;
    campaignCode: string;
    campaignName: string;
    city: string;
    description: string;
    decisionBasis: string;
  };
  locationInfo: {
    code: string;
    name: string;
  };
  ruleInfo: {
    usageLimit: string;
    receiveLimit: string;
    totalLimitEnabled: string;
    quantity: string;
    discountValue: string;
    authStartTime: string;
  };
  languageInfo: {
    content: string;
    reminderTemplateCode: string;
  };
}

export interface CouponStrategy {
  name: string;
  decisionBasis: string;
  customerGroupName: string;
  quantity: string;
  campaign: string;
  position: string;
  status: string;
}

export interface CouponDetail {
  code: string;
  name: string;
  effectiveDate: string;
  expiryDate: string;
  type: string;
  category: string;
  effectiveMode: string;
  specification: string;
  totalPrice: string;
  customerType: string;
  subscriptionTypes: string;
  feeTypes: string;
  quantity: string;
  project: string;
  amount: string;
  ruleDetails: string;
  applicableProducts: ApplicableProduct[];
  strategies?: CouponStrategy[];
}

export interface DetailedBillItem {
  billingPeriod: string;
  customerName: string;
  orderAccountName: string;
  productName: string;
  billingScenario: string;
  unitPrice: string;
  usage: string;
  usageUnit: string;
  serviceDuration: string;
  durationUnit: string;
  catalogAmount: string;
  discountAmount: string;
  receivableAmount: string;
}

export interface Coupon {
  id: string;
  tag: string;
  percentage?: string;
  title: string;
  description: string;
  details?: CouponDetail;
}
