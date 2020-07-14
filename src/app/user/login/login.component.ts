import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private authStatusSubscription: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
    this.authStatusSubscription = this.userService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
        console.log(authStatus);
      }
    )
  }

  onUserLogin() {
    let userData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    if(this.loginForm.valid) {
      // this.isLoading = true;
      this.userService.onLogin(userData);
    }
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

}
