import { User2 } from "lucide-react";

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "semi-stitched"];
export const MATERIALS = ["Cotton", "Wool", "Silk", "Leather", "Linen"];

export const moreSidebarCategories = [
  {
    id: 11,
    name: "Clearance",
    slug: "clearance",
  },
];

export const CATEGORY_2 = [
  {
    id: "7f5a8f99-fbdc-472b-b43a-cc9dc12e1ddd",
    name: "Summer Vibes",
    slug: "summer-vibes",
    image: "/categoryimage.png",
  },
  {
    id: "cbaf4d2b-9fd2-465b-b55e-9c8734ae2eee",
    name: "Trendy",
    slug: "trendy",
    image: "/categoryimage.png",
  },
  {
    id: "52b3df7c-e8b5-4f4a-b2c7-8423dd0f4fff",
    name: "Festival Season",
    slug: "festival-season",
    image: "/categoryimage.png",
  },
  {
    id: "9f2ce7f1-43aa-4a0d-8cfa-b7dc12ab1aaa",
    name: "Casual",
    slug: "casual",
    image: "/categoryimage.png",
  },
];

export const quizQuestions = [
  {
    id: 1,
    question: "What describe your flow ?",
    options: [
      { icon: User2, label: "light flow", slug: "ligth_flow" },
      { icon: User2, label: "medium flow", slug: "medium_flow" },
      { icon: User2, label: "heavy flow", slug: "heavy_flow" },
      { icon: User2, label: "Unsure", slug: "unsure" },
    ],
  },
  {
    id: 2,
    question: "Do you experience cramps or discomfort?",
    options: [
      { icon: User2, label: "No Discomfort", slug: "no_discomfort" },
      { icon: User2, label: "Mild Discomfort", slug: "mild_discomfort" },
      { icon: User2, label: "Severe Cramps", slug: "severe_cramps" },
      { icon: User2, label: "Varies", slug: "varies" },
    ],
  },
  {
    id: 3,
    question: "What is your preferred material for period products?",
    options: [
      { icon: User2, label: "Cotton", slug: "organic_cotton" },
      { icon: User2, label: "Synthetic Blend", slug: "synthetic_blend" },
      {
        icon: User2,
        label: "Medical Grade Silicon",
        slug: "medical_grade_silicon",
      },
      { icon: User2, label: "Unsure", slug: "unsure" },
    ],
  },
  {
    id: 4,
    question:
      "Do you have any allergies or sensitivities to certain materials?",
    options: [
      { icon: User2, label: "No Allergies", slug: "no_allergies" },
      { icon: User2, label: "Sensitive Skin", slug: "sensitive_skin" },
      { icon: User2, label: "Allergic Reactions", slug: "allergic_reactions" },
      { icon: User2, label: "Not Sure", slug: "not_sure" },
    ],
  },
];

export const pageSize = 10;
// export const tempUserId = "c263327b-3958-4fe8-b0b9-1ca3711f7c9c"
// export const tempUserId = userId
export const canResendOTPInterval = 10; // in seconds
export const isUUID = (identifier: string) =>
  /^[0-9a-fA-F-]{36}$/.test(identifier);

export const tempUserId = "63089f34-5276-481f-bc92-f75ff1ad24a5";
export const bestSellingSlug = "best-selling-products";
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CategorySection = {
  type: "proudcts";
  props: {
    title: string;
    description: string;
    limit: number;
  };
};

type StorySection = {
  type: "story";
  props: {
    badgeText: string;
    title: string;
    highlight: string;
    image: string;
    primaryColor: string;
    gradientFrom: string;
    gradientTo: string;
    bgAccent: string;
    paragraphs: string[];
  };
};

type Props = {
  title?: string;
  bgColor?: string;
  buttonVariant?: "default" | "outline";
  buttonColor?: string;
};

type ProductSection = {
  type: "products" | "newArrivals";
  props: any;
  paragraphs?: string[];
};

type StatsSection = {
  type: "stats";
  props: {
    image: string;
  };
};

