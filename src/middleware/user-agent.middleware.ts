import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  Optional,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function userAgent(req: Request, next: NextFunction) {
  const userAgent = req.headers['user-agent'];
  req['ua'] = userAgent;
  // Call the next middleware or route handler
  next();
}

export class UserAgentOptions {
  accepted?: string[];
}
@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  constructor(@Optional() private readonly options: UserAgentOptions) { }
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referrer || req.headers.referer;

    if (referrer !== 'localhost:3000') {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'invalid referrer' });
      return;
    }

    // Call the next middleware or route handler
    if (!this.isUserAgentValid(userAgent)) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'invalid user agent' });
      return;
    }
    req['ua'] = userAgent;
    next();
  }

  isUserAgentValid(ua: string) {
    const userAgentList = this.options?.accepted ?? [];

    if (!userAgentList.length) {
      return true;
    }

    return userAgentList.some((userAgent) =>
      ua.toLowerCase().includes(userAgent)
    );
  }
}
