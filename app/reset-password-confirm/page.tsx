import { Suspense } from "react";
import AuthPageLoading from "@/components/AuthPageLoading";
import { ClientResetPasswordConfirm } from "./ClientResetPasswordConfirm";

export default function Page() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <ClientResetPasswordConfirm />
    </Suspense>
  );
}