type BrandWhySection = {
  type: "brandWhy";
  props: {
    title: string;
    subtitle: string;
    primaryColor: string;
  };
};

type ourStory = {
  badgeText: string;
  title: string;
  highlight: string;
  paragraphs: string[];
  image: string;
  primaryColor: string;
  gradientFrom: string;
  gradientTo: string;
  bgAccent: string;
  tickerText: string;
  tickerColor?: string;
};

type OurStorySection = {
  type: "ourStory";
  props: ourStory;
};

type InstagramSectionProps = {
  title: string;
  username: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  buttonColor: string;
};

type InstagramSection = {
  type: "instagram";
  props: InstagramSectionProps;
};

type TestimonialsSection = {
  type: "testimonials";
  props: {
    primaryColor: string;
    bgColor: string;
  };
};

type NewsletterSection = {
  type: "newsletter";
  props: {
    buttonColor: string;
    overlayColor: string;
  };
};

type ProductCategoriesSection = {
  type: "productCategories";
};

type BlogSection = {
  type: "blog";
};
type BannerImage = {
  type: "bannerImage";
  props: {
    image: string;
  };
};

type Section =
  | CategorySection
  | StorySection
  | ProductSection
  | OurStorySection
  | StatsSection
  | BrandWhySection
  | InstagramSection
  | TestimonialsSection
  | NewsletterSection
  | ProductCategoriesSection
  | BannerImage
  | BlogSection;

export const brandDataMap: Record<
  string,
  {
    "bg-color": string;
    hero: any;
    sections: Section[];
  }
