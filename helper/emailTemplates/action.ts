"use server";

import { userSubjects } from "@/emails/subjects/userSubjects";
import { sendTemplateEmail } from "@/lib/email";

type TemplateData = Record<string, string | number | null | undefined>;

type SendResult =
  | { success: true; result: Awaited<ReturnType<typeof sendTemplateEmail>> }
  | { success: false; error: unknown };

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "";
}

function withLegacyKeys(data: TemplateData = {}) {
  return {
    ...data,
    "Customer First Name": data.firstName ?? data.name,
    "Order ID": data.orderId,
    "Order Date": data.orderDate,
    "Product Names": data.productNames ?? data.products,
    "Order Total": data.amount,
    "Courier Name": data.courierName,
    "Tracking Number": data.trackingNumber ?? data.orderId,
    "Tracking Link": data.trackingUrl,
    "Review Link": data.reviewLink,
    "Shop Link": data.shopLink,
    "Subscription Link": data.subscriptionLink,
    "Last Purchased Products": data.products,
    "Last Order Date": data.orderDate,
    "Reorder Link": data.reorderLink,
    "Delivery Date": data.deliveryDate,
    "Checkout Link": data.checkoutLink,
    "Order Status": data.status,
    "Status Message": data.message,
  };
}

function sendUserTemplateEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string;
  subject: string;
  template: string;
  data?: TemplateData;
}) {
  return sendTemplateEmail({
    to,
    subject,
    type: "user",
    template,
    data: withLegacyKeys({
      baseUrl: getBaseUrl(),
      email: to,
      ...data,
    }),
  });
}

function sendGenericTemplateEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string;
  subject: string;
  template: string;
  data?: TemplateData;
}) {
  return sendTemplateEmail({
    to,
    subject,
    type: "generic",
    template,
    data: withLegacyKeys({
      baseUrl: getBaseUrl(),
      email: to,
      ...data,
    }),
  });
}

async function sendSafely(send: () => ReturnType<typeof sendTemplateEmail>): Promise<SendResult> {
  try {
    const result = await send();

    return { success: true, result };
  } catch (error) {
    console.error("SES Email Error:", error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  firstName: string,
  orderId: string,
  orderDate: string,
  amount: string | number,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.orderConfirmation,
      template: "orderConfirmation",
      data: {
        firstName,
        orderId,
        orderDate,
        amount,
      },
    }),
  );
}

export async function sendFirstPurchaseEmail(email: string, firstName: string) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.firstPurchase,
      template: "firstPurchase",
      data: { firstName },
    }),
  );
}

export async function sendNewsletterEmail(
  email: string,
  firstName: string,
  shopLink: string,
  subscriptionLink: string = "https://www.potenthygiene.com/subscribe",
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.newsletter,
      template: "newsletter",
      data: {
        firstName,
        shopLink,
        subscriptionLink,
      },
    }),
  );
}

export async function sendUserExperienceEmail(
  email: string,
  firstName: string,
  reviewLink: string,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.userExperience,
      template: "userExperience",
      data: {
        firstName,
        reviewLink,
      },
    }),
  );
}

export async function sendShippingConfirmationEmail(
  email: string,
  orderId: string | number,
  firstName: string,
  trackingUrl: string,
  courierName: string,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.shippingConfirmation,
      template: "shippingConfirmation",
      data: {
        firstName,
        orderId,
        trackingUrl,
        courierName,
        trackingNumber: orderId,
      },
    }),
  );
}

export async function sendrefillReminderEmail(
  email: string,
  firstName: string,
  order: string | number,
  products: string | number,
  orderDate: string,
  reorderLink: string,
  SubscriptionLink: string,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.refillReminder,
      template: "refillReminder",
      data: {
        firstName,
        orderId: order,
        products,
        orderDate,
        reorderLink,
        subscriptionLink: SubscriptionLink,
      },
    }),
  );
}

export async function sendRefillReminderEmail(
  email: string,
  firstName: string,
  order: string | number,
  products: string | number,
  orderDate: string,
  reorderLink: string,
  subscriptionLink: string,
) {
  return sendrefillReminderEmail(
    email,
    firstName,
    order,
    products,
    orderDate,
    reorderLink,
    subscriptionLink,
  );
}

export async function sendDeliveryConfirmationEmail(
  email: string,
  firstName: string,
  orderId: string,
  deliveryDate: string,
  reviewLink: string,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.deliveryConfirmation,
      template: "deliveryConfirmation",
      data: {
        firstName,
        orderId,
        deliveryDate,
        reviewLink,
      },
    }),
  );
}

export async function sendCartAbandonmentEmail(
  email: string,
  firstName: string,
  productNames: TemplateData[string],
  checkoutLink: string,
  reviewLink: string,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.cartAbandonment,
      template: "cartAbandonment",
      data: {
        firstName,
        productNames,
        checkoutLink,
        reviewLink,
      },
    }),
  );
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  firstName: string,
  orderId: string,
  status: string,
  message: string,
) {
  return sendSafely(() =>
    sendUserTemplateEmail({
      to: email,
      subject: userSubjects.orderStatusUpdate,
      template: "orderStatusUpdate",
      data: {
        firstName,
        orderId,
        status,
        message,
      },
    }),
  );
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendSafely(() =>
    sendGenericTemplateEmail({
      to: email,
      subject: userSubjects.welcome,
      template: "welcome",
      data: { name, firstName: name },
    }),
  );
}
