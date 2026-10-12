// app/cart/page.tsx
export const dynamic = "force-dynamic";
import { CartView } from "../../components/common/cart/CartView";
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
          
          <CartView />
          {/* <RelatedProducts /> */}
        </main>
      </div>
    </>
  );
}