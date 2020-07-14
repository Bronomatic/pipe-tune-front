import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  passReqPattern = '[a-z]';
  validation = true;
  validationErrors = [];
  validationMessages = {
    'email': 'Must use a valid email',
    'username': 'Username must be between 6 and 15 characters',
    'password': 'Password must be a min length of 6 characters and use at least 1 lowercase, uppercase, number and symbol',
    'confirmPassword': 'Both passwords must exactly match'
  }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'username': new FormControl(null, [
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.required
      ]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10000)
      ]),
      'confirmPassword': new FormControl(null, Validators.required)
    })
  }

  onSignup() {
    // * reset errors
    this.validationErrors = [];
    // * if inputs valid
    if(this.signupForm.valid) {
      const userData = {
        email: this.signupForm.get('email').value,
        username: this.signupForm.get('username').value,
        password: this.signupForm.get('password').value
      }
      return this.userService
        .onSignup(userData)
        .subscribe((result:Object) => {
          // * redirect on success
          this.router.navigate(['/']);
        });
    // * if inputs invalid
    }else{
      this.validation = false;
      // * set validation error messages
      if(
        this.signupForm.get('password').value !==
        this.signupForm.get('confirmPassword').value
      ) {
        this.validationErrors.push(this.validationMessages['confirmPassword']);
      }
      const controlKeys = Object.keys(this.signupForm.controls);
      for(let each in controlKeys) {
        if(!this.signupForm.get(controlKeys[each]).valid) {
          this.validationErrors.push(this.validationMessages[controlKeys[each]]);
        }
      }
    }
  }

}
