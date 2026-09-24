import { getCouponById } from "@/helper";
import { notFound } from "next/navigation";
import CouponForm from "../couponForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const couponInfo = await getCouponById(id);

  if (!couponInfo) notFound();

  return <CouponForm couponInfo={couponInfo} />;
};

export default Page;
