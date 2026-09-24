require("dotenv").config();
const postgres = require("postgres");

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const products = [
  {
    slug: "ovy-pads",
    name: "Ovy Organic Soft Pads",
    description:
      "Organic soft sanitary pads for lighter days, heavy days, and overnight coverage.",
    highlights: [
      "Rash-free cottony-soft top sheet",
      "Super-absorbent gel core",
      "Extra-wide wings",
      "Biodegradable disposal bags",
    ],
    allowCycleSync: true,
    allowSubscription: true,
    isMixBox: false,
    brand: "ovy",
    subscribeMonthlyDiscount: 15,
    subscribeBiMontlyDiscount: 12,
    cycleSyncDiscount: 15,
    maxQuantityPurchase: 6,
    freeShippingOver: 599,
    variants: [
      {
        sku: "OVY-PADS-L-25",
        name: "Ovy L Organic Soft Pads - 21 Pads + 4 Liners",
        price: 319,
        strikethroughPrice: 399,
        boxQuantity: 25,
        priority: 1,
        size: "L (240mm)",
        flowType: "Light Flow",
      },
      {
        sku: "OVY-PADS-XL-25",
        name: "Ovy XL Organic Soft Pads - 21 Pads + 4 Liners",
        price: 349,
        strikethroughPrice: 449,
        boxQuantity: 25,
        priority: 2,
        size: "XL (280mm)",
        flowType: "Medium to Heavy Flow",
      },
      {
        sku: "OVY-PADS-XLP-25",
        name: "Ovy XL+ Organic Soft Pads - 21 Pads + 4 Liners",
        price: 379,
        strikethroughPrice: 499,
        boxQuantity: 25,
        priority: 3,
        size: "XL+ (320mm)",
        flowType: "Super Heavy / Overnight",
      },
    ],
  },
  {
    slug: "ovy-liners",
    name: "Ovy Daily Liners",
    description:
      "Ultra-thin daily liners for everyday freshness, spotting, and very light discharge.",
    highlights: [
      "Ultra-thin everyday comfort",
      "Breathable cottony-soft top sheet",
      "Fragrance-free and dye-free",
      "Individually wrapped",
    ],
    allowCycleSync: false,
    allowSubscription: true,
    isMixBox: false,
    brand: "ovy",
    subscribeMonthlyDiscount: 15,
    subscribeBiMontlyDiscount: 12,
    cycleSyncDiscount: 0,
    maxQuantityPurchase: 6,
    freeShippingOver: 599,
    variants: [
      {
        sku: "OVY-LINERS-40",
        name: "Ovy Daily Liners - Pack of 40",
        price: 249,
        strikethroughPrice: 299,
        boxQuantity: 40,
        priority: 1,
        size: "Pack of 40",
        flowType: "Daily Freshness",
      },
      {
        sku: "OVY-LINERS-60",
        name: "Ovy Daily Liners - Pack of 60",
        price: 339,
        strikethroughPrice: 399,
        boxQuantity: 60,
        priority: 2,
        size: "Pack of 60",
        flowType: "Daily Freshness",
      },
      {
        sku: "OVY-LINERS-80",
        name: "Ovy Daily Liners - Pack of 80",
        price: 419,
        strikethroughPrice: 499,
        boxQuantity: 80,
        priority: 3,
        size: "Pack of 80",
        flowType: "Daily Freshness",
      },
    ],
  },
];

async function upsertProduct(item) {
  const [product] = await sql`
    insert into products (
      slug,
      name,
      description,
      banner_image,
      highlights,
      allow_cycle_sync,
      allow_subscription,
      is_mix_box,
      brand,
      subscribe_monthly_discount,
      subscribe_bi_montly_discount,
      cycle_sync_discount,
      max_quantity_purchase,
      free_shipping_over,
      updated_at
    )
    values (
      ${item.slug},
      ${item.name},
      ${item.description},
      ${null},
      ${item.highlights},
      ${item.allowCycleSync},
      ${item.allowSubscription},
      ${item.isMixBox},
      ${item.brand},
      ${item.subscribeMonthlyDiscount},
      ${item.subscribeBiMontlyDiscount},
      ${item.cycleSyncDiscount},
      ${item.maxQuantityPurchase},
      ${item.freeShippingOver},
      now()
    )
    on conflict (slug) do update set
      name = excluded.name,
      description = excluded.description,
      highlights = excluded.highlights,
      allow_cycle_sync = excluded.allow_cycle_sync,
      allow_subscription = excluded.allow_subscription,
      is_mix_box = excluded.is_mix_box,
      brand = excluded.brand,
      subscribe_monthly_discount = excluded.subscribe_monthly_discount,
      subscribe_bi_montly_discount = excluded.subscribe_bi_montly_discount,
      cycle_sync_discount = excluded.cycle_sync_discount,
      max_quantity_purchase = excluded.max_quantity_purchase,
      free_shipping_over = excluded.free_shipping_over,
      updated_at = now()
    returning id, slug
  `;

  for (const variant of item.variants) {
    await sql`
      insert into product_variants (
        product_id,
        sku,
        name,
        price,
        strikethrough_price,
        box_quantity,
        priority,
        banner_image,
        size,
        flow_type,
        is_in_stock,
        updated_at
      )
      values (
        ${product.id},
        ${variant.sku},
        ${variant.name},
        ${variant.price},
        ${variant.strikethroughPrice},
        ${variant.boxQuantity},
        ${variant.priority},
        ${null},
        ${variant.size},
        ${variant.flowType},
        ${true},
        now()
      )
      on conflict (sku) do update set
        product_id = excluded.product_id,
        name = excluded.name,
        price = excluded.price,
        strikethrough_price = excluded.strikethrough_price,
        box_quantity = excluded.box_quantity,
        priority = excluded.priority,
        size = excluded.size,
        flow_type = excluded.flow_type,
        is_in_stock = excluded.is_in_stock,
        updated_at = now()
    `;
  }

  return {
    slug: product.slug,
    id: product.id,
    variants: item.variants.length,
  };
}

(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing.");
  }

  const result = [];
  for (const item of products) {
    result.push(await upsertProduct(item));
  }

  console.log(JSON.stringify(result, null, 2));
  await sql.end();
})().catch(async (error) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});
