import express from 'express';
import { translationRouter } from './resources/translation';

export const restRouter = express.Router();
restRouter.use('/translation', translationRouter);