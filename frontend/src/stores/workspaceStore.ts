import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  switchWorkspace: (workspaceId: string) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      currentWorkspace: null,
      workspaces: [],

      switchWorkspace: (workspaceId) => {
        const { workspaces } = get();
        const found = workspaces.find((w) => w.id === workspaceId);
        if (found) {
          set({ currentWorkspace: found });
        }
      },

      setWorkspaces: (workspaces) => {
        const current = get().currentWorkspace;
        const newCurrent = current && workspaces.find((w) => w.id === current.id)
          ? current
          : workspaces[0] || null;
        set({ workspaces, currentWorkspace: newCurrent });
      },

      addWorkspace: (workspace) => {
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
          currentWorkspace: state.currentWorkspace || workspace,
        }));
      },
    }),
    { name: 'workspace-storage' }
  )
);
