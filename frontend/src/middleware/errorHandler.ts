import { Request, Response } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response) => {
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
}; 