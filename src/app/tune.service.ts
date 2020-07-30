import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TuneService {

  constructor(private http: HttpClient, private router: Router) { }

    // * save new tune
    onCreateTune(data:Object, token:any) {
      const options = {
        headers: new HttpHeaders({
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token
      })
      }
      const url = 'http://localhost:8080/create';
      this.http.post(url, data, options)
        .subscribe(response => {
          this.router.navigate(['/user']);
        });
    }

    deleteTune(id:String, token:String) {
      const options = {headers: new HttpHeaders({
        "Content-Type": 'application/json',
        "Authorization": "Bearer " + token
      })}
      const url = `http://localhost:8080/delete/${id}`;
      return this.http.delete(url, options);
    }
}