> = {
  ovy: {
    "bg-color": "#FFF4F9",
    hero: {
      logo: "/ovy-main.png",
      title: "Gentle Care, Beautiful You",
      subtitle:
        "Premium, dermatologically-tested products with soothing lavender essence for sensitive skin and everyday comfort.",
      // description: "Soothing lavender essence",
      bgImage: "/ovy-bg.png",
      primaryColor: "#AF71A7",
      secondaryColor: "#FFFFFF4F",
      opacity: 0.3,
    },

    sections: [
      {
        type: "proudcts",
        props: {
          title: "Shop Ovy Products",
          description:
            "Designed for growing teens, our menstrual hygiene range offers gentle protection, breathable comfort, and reliable leak security. Feel confident, fresh, and supported through every stage of your cycle.",
          limit: 4,
        },
      },
      {
        type: "bannerImage",
        props: {
          image:
            "https://dw0n4qiceose7.cloudfront.net/website-images/teen_pack_banner.png",
        },
      },
      {
        type: "story",
        props: {
          badgeText: "Own Your Cycle",
          title: "The",
          highlight: "Nakd",
          image: "/thestory.png",
          primaryColor: "#AF71A7",
          gradientFrom: "#C08497",
          gradientTo: "#F9A8D4",
          bgAccent: "#FCE7F3",
          paragraphs: [
            `Good hygiene is not just about routine — it’s about feeling comfortable, confident, and cared for every single day. At Potent Hygiene, we believe personal care should be simple, honest, and empowering.

Our goal is to make hygiene conversations normal and accessible by providing products and information that support everyday well-being. Whether it’s daily freshness, intimate care, or overall hygiene, we focus on solutions that respect your body and your lifestyle.`,
          ],
        },
      },
      {
        type: "products",
        props: {
          title: "Best Selling Products",
          description:
            "Discover the latest additions to our premium hygiene collection, thoughtfully designed for everyday comfort, care, and confidence.",
          primaryColor: "#AF71A7",
          gradientFrom: "#C08497",
          gradientTo: "#F9A8D4",
          bgAccent: "#FCE7F3",
        },
      },
      {
        type: "ourStory",
        props: {
          badgeText: "Our Story",
          tickerColor: "",
          title: "Built for Women,",
          highlight: "By Women",
          image:
            "https://dw0n4qiceose7.cloudfront.net/website-images/ovy_session_banner-1.jpg",
          primaryColor: "#AF71A7",
          gradientFrom: "#C08497",
          gradientTo: "#F9A8D4",
          bgAccent: "#FCE7F3",
          tickerText: "Ovy - Where Your Wellness Comes First",
          paragraphs: [
            `Ovy was created for women who seek gentle, premium care. Infused with natural lavender essence and crafted with the softest materials, every product is designed to pamper and protect.`,
            `Our mission is to deliver dermatologically-tested, premium hygiene products that combine gentle care with elegant comfort for sensitive skin.`,
          ],
        },
      },
      {
        type: "newArrivals",
        props: {
          title: "New Arriving Products",
          description:
            "Discover the latest additions to our premium hygiene collection, thoughtfully designed for everyday comfort, care, and confidence.",
          primaryColor: "#AF71A7",
          gradientFrom: "#C08497",
          gradientTo: "#F9A8D4",
          bgAccent: "#FCE7F3",
        },
      },
      {
        type: "stats",
        props: {
          image:
            "https://dw0n4qiceose7.cloudfront.net/website-images/ovy_banner_2+(1).png",
        },
      },
      {
        type: "brandWhy",
        props: {
          title: "Why Choose Ovy?",
          subtitle:
            "We're committed to providing products that care for you and the planet. Here's what makes us different through quality, innovation, and trusted care.",
          primaryColor: "#AF71A7",
        },
      },
      {
        type: "instagram",
        props: {
          title: "Join Our Community",
          username: "@potenthygiene",
          gradientFrom: "#C08497",
          gradientTo: "#A78BFA",
          textColor: "#FFFFFF",
          buttonColor: "#AF71A7",
        },
      },
      {
        type: "testimonials",
        props: {
          primaryColor: "#AF71A7",
          bgColor: "#FCE7F3",
        },
      },
      { type: "productCategories" },
      {
        type: "newsletter",
        props: {
          buttonColor: "#AF71A7",
          overlayColor: "rgba(0,0,0,0.5)",
        },
      },
      {
        type: "blog",
      },
    ],
  },

  loway: {
    "bg-color": "#F8F6F1",
    hero: {
      logo: "/loway-main.png",
      title: "Bright Comfort, Every Day",
      subtitle:
        "Experience premium hygiene essentials designed for comfort, freshness, and sustainability. Feel confident at home, work, or on the go.",
      bgImage: "/loway-bg.png",
      primaryColor: "#016271",
      secondaryColor: "#F6DC52",
    },

    sections: [
      {
        type: "proudcts",
        props: {
          title: "Shop Loway Products",
          description:
            "Shop innovative hygiene essentials that combine premium quality with everyday comfort. Whether at home or on the go, Loway helps you stay fresh, protected, and confident every day.",
          limit: 4,
        },
      },
      {
        type: "story",
        props: {
          badgeText: "Own Your Cycle",
          title: "The",
          highlight: "Nakd",
          image: "/loway-story.png",
          primaryColor: "#FACC15",
          gradientFrom: "#016171",
          gradientTo: "#B1D7DE",
          bgAccent: "#FEF9C3",
          paragraphs: [
            `Good hygiene is not just about routine — it’s about feeling comfortable, confident, and cared for every single day. At Potent Hygiene, we believe personal care should be simple, honest, and empowering.

Our goal is to make hygiene conversations normal and accessible by providing products and information that support everyday well-being. Whether it’s daily freshness, intimate care, or overall hygiene, we focus on solutions that respect your body and your lifestyle.`,
          ],
        },
      },
      {
        type: "products",
        props: {
          title: "Best Selling Products",
          description:
            "Discover the latest additions to our premium hygiene collection, thoughtfully designed for everyday comfort, care, and confidence.",
          bgColor: "",
          buttonColor: "",
        },
      },
      {
        type: "ourStory",
        props: {
          badgeText: "Our Story",
          title: "Built for Women,",
          highlight: "By Women",
          image: "/our-story-loway.png",
          primaryColor: "#FACC15",
          gradientFrom: "#016171",
          gradientTo: "#B1D7DE",
          bgAccent: "#FEF9C3",
          tickerText: "Loway - Where Your Wellness Comes First",
          tickerColor: "#016271",
          paragraphs: [
            `Looway was created for women who seek gentle, premium care. Infused with natural lavender essence and crafted with the softest materials, every product is designed to pamper and protect.`,
            `Our mission is to deliver dermatologically-tested, premium hygiene products that combine gentle care with elegant comfort for sensitive skin.`,
          ],
        },
      },
      {
        type: "newArrivals",
        props: {
          title: "New Arriving Products",
          description:
            "Discover our range of premium feminine hygiene products, thoughtfully crafted for your comfort, wellness, confidence, and everyday intimate care.",
          primaryColor: "#AF71A7",
          gradientFrom: "#C08497",
          gradientTo: "#F9A8D4",
          bgAccent: "#FCE7F3",
        },
      },
      {
        type: "stats",
        props: {
          image: "",
        },
      },
      {
        type: "brandWhy",
        props: {
          title: "Why Choose Loway?",
          subtitle:
            "We're committed to providing products that care for you and the planet. Here's what makes us different through quality, innovation, and trusted care.",
          primaryColor: "#3B82F6",
        },
      },
      {
        type: "instagram",
        props: {
          title: "Join Our Community",
          username: "@potenthygiene",
          gradientFrom: "#F6DC52",
          gradientTo: "#FFF7CB",
          textColor: "#1F2937",
          buttonColor: "#1F2937",
        },
      },
      {
        type: "testimonials",
        props: {
          primaryColor: "#3B82F6",
          bgColor: "#EFF6FF",
        },
      },
      {
        type: "productCategories",
      },
      {
        type: "newsletter",
        props: {
          buttonColor: "#016271",
          overlayColor: "rgba(0,0,0,0.3)",
        },
      },
      {
        type: "blog",
      },
    ],
  },
};

