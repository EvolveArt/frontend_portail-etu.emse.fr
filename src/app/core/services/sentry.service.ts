import * as Sentry from '@sentry/browser';
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

Sentry.init({
  dsn: 'https://423b494d1a89445bba1e14eea01e8997@sentry.io/1472817',
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  handleError(error) {
    if (environment.production) {
      Sentry.captureException(error.originalError || error);
    }
    console.log(error);
    throw error;
  }
}
