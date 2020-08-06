import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private listListener = new Subject<any>();
  private userTuneListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

  onSearch(category: String, value: String) {
    const queryString = `q=${category}&v=${value}`;
    const url = `http://localhost:8080/search?${queryString}`;

    return this.http.get<any>(url)
      .toPromise()
      .then(data => {
        this.listListener.next(data);
        this.router.navigate(['/list']);
      })
      .catch(err => {
        this.listListener.next({result: {}});
      })
  }

  getListListener() {
    return this.listListener.asObservable();
  }

  getTuneById(id: String) {
    const url = `http://localhost:8080/`;
    return this.http.get<any>(url + id)
  }

  getTuneListByIdArray(idArray:Array<string>){
    const url =  `http://localhost:8080/search?a=${idArray.join('-')}`;
    return this.http.get<any>(url);
  }

  getAllUsersTunes(username: String) {
    const url = `http://localhost:8080/search?u=${username}`;
    return this.http.get<any>(url)
      .toPromise()
      .then(data => {
        this.userTuneListener.next(data);
      })
      .catch(err => {
        console.log(err)
      })
  }

  getUsersTunesListener() {
    return this.userTuneListener.asObservable();
  }

}
