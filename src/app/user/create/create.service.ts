import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private url = 'http://localhost:8080/create'

  constructor(private http: HttpClient) { }

}
