import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const LOGGER = new Logger('RouteLogger');

export function routeLogger(req: Request, res: Response, next: NextFunction) {
  LOGGER.log(req.url);
  next();
}
