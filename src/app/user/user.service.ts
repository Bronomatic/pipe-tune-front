import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  onLogin(data:Object) {
    let url = 'http://localhost:8080/login';
    return this.http.post(url, data);
  }

  onSignup(data:Object) {
    let url = 'http://localhost:8080/signup';
    return this.http.post(url, data);
  }
}
