import { NextRequest, NextResponse } from 'next/server';

export function authorizeRole(...allowedRoles: string[]) {
  return async (req: any, res: any, next: Function) => {
    const user = req.user; // From auth middleware
    
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
}

// Role Map for UI Guards (Frontend)
export const ROLE_PERMISSIONS = {
  MANAGER: ['ALL_PROJECTS', 'ASSIGN_TEAM', 'VIEW_REPORTS'],
  COORDINATOR: ['MY_PROJECTS', 'UPDATE_PROGRESS', 'UPLOAD_PHOTOS'],
  TECHNICIAN: ['ASSIGNED_TASKS', 'UPLOAD_PROOF']
};
