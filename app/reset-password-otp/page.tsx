import { Suspense } from "react";
import AuthPageLoading from "@/components/AuthPageLoading";
import { ClientResetPasswordOtp } from "./ClientResetPasswordOtp";

export default function Page() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <ClientResetPasswordOtp />
    </Suspense>
  );
}
