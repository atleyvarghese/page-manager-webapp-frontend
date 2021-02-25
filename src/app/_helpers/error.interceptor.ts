import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AccountService} from '@app/_services';
import {NotificationService} from '@app/_services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private notifyService: NotificationService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status)) {
        // auto logout if 401 or 403 response returned from api
        this.accountService.logout();
        this.notifyService.showError('You are logged out, please login again', 'Account');
      }

      const error = err.error?.message || err.statusText;
      console.error(err);
      return throwError(error);
    }));
  }
}
