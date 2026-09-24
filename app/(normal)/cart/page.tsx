// app/cart/page.tsx
export const dynamic = "force-dynamic";
import { CartItems } from "../../components/common/cart/CartItems";
import { OrderSummary } from "../../components/common/cart/OrderSummary";
import { WhatsAppWidget } from "../../components/common/homepage/WhatsAppWidget";
// import RelatedProducts from "../components/common/Product-detail/alsolike";
import { getCart } from "@/helper/cart/action";
import { CartInitializer } from "./CartInitializer";

export default async function CartPage() {
  const { success, items } = await getCart();

  return (
    <>
      <div className="min-h-screen bg-[#FDFCF9]">
        <main className="container mx-auto px-4 py-10 md:px-16">
          {/* Initialize store with server data */}
          <CartInitializer initialItems={success && items ? items : []} />
          
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8">
              <CartItems />
            </div>
            <div className="lg:col-span-4 lg:sticky lg:top-49">
              <OrderSummary />
            </div>
          </div>
          {/* <RelatedProducts /> */}
        </main>
        <WhatsAppWidget />
      </div>
    </>
  );
}