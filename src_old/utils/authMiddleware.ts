// Role Map for UI Guards (Frontend)
export const ROLE_PERMISSIONS = {
  MANAGER: ['ALL_PROJECTS', 'ASSIGN_TEAM', 'VIEW_REPORTS'],
  COORDINATOR: ['MY_PROJECTS', 'UPDATE_PROGRESS', 'UPLOAD_PHOTOS'],
  TECHNICIAN: ['ASSIGNED_TASKS', 'UPLOAD_PROOF']
};

export function hasPermission(role: keyof typeof ROLE_PERMISSIONS, permission: string) {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}
