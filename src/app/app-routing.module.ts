import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from '@app/home/home.component';
import {EditPageComponent} from '@app/edit-page/edit-page.component';
import {LoginComponent} from '@app/login/login.component';
import {AuthGuard} from '@app/_helpers';


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: EditPageComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
