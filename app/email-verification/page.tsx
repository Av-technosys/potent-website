import { Suspense } from "react";
import AuthPageLoading from "@/components/AuthPageLoading";
import { EmailVerificationClient } from "./EmailVerificationClient";

export default function Page() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <EmailVerificationClient />
    </Suspense>
  );
}
