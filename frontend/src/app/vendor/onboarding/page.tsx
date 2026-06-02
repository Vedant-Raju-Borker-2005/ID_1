'use client';

import { OnboardingWizard } from "../../../components/vendor/OnboardingWizard";

export default function VendorOnboardingPage() {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Become a Design Partner</h1>
        <p className="text-xs text-gray-400 mt-1">Submit your business documentation to gain access to premium customer design layouts, inventory syncing, and automated payouts.</p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
