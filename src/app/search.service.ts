import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  onSearchSent(data:Object) {
    const url = 'http://localhost:8080/search';
    return this.http.post(url, data);
  }
}
