import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private listListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

  onSearch(category: String, value: String) {
    const queryString = `q=${category}&v=${value}`;
    const url = `http://localhost:8080/search?${queryString}`;

    return this.http.get<any>(url)
      .subscribe(result => {
        this.listListener.next(result);
        this.router.navigate(['/list']);
      })
  }

  getListListener() {
    return this.listListener.asObservable();
  }

  getTuneById(id: String) {
    console.log(id);
    const url = `http://localhost:8080/tune?id=${id}`;
    return this.http.get<any>(url)
  }

}
