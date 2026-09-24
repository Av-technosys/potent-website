import type {
  MixBoxRecipe,
  PurchaseType,
  SubscriptionType,
} from "@/lib/mixYourBox";

export type CartAttribute = {
  attribute: string; 
  value: string;    
};

export type CartItem = {
  productId: string;
  productVariantId?: string;
  sku?: string;
  slug: string;
  title: string;
  image: string;
  price: number;          
  originalPrice?: number; 
  quantity: number;
  cartSizes?: any[];
  mixBoxRecipe?: MixBoxRecipe;
  totalPads?: number;
  boxCount?: number;
  freeLiners?: number;
  purchaseType?: PurchaseType;
  subscriptionType?: SubscriptionType;
  selectedPlan?: any;
  isSubscribed?: boolean;
  cycleSync?: {
    nextPeriodDate: string;
    cycleLength: number;
  };
  isQuantityChangable?: boolean;
  addedAt: number;
  uuid?: string; 
};