export const BrandProductColors = {
  ovy: "#AF71A7",
  loway: "#F6DC52",
};

export const subscriptionPlans = [
  {
    id: "monthly",
    label: "Monthly Subscription",
    discountPercentage: 15,
    period: 1,
    subscriptionType: "monthly",
  },
  {
    id: "every_2_months",
    label: "Every 2 Months",
    discountPercentage: 12,
    period: 2,
    subscriptionType: "every_2_months",
  },
  {
    id: "cycle_sync",
    label: "Cycle Sync",
    discountPercentage: 15,
    period: null,
    subscriptionType: "cycle_sync",
    isRecomended: true,
  },
];

export const ovyProductDetailsPage = {
  lightColor: "#FBF1FB",
  darkColor: "#B076A8",
  productDescription: "#EFEDE0",
  textColor: "#374151",
  // rating:"#EFEDE0",
  // imageBg:"#DDC0DC"
};

export const lowayProductDetailsPage = {
  lightColor: "#fffad6",
  darkColor: "#F6DC52",
  productDescription: "#EFEDE0",
  textColor: "#374151",
  // rating:"#EFEDE0",
  // imageBg:"#F6DC52"
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELED: "cancelled",
  RETURNED: "returned",
  FAILED: "failed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_ITEMS = [
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.PAID, label: "Paid" },
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUS.COMPLETED, label: "Completed" },
  { value: ORDER_STATUS.CANCELED, label: "Cancelled" },
  { value: ORDER_STATUS.RETURNED, label: "Returned" },
  { value: ORDER_STATUS.FAILED, label: "Failed" },
];

