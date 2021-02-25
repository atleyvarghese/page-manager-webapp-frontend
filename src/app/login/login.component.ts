import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {AccountService} from '@app/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private accountService: AccountService,
  ) {
    // redirect to home if already logged in
    if (this.accountService.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  login(): void {
    this.accountService.login();
  }

}
