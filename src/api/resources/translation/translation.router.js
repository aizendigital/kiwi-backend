import express from 'express';
import translationController from './translation.controller';
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

export const translationRouter = express.Router();
translationRouter
  .route('/')
  .post(upload.single('upfile'), translationController.import)
  .get(translationController.findAll);
translationRouter
  .route('/create')
  .post(translationController.create)

translationRouter
  .route('/:word')
  .get(translationController.findOneByWord)

translationRouter
  .route('/:id')
  .delete(translationController.delete)
  .put(translationController.update);