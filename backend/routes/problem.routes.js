import express from 'express';
import { authMiddleware, chekAdmin } from '../middleware/auth.middleware.js';
import { createProblem, deleteProblem, getAllProblem, getAllSolvedProblemByuser, getProblemById, updateProblem } from '../controllers/problem.controller.js';

const problemRoutes = express.Router();

problemRoutes.post('/create-problems', authMiddleware, chekAdmin, createProblem);

problemRoutes.get('/get-all-problems', authMiddleware,getAllProblem);

problemRoutes.get('/get-all-problem/:id', authMiddleware, getProblemById);

problemRoutes.put('/update-problem/:id', authMiddleware, updateProblem);

problemRoutes.delete('/delete-problem/:id', authMiddleware, chekAdmin, deleteProblem);

problemRoutes.get('/get-solved-problm', authMiddleware, getAllSolvedProblemByuser);





export default problemRoutes;