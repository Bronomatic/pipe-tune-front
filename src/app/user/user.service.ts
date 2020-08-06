import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: ReturnType<typeof setTimeout>;
  private userId: string;
  private username: string;
  private authStatusListener = new Subject<boolean>();
  private timeToLogout = 1000 * 6;

  constructor(private http: HttpClient, private router: Router) { }

  // * sign up
  onSignup(data:Object) {
    let url = 'http://localhost:8080/signup';
    this.http.post(url, data)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  // * login
  onLogin(data:Object) {
    let url = 'http://localhost:8080/login';
    this.http.post<{token: string, expiresIn: number, userId: string, username: string, favorites: Array<string>}>(url, data)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.username = response.username;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * this.timeToLogout);
          this.saveAuthData(token, expirationDate, this.userId, this.username);
          this.router.navigate(['/']);
        }
      });
  }

  // * auth token functions
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.setAuthTimer(expiresIn / this.timeToLogout);
      this.authStatusListener.next(false);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.username = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * this.timeToLogout);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if(!token || !expirationDate){
      return
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      username
    };
  }

  updateFavorites(userId:String, favorites:Array<String>, token:String) {
    const url = 'http://localhost:8080/favorites';
    const options = {
      headers: new HttpHeaders({
        "Content-Type": 'application/json',
        "Authorization": "Bearer " + token
      })
    }
    const data = {
      userId: userId,
      favorites: favorites
    }
    this.http.post(url, data, options)
      .subscribe(response => { });
  }

  getUserFavorites(userId:String, token:String) {
    const url = 'http://localhost:8080/favorites';
    const options = {
      headers: new HttpHeaders({
        "Content-Type": 'application/json',
        "Authorization": "Bearer " + token
      })
    }

    return this.http.get(`${url}?id=${userId}`, options);
  }

}