// Static configuration for Looway Yatra Kit Builder
export const YATRA_KIT_CATALOG = [
  {
    id: "seat",
    name: "Toilet Seat Covers",
    unit: "pack of 25",
    price: 199,
    max: 6,
    art: "seat",
    blurb: "Clean cover for dirty Western seats.",
  },
  {
    id: "pp",
    name: "Pee & Puke Bags",
    unit: "pack of 10",
    price: 499,
    max: 6,
    art: "bag",
    blurb: "For when there's no toilet at all.",
  },
  {
    id: "funnel",
    name: "Pee Funnel",
    unit: "1 reusable",
    price: 299,
    max: 3,
    art: "funnel",
    women: true,
    blurb: "Pee standing at squat toilets.",
  },
  {
    id: "wipes",
    name: "Intimate Wipes",
    unit: "10 wipes",
    price: 0,
    free: true,
    art: "intw",
    blurb: "pH-balanced. Free with every kit.",
  },
  {
    id: "pads",
    name: "Ovy Pads",
    unit: "pack of 21",
    price: 319,
    max: 4,
    art: "pad",
    women: true,
    blurb: "Ultra-thin cover for your flow.",
    variants: [
      { id: "l", label: "L", price: 319 },
      { id: "xl", label: "XL", price: 349 },
      { id: "xlp", label: "XL+", price: 379 },
    ],
  },
  {
    id: "panty",
    name: "Ovy Super Slim Period Panties",
    unit: "pack of 8",
    price: 349,
    max: 4,
    art: "panty",
    women: true,
    blurb: "Leak-resistant, disposable.",
    variants: [
      { id: "lxl", label: "M-XL", price: 349 },
      { id: "xxl3xl", label: "XXL-XXXL", price: 349 },
    ],
  },
  {
    id: "liner",
    name: "Ovy Panty Liners",
    unit: "pack of 20",
    price: 149,
    max: 4,
    art: "liner",
    women: true,
    blurb: "Everyday freshness.",
  },
  {
    id: "cup",
    name: "Ovy Menstrual Cup",
    unit: "1 reusable",
    price: 399,
    max: 2,
    art: "cup",
    women: true,
    blurb: "One cup, the whole trip.",
  },
] as const;

export const YATRA_KIT_TIERS = [
  {
    id: "complete",
    name: "Complete",
    tag: "Every situation",
    ic: "plane",
    best: true,
    aud: "all",
    base: { seat: 1, pp: 1, funnel: 1 },
  },
  {
    id: "weekender",
    name: "Weekender",
    tag: "Solo · short trip",
    ic: "drive",
    aud: "all",
    base: { seat: 1, pp: 1 },
  },
  {
    id: "family",
    name: "Family",
    tag: "Group · long trip",
    ic: "heart",
    aud: "all",
    base: { seat: 2, pp: 2, funnel: 1 },
  },
  {
    id: "girls",
    name: "Girls' Trip",
    tag: "Girls only",
    ic: "girls",
    aud: "women",
    base: { seat: 2, funnel: 1, "pads:l": 1, liner: 1 },
  },
  {
    id: "boys",
    name: "Boys' Trip",
    tag: "Mates' getaway",
    ic: "boys",
    aud: "men",
    base: { seat: 1, pp: 2 },
  },
  {
    id: "teerth",
    name: "Teerth Yatra",
    tag: "Pilgrimages",
    ic: "temple",
    aud: "all",
    base: { seat: 2, funnel: 1, pp: 1 },
  },
  {
    id: "preg",
    name: "Pregnancy Travel",
    tag: "Mums-to-be",
    ic: "preg",
    aud: "women",
    exclude: ["cup"],
    base: { seat: 1, funnel: 1, pp: 1, liner: 1 },
  },
  {
    id: "toddler",
    name: "Toddler Travel",
    tag: "With little ones",
    ic: "baby",
    aud: "all",
    base: { seat: 2, pp: 1 },
  },
  {
    id: "working",
    name: "Working Woman",
    tag: "Office & commutes",
    ic: "access",
    aud: "women",
    base: { seat: 1, "pads:l": 1, liner: 1 },
  },
  {
    id: "sports",
    name: "Sports & Adventure",
    tag: "Treks & outdoors",
    ic: "mountain",
    aud: "all",
    base: { seat: 1, funnel: 1, pp: 2 },
  },
  {
    id: "carekit",
    name: "Care & Recovery",
    tag: "Hospital & caregiving",
    ic: "cross",
    aud: "all",
    base: { seat: 2, pp: 2 },
  },
] as const;
