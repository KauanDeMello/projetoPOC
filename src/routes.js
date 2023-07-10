import express, { Request, Response } from 'express';
import { createTask, getTask, updateTask, deleteTask } from './controllers/taskController';

const router = express.Router();

router.post('/tasks', createTask);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;