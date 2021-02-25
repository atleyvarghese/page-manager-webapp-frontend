import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, EMPTY, from, Observable, of} from 'rxjs';
import {concatMap, finalize, map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {Account, Page} from '@app/_models';

const baseUrl = `${environment.apiUrl}/api/v1/accounts`;

@Injectable({providedIn: 'root'})
export class AccountService {
  public account: Observable<Account>;
  private accountSubject: BehaviorSubject<Account>;
  private authenticateTimeout;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.accountSubject = new BehaviorSubject<Account>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): Account {
    return this.accountSubject.value;
  }

  login() {
    // login with facebook then authenticate with the API to get a JWT auth token
    this.facebookLogin()
      .pipe(concatMap(accessToken => this.apiAuthenticate(accessToken)))
      .subscribe(() => {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      });
  }

  facebookLogin() {
    // login with facebook and return observable with fb access token on success
    return from(new Promise<fb.StatusResponse>(resolve => FB.login(resolve, {scope: 'email,pages_show_list,pages_manage_metadata'})))
      .pipe(concatMap(({authResponse}) => {
        if (!authResponse) {
          return EMPTY;
        }
        return of(authResponse.accessToken);
      }));
  }

  apiAuthenticate(accessToken: string) {
    // authenticate with the api using a facebook access token,
    // on success the api returns an account object with a JWT auth token
    return this.http.post<any>(`${baseUrl}/facebook/authenticate/`, {accessToken})
      .pipe(map(account => {
        this.setAccessToken(account);
        this.startAuthenticateTimer();
        return account;
      }));
  }

  logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    FB.api('/me/permissions', 'delete', null, () => FB.logout());
    this.stopAuthenticateTimer();
    this.removeAccessToken();
    this.router.navigate(['/login']);
  }

  getAll() {
    return this.http.get<Account[]>(`${baseUrl}/facebook/page-list/`);
  }

  getById(id) {
    return this.http.get<Page>(`${baseUrl}/facebook/page/${id}/`);
  }

  update(id, params) {
    return this.http.post(`${baseUrl}/facebook/page/${id}/`, params)
      .pipe(map((page: any) => {
        return page;
      }));
  }

  // helper methods

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`)
      .pipe(finalize(() => {
        // auto logout if the logged in account was deleted
        if (id === this.accountValue.id) {
          this.logout();
        }
      }));
  }

  isUserLoggedIn(): boolean{
    if (localStorage.getItem('accessToken')) {
      return true;
    }
    return false;
  }
  isGuestUser(): boolean{
    if (localStorage.getItem('accessToken')) {
      return false;
    }
    return true;
  }

  setAccessToken(account): void{
    localStorage.setItem('accessToken', account.token);
  }
  getAccessToken(): string{
    return localStorage.getItem('accessToken');
  }

  removeAccessToken(): void{
    localStorage.removeItem('accessToken');
  }

  private startAuthenticateTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.getAccessToken().split('.')[1]));

    // set a timeout to re-authenticate with the api one minute before the token expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    const {accessToken} = FB.getAuthResponse();
    this.authenticateTimeout = setTimeout(() => {
      this.apiAuthenticate(accessToken).subscribe();
    }, timeout);
  }

  private stopAuthenticateTimer() {
    // cancel timer for re-authenticating with the api
    clearTimeout(this.authenticateTimeout);
  }
}
