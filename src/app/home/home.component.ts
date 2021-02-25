import { Component, OnInit } from '@angular/core';
import {AccountService} from '@app/_services';
import {first} from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accounts: any[];

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.getAll()
      .pipe(first())
      .subscribe(accounts => this.accounts = accounts);
  }

}
