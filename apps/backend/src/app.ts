import mongoose from 'mongoose';
import './config/env.js';
import express, { type Express, type Request, type Response } from 'express';

import { error404, errorHandler } from './middlewares/errorHandler.js';
import { requestId } from './middlewares/requestId.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './modules/auth/authe.routes.js';

////// setting //////

const app: Express = express();
app.use(requestId);
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms [req-id: :req[x-request-id]]',
  ),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  }),
);

///// endpoint /////

app.use('/api/auth', authRouter);

app.get('/health', async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'available',
    uptime: process.uptime(),
  });
});

app.get('/ready', async (req: Request, res: Response) => {
  const isDBConnected = mongoose.connection.readyState === 1;
  if (!isDBConnected) {
    return res.status(500).json({
      status: 'unavailable',
      database: 'disconnected',
    });
  }

  return res.status(200).json({
    status: 'ready',
    database: 'connected',
  });
});

///// error handling //////

app.use(error404);
app.use(errorHandler);

export default app;
