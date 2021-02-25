import { Component } from '@angular/core';
import {AccountService} from '@app/_services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'page-manager-webapp-frontend';
  private router: Router;
  public isUserLoggedIn = false;


  constructor(private accountService: AccountService) {
    this.isUserLoggedIn = this.accountService.isUserLoggedIn();
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
  login(): void {
    this.router.navigate(['/login']);
  }
}
