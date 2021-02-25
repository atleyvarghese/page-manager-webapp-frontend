import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '@app/_services';
import {first} from 'rxjs/operators';
import {Page} from '@app/_models';
import {NotificationService} from '@app/_services/notification.service';

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
  readonly = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private notifyService: NotificationService

) {
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const phoneRegex = /^([0]|\+91)?\d{10}$/;
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      about: ['', Validators.required],
      website: ['', [Validators.required, Validators.pattern(urlRegex)]],
      emails: ['', [Validators.required, Validators.email]],
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
          this.notifyService.showSuccess('Update Successful !!', 'Page');
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });

  }
}
