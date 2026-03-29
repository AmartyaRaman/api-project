import { Router } from "express"
import { getAllUsersAndTasks, getProfile } from '../controllers/user.controller.js'
import { protect, isAdmin } from '../middlewares/auth.middleware.js'

const router = Router();

// Get current user profile (any authenticated user)
router.get('/', protect, getProfile);

// Admin-only route to see all users and their tasks
router.get('/admin/all', protect, isAdmin, getAllUsersAndTasks);

export default router;
