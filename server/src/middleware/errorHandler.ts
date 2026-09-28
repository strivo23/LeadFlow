import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Unhandled Error [${req.method} ${req.url}]:`, err.stack || err.message || err);

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    sendError(res, `A record with this ${target} already exists.`, 409);
    return;
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    sendError(res, 'Record not found.', 404);
    return;
  }

  // Generic syntax or JSON parse error
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Malformed JSON in request body', 400);
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error. Please try again later.'
      : err.message || 'Internal server error';

  sendError(res, message, statusCode);
};
