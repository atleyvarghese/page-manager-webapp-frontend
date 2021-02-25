import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '@environments/environment';
import {AccountService} from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    const token = this.accountService.getAccessToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (this.accountService.isUserLoggedIn() && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }

    return next.handle(request);
  }
}
