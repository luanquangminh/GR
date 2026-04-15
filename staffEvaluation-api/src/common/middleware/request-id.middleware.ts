import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare module 'express' {
  interface Request {
    requestId?: string;
  }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.header('x-request-id');
    const id = incoming && incoming.length <= 128 ? incoming : randomUUID();
    req.requestId = id;
    res.setHeader('x-request-id', id);
    next();
  }
}
