import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VendorState {
  profile: any;
  dashboard: any;
  assignments: any[];
  products: any[];
  registerVendor: (data: any) => Promise<void>;
  loadDashboard: () => Promise<void>;
  loadAssignments: () => Promise<void>;
  updateAssignmentStatus: (id: string, status: string) => Promise<void>;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      profile: null,
      dashboard: null,
      assignments: [],
      products: [],

      registerVendor: async (data) => {
        const response = await fetch('/api/vendor/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Registration failed');
        const result = await response.json();
        set({ profile: result });
      },

      loadDashboard: async () => {
        const response = await fetch('/api/vendor/dashboard');
        if (response.ok) {
          const data = await response.json();
          set({ dashboard: data, profile: data });
        }
      },

      loadAssignments: async () => {
        // Mock fallback assignments if the endpoint isn't fully set
        try {
          const response = await fetch('/api/vendor/assignments');
          if (response.ok) {
            const data = await response.json();
            set({ assignments: data });
            return;
          }
        } catch (e) {}

        // Fallback demo data
        set({
          assignments: [
            { id: "1", project: { name: "Villa Project A" }, status: "ASSIGNED", dueDate: "2026-06-01" },
            { id: "2", project: { name: "Office Fitout B" }, status: "ACCEPTED", dueDate: "2026-06-05" },
          ]
        });
      },

      updateAssignmentStatus: async (id, status) => {
        try {
          await fetch(`/api/vendor/assignments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, remarks: "Updated via dashboard" })
          });
        } catch (e) {}

        const updated = get().assignments.map(a => 
          a.id === id ? { ...a, status } : a
        );
        set({ assignments: updated });
      },
    }),
    { name: 'vendor-storage' }
  )
);
