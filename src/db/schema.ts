import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  serial,
  integer,
  index,
  primaryKey,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const cancelRequestStatusEnum = pgEnum("cancel_request_status", [
  "pending",
  "approved",
  "rejected",
  "refunded",
]);

export const returnRequestStatusEnum = pgEnum("return_request_status", [
  "pending",
  "approved",
  "rejected",
  "refunded",
]);

export const subscriptionTypeEnum = pgEnum("subscription_type", [
  "monthly",
  "every_2_months",
  "cycle_sync",
]);

// ================= USERS =================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  cognitoId: text("cognito_id").notNull().unique(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 15 }).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  rewardOrderCoins: integer("reward_order_coins").default(0),
  referralCoins: integer("referral_coins").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewardCoinsHistory = pgTable("reward_coins_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  coins: integer("coins").notNull(),
  type: varchar("type"),
  orderId: uuid("order_id").references(() => order.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralCoinHistory = pgTable("referral_coin_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  coins: integer("coins").notNull(),
  type: varchar("type"),
  newUserName: varchar("new_user_name"),
  newUserId: uuid("new_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= ADDRESS =================

export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  streetAddress1: text("street_address_1"),
  streetAddress2: text("street_address_2"),
  city: varchar("city"),
  state: varchar("state"),
  pincode: varchar("pincode"),
  country: varchar("country"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= BLOG =================

export const blog = pgTable("blog", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  description: text("description"),
  metaTitle: varchar("meta_title"),
  metaDescription: varchar("meta_description"),
  blogCategory: varchar("blog_category"),
  image: varchar("image"),
  tags: varchar("tags").array(),
  data: text("data"),
  authorImage: varchar("author_image"),
  authorName: varchar("author_name"),
  slug: varchar("slug"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= CATEGORY =================

export const category = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  redirectSlug: varchar("redirect_slug"),
  bannerImage: varchar("banner_image"),
  description: varchar("description"),
  priority: integer("priority").default(1),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productBrandEnum = pgEnum("product_brand", ["ovy", "loway"]);

// ================= PRODUCT =================

export const product = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug").unique().notNull(),
    name: varchar("name"),
    description: varchar("description"),
    bannerImage: varchar("banner_image"),
    startingPrice: varchar("starting_price"),
    highlights: varchar("highlights").array(),
    allowCycleSync: boolean("allow_cycle_sync").default(false),
    allowSubscription: boolean("allow_subscription").default(false),
    isMixBox: boolean("is_mix_box").default(false),
    brand: productBrandEnum("brand").default("ovy"),
    custimizeBoxInfo: text("custimize_box_info"),
    priority: integer("priority").default(0),
    categoryId: uuid("category_id").references(() => category.id, {
      onDelete: "set null",
    }),
    subscribeMonthlyDiscount: integer("subscribe_monthly_discount").default(0),
    subscribeBiMontlyDiscount: integer("subscribe_bi_montly_discount").default(
      0,
    ),
    cycleSyncDiscount: integer("cycle_sync_discount").default(0),
    maxQuantityPurchase: integer("max_quantity_purchase").default(6),
    freeShippingOver: integer("free_shipping_over").default(599),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("name_idx").on(table.name),
    index("slug_idx").on(table.slug),
  ],
);

// ================= PRODUCT VARIANTS =================

export const productVariant = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),
  sku: varchar("sku").notNull().unique(),
  name: varchar("name").notNull(),
  price: integer("price").notNull(),
  strikethroughPrice: integer("strikethrough_price"),
  boxQuantity: integer("box_quantity"),
  priority: integer("priority").default(0),
  bannerImage: varchar("banner_image"),
  flowType: varchar("flow_type"),
  isInStock: boolean("is_in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ================= PRODUCT MEDIA =================

export const productMedia = pgTable("product_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  productVariantId: uuid("product_variant_id").references(
    () => productVariant.id,
    { onDelete: "cascade" },
  ),
  mediaType: varchar("media_type"),
  mediaURL: varchar("media_url"),
});

// ================= REVIEW =================

export const review = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  productId: uuid("product_id").references(() => product.id, {
    onDelete: "cascade",
  }),
  name: varchar("name"),
  rating: integer("rating"),
  message: varchar("message"),
  varient: varchar("varient"),
  isAdminApproved: boolean("is_admin_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= SUBSCRIPTIONS =================

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  productId: uuid("product_id").references(() => product.id, {
    onDelete: "set null",
  }),
  productVariantId: uuid("product_variant_id").references(
    () => productVariant.id,
    {
      onDelete: "set null",
    },
  ),
  orderId: uuid("order_id").references(() => order.id, {
    onDelete: "set null",
  }),

  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  frequencyInDays: integer("frequency_in_days"),

  nextOrderDate: timestamp("next_order_date"),
  subscriptionType: subscriptionTypeEnum("subscription_type"),

  chargeDate: timestamp("charge_date"),
  isActive: boolean("is_active").default(true),
});

// ================= CART =================

export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= CART ITEMS =================

export const cartItem = pgTable("cart_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .references(() => cart.id, { onDelete: "cascade" })
    .notNull(),

  productId: uuid("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),

  productVariantId: uuid("product_variant_id").references(
    () => productVariant.id,
    { onDelete: "cascade" },
  ),
  quantity: integer("quantity").default(1),
  mixBoxRecipe: jsonb("mix_box_recipe"),

  totalPads: integer("total_pads"),
  boxCount: integer("box_count"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= wishlist =================

export const wishlist = pgTable("wishlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= wishlist ITEMS =================

export const wishlistItem = pgTable("wishlist_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  wishlistId: uuid("wishlist_id").references(() => wishlist.id, {
    onDelete: "cascade",
  }),
  productId: uuid("product_id").references(() => product.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "returned",
  "failed",
]);

// ================= ORDER =================

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").default("pending"),

  addressLine1: varchar("address_line_1"),
  addressLine2: varchar("address_line_2"),
  city: varchar("city"),
  state: varchar("state"),
  pincode: varchar("pincode"),
  totalAmount: integer("total_amount"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ================= ORDER ITEM =================

export const orderItem = pgTable("order_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => order.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id").references(
    () => productVariant.id,
    {
      onDelete: "cascade",
    },
  ),
  quantity: integer("quantity"),
  mixBoxRecipe: jsonb("mix_box_recipe"),
  totalPads: integer("total_pads"),
  boxCount: integer("box_count"),
  freeLiners: integer("free_liners"),

  productVarientName: varchar("product_varient_name"),
  productVarientSlug: varchar("product_varient_slug"),
  productVarientImage: varchar("product_varient_image"),
  productVarientPrice: integer("product_varient_price"),
  productVarientSKU: varchar("product_varient_sku"),
});

// ================= PAYMENT =================

export const payment = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => order.id, {
    onDelete: "set null",
  }),
  gatewayOrderId: varchar("gateway_order_id"),
  gatewayPaymentId: varchar("gateway_payment_id"),
  gatewayTransactionId: varchar("gateway_transaction_id"),
  paymentStatus: varchar("payment_status"),
  modeOfPayment: varchar("mode_of_payment"),
  amount: integer("amount"),
  paymentMeta: jsonb("payment_meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const razorpayWebhookEvent = pgTable("razorpay_webhook_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: varchar("event_id").notNull().unique(),
  eventName: varchar("event_name").notNull(),
  paymentId: varchar("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

//================cancel req============

export const orderRequestType = pgEnum("order_request_type", [
  "cance_order",
  "return_order",
]);

export const orderRequestStatusEnum = pgEnum("order_request_status", [
  "pending",
  "cancelled",
  "approved",
  "refunded",
]);

export const orderAction = pgTable("order_action", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "set null" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  requestType: orderRequestType("request_type").notNull(),
  userReason: text("user_reason"),
  adminReason: text("admin_reason"),
  status: orderRequestStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderActionImage = pgTable("order_action_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderActionId: uuid("order_action_id")
    .notNull()
    .references(() => orderAction.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentGatewayPlans = pgTable("payment_gateway_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  price: integer("price").notNull(),
  descirption: varchar("descirption"),
  billingFrequency: varchar("billing_frequency").notNull(),
  gatewayPlanId: varchar("gateway_plan_id").notNull().unique(),
  frequencyType: subscriptionTypeEnum("frequency_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentGatewaySubscription = pgTable(
  "payment_gateway_subscription",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    subscriptionId: integer("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    gatewaySubscriptionId: varchar("gateway_subscription_id").notNull(),
    planId: varchar("plan_id")
      .notNull()
      .references(() => paymentGatewayPlans.gatewayPlanId, {
        onDelete: "no action",
      }),
    totalCount: integer("total_count"),
    remainingCount: integer("remaining_count"),
    quantity: integer("quantity"),
    customerNotify: boolean("customer_notify").default(false),
    startAt: timestamp("start_at"),
    expireBy: timestamp("expire_by"),

    startDate: timestamp("start_date").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

// ================= Coupon =================

export const coupon = pgTable("coupon", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 20 }).notNull(),
  description: varchar("description", { length: 100 }),
  code: varchar("code", { length: 20 }).notNull().unique(),
  isDiscountPercentage: boolean("is_discount_percentage")
    .notNull()
    .default(false),
  discountPercentage: integer("discount_percentage"),
  discountFixedAmount: integer("discount_fixed_amount"),
  minimumOrderValue: integer("minimum_order_value").notNull().default(0),
  maximumDiscountAmount: integer("maximum_discount_amount")
    .notNull()
    .default(0),
  useOnce: boolean("use_once").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const couponTransaction = pgTable("coupon_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  couponId: uuid("coupon_id").references(() => coupon.id, {
    onDelete: "set null",
  }),
  code: varchar("code", { length: 20 }).notNull(),
  discountedAmount: integer("discounted_amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactUs = pgTable("contact_us", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  email: varchar("email"),
  phone: varchar("phone"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= PRODUCT FAQ =================

export const productFaq = pgTable("product_faq", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),
  priority: integer("priority").notNull().default(0),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
