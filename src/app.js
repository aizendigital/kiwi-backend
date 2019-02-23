import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connect } from './config/db';
import { restRouter } from './api';
import swaggerDocument from './config/swagger.json';
import fs from 'fs'
import path from 'path'

const app = express();
const PORT = process.env.PORT || 3000;
process.env.NODE_ENV = "development"
connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  var accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' })
  app.use(logger('combined', { stream: accessLogStream }));
}
app.use('/api', restRouter);
app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: false,
  })
);
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});
