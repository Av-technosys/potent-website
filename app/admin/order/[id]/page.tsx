import Details from "./DetailsClient";
import { fetchOrderDetails } from "@/helper/index";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const orderInfo = await fetchOrderDetails(id);

  if (!orderInfo) notFound();

  return (
    <div>
      <Details id={id} initialOrderInfo={orderInfo} />
    </div>
  );
};

export default Page;
