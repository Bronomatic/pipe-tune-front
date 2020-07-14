import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    })
  }

  onUserLogin() {
    let userData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    if(this.loginForm.valid) {
      return this.userService
        .onLogin(userData)
        .subscribe((result:Object) => {
          console.log(result);
        });
    }
  }

}
