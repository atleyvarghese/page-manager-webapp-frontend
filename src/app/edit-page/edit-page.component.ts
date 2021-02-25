import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '@app/_services';
import {first} from 'rxjs/operators';
import {Page} from '@app/_models';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {
  form: FormGroup;
  page: Page;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      about: ['', Validators.required],
      website: ['', Validators.required],
      emails: ['', Validators.required],
    });

    // get account and populate form
    const id = this.route.snapshot.params['id'];
    this.accountService.getById(id)
        .pipe(first())
        .subscribe(x => {
          this.page = x;
          this.form.patchValue(x);
        });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.accountService.update(this.page.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['../'], {relativeTo: this.route});
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}
