import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TuneModel } from './tune.model';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class TuneService {
  private tuneToEdit: Object;

  constructor(
    private http: HttpClient,
    private router: Router,
    private searchService: SearchService
  ) { }

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

    editTune(id:String) {
      this.searchService.getTuneById(id)
        .subscribe(result => {
          this.tuneToEdit = result.result;
          this.router.navigate(['/edit']);
        });
    }

    getTuneToEdit() {
      return this.tuneToEdit;
    }

    updateTune(tune:TuneModel, token:String) {
      const url = `http://localhost:8080/update`;
      const options = {
        headers: new HttpHeaders({
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token
        })
      }
      this.http.post(url, tune, options)
        .subscribe(response => {
          this.router.navigate(['/user']);
        });
    }
}