'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVendorStore } from "../../stores/vendorStore";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { registerVendor } = useVendorStore();

  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    gstNumber: '',
    panNumber: '',
    warehouseAddress: '',
    serviceLocations: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1 && (!form.businessName || !form.ownerName || !form.email)) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        serviceLocations: form.serviceLocations.split(',').map((p) => p.trim()).filter(Boolean),
      };
      await registerVendor(payload);
      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err.message || 'Onboarding failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-250/50 rounded-3xl p-8 shadow-xl">
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
          <span>Step {step} of 3</span>
          <span>{step === 1 ? 'Business Details' : step === 2 ? 'Upload Documents' : 'Service coverage'}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-650 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Business Registration</h2>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Name *</label>
              <input
                id="businessName"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Owner Name *</label>
              <input
                id="ownerName"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Verification Documents</h2>
            <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-2xl bg-gray-50/50">
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs font-bold text-gray-600">Drag & Drop verification files here</p>
              <p className="text-[10px] text-gray-400 mt-1">Upload GST certificate and PAN card copy</p>
              <input type="file" name="documents" className="hidden" id="file-upload" multiple />
              <label htmlFor="file-upload" className="mt-4 inline-block px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-brand-600 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                Choose Files
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Logistics & Locations</h2>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Locations (Comma-separated Pincodes)</label>
              <input
                id="serviceLocations"
                name="serviceLocations"
                placeholder="e.g. 110001, 400001, 560001"
                value={form.serviceLocations}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Warehouse Address</label>
              <input
                id="warehouseAddress"
                name="warehouseAddress"
                value={form.warehouseAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t border-gray-100">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-xs font-bold transition-all shadow-sm"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 text-xs font-bold transition-all shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 text-xs font-bold transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
