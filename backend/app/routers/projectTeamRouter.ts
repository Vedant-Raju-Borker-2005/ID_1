import { Router } from 'express';
import projectTeamRepo from '../models/projectTeamModel';
import { validateAssignmentPermissions } from '../services/assignmentService';

const router = Router();

// Mock/stub middlewares to satisfy routing structure
const authenticateToken = (req: any, res: any, next: any) => next();
const authorizeRole = (...roles: string[]) => (req: any, res: any, next: any) => next();

// Team Management
router.get('/projects/:projectId/team', async (req: any, res: any) => {
  const members = await projectTeamRepo.getTeamMembers(req.params.projectId);
  res.json(members);
});

router.post('/projects/:projectId/assign', authorizeRole('MANAGER'), async (req: any, res: any) => {
  try {
    await validateAssignmentPermissions(req.user?.id || '', req.params.projectId);
    const result = await projectTeamRepo.assignProjectMember({ ...req.body, userId: req.user?.id || '' });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
});

// Progress & Tracking
router.get('/projects/:projectId/progress', async (req: any, res: any) => {
  const progress = await projectTeamRepo.getProjectProgress(req.params.projectId);
  res.json(progress);
});

// Issue Management
router.post('/projects/:projectId/issues', authorizeRole('COORDINATOR', 'MANAGER'), async (req: any, res: any) => {
  res.status(201).json({ success: true });
});

export default router;
