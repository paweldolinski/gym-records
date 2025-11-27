import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import OnboardingContent from "@/onboarding/onboardingContent";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OnboardingContent />
    </Suspense>
  );
}
