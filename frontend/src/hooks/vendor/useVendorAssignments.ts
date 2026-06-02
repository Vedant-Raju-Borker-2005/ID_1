import { useState, useEffect } from "react";
import { useVendorStore } from "../../stores/vendorStore";

export function useVendorAssignments() {
  const { assignments, loadAssignments, updateAssignmentStatus } = useVendorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      await loadAssignments();
      setLoading(false);
    };
    fetchAssignments();
  }, [loadAssignments]);

  const handleAccept = async (id: string) => {
    setLoading(true);
    await updateAssignmentStatus(id, 'ACCEPTED');
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    await updateAssignmentStatus(id, 'REJECTED');
    setLoading(false);
  };

  return {
    assignments,
    loading,
    handleAccept,
    handleReject,
  };
}
