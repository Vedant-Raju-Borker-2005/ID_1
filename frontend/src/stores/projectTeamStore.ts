import { create } from 'zustand';

export interface TeamMember {
  id: string;
  role: 'MANAGER' | 'COORDINATOR' | 'TECHNICIAN';
  status: 'ACTIVE' | 'ON_LEAVE' | 'REMOVED';
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface ExecutionIssue {
  id: string;
  projectId: string;
  itemId?: string | null;
  type:
    | 'VENDOR_DELAY'
    | 'DAMAGED_PRODUCT'
    | 'WRONG_PRODUCT'
    | 'MISSING_ITEM'
    | 'INSTALLATION_PROBLEM'
    | 'CUSTOMER_COMPLAINT'
    | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  description: string;
  resolution?: string | null;
  resolvedAt?: string | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ExecutionPhoto {
  id: string;
  projectId: string;
  roomName?: string | null;
  category:
    | 'SITE_VISIT'
    | 'PRODUCTION_CHECK'
    | 'DELIVERY'
    | 'INSTALLATION'
    | 'FINAL_HANDOVER';
  imageUrl: string;
  uploadedBy: string;
  createdAt: string;
}

interface ProjectTeamState {
  members: TeamMember[];
  progress: number;
  issues: ExecutionIssue[];
  photos: ExecutionPhoto[];
  isLoading: boolean;
  error: string | null;

  fetchMembers: (projectId: string) => Promise<void>;
  assignMember: (projectId: string, userId: string, role: string) => Promise<void>;
  fetchProgress: (projectId: string) => Promise<void>;
  fetchIssues: (projectId: string) => Promise<void>;
  createIssue: (
    projectId: string,
    data: { type: string; priority: string; description: string; itemId?: string }
  ) => Promise<void>;
  fetchPhotos: (projectId: string) => Promise<void>;
  uploadPhoto: (
    projectId: string,
    data: { roomName?: string; category: string; imageUrl: string }
  ) => Promise<void>;
  clearError: () => void;
}

export const useProjectTeamStore = create<ProjectTeamState>((set) => ({
  members: [],
  progress: 0,
  issues: [],
  photos: [],
  isLoading: false,
  error: null,

  fetchMembers: async (projectId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/projects/${projectId}/team`);
      if (!response.ok) throw new Error('Failed to load team');
      const data = await response.json();
      set({ members: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load team', isLoading: false });
    }
  },

  assignMember: async (projectId, userId, role) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/projects/${projectId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Assignment failed');
      }
      const data = await response.json();
      set((state) => ({
        members: [...state.members.filter((m) => m.user.id !== userId), data],
        isLoading: false,
      }));
    } catch (e: any) {
      set({ error: e.message || 'Assignment failed', isLoading: false });
      throw e;
    }
  },

  fetchProgress: async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/progress`);
      if (response.ok) {
        const data = await response.json();
        set({ progress: data.progress });
      }
    } catch (e) {}
  },

  fetchIssues: async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/issues`);
      if (response.ok) {
        const data = await response.json();
        set({ issues: data });
      }
    } catch (e) {}
  },

  createIssue: async (projectId, data) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to log issue');
      const issue = await response.json();
      set((state) => ({ issues: [issue, ...state.issues] }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to log issue' });
      throw e;
    }
  },

  fetchPhotos: async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/photos`);
      if (response.ok) {
        const data = await response.json();
        set({ photos: data });
      }
    } catch (e) {}
  },

  uploadPhoto: async (projectId, data) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to upload photo');
      const photo = await response.json();
      set((state) => ({ photos: [photo, ...state.photos] }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to upload photo' });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
