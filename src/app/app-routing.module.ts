import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { UserComponent } from './user/user/user.component';
import { CreateComponent } from './tunes/create/create.component';
import { AuthGuard } from './auth.guard';
import { TuneListComponent } from './tunes/tune-list/tune-list.component';
import { EditComponent } from './tunes/edit/edit.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user', component: UserComponent , canActivate: [AuthGuard]},
  { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'list', component: TuneListComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
