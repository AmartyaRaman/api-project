import { Router } from "express"
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = Router();

// Apply protect middleware to all task routes
router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;