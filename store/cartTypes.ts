import type {
  MixBoxRecipe,
  PurchaseType,
  SubscriptionType,
} from "@/lib/mixYourBox";
import type { YatraKitCartItem } from "@/lib/yatraKit";

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
  variantName?: string;
  image: string;
  price: number;          
  originalPrice?: number; 
  quantity: number;
  cartSizes?: any[];
  mixBoxRecipe?: MixBoxRecipe;
  totalPads?: number;
  boxCount?: number;
  freeLiners?: number;
  yatraKit?: YatraKitCartItem;
  purchaseType?: PurchaseType;
  subscriptionType?: SubscriptionType;
  selectedPlan?: any;
  isSubscribed?: boolean;
  cycleSync?: {
    lastPeriodDate?: string;
    nextPeriodDate?: string;
    cycleLength: number | string;
    periodLength?: number | string;
    consentAccepted?: boolean;
  };
  isQuantityChangable?: boolean;
  addedAt: number;
  uuid?: string; 
};

export type CartCoupon = {
  id?: string;
  name?: string;
  code: string;
  description?: string | null;
  isDiscountPercentage?: boolean;
  discountPercentage?: number | null;
  discountFixedAmount?: number | null;
  minimumOrderValue?: number | null;
  maximumDiscountAmount?: number | null;
  discount?: number;
};
