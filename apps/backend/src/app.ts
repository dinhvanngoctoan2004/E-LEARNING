import mongoose from 'mongoose';
import './config/env.js';
import express, { type Express, type Request, type Response } from 'express';
import { error } from 'node:console';
import { error404, errorHandler } from './middlewares/errorHandler.js';

////// setting //////

const app: Express = express();

///// endpoint /////

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
