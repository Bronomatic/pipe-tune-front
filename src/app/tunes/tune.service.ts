import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TuneModel } from './tune.model';
import { SearchService } from './search.service';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TuneService {
  private tuneToEdit: Object;
  private audioData = new Subject<String>();

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
      // const url = 'http://localhost:8080/create';
      const url = `${environment.base_url}/create`;

      this.http.post(url, data, options)
        .toPromise()
        .then(response => {
          this.router.navigate(['/user']);
        })
        .catch(err => console.log(err));
    }

    deleteTune(id:String, token:String) {
      const options = {headers: new HttpHeaders({
        "Content-Type": 'application/json',
        "Authorization": "Bearer " + token
      })}
      // const url = `http://localhost:8080/delete/${id}`;
      const url = `${environment.base_url}/delete/${id}`;
      return this.http.delete(url, options);
    }

    editTune(id:String) {
      this.searchService.getTuneById(id)
        .toPromise()
        .then(result => {
          this.tuneToEdit = result.result;
          this.router.navigate(['/edit']);
        })
        .catch(err => console.log(err));
    }

    getTuneToEdit() {
      return this.tuneToEdit;
    }

    setAudioData(body:String) {
      this.audioData.next(body);
    }

    getAudioData() {
      return this.audioData.asObservable();
    }

    updateTune(tune:TuneModel, token:String) {
      // const url = `http://localhost:8080/update`;
      const url = `${environment.base_url}/update`;
      const options = {
        headers: new HttpHeaders({
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + token
        })
      }
      this.http.post(url, tune, options)
        .toPromise()
        .then(response => {
          this.router.navigate(['/user']);
        })
        .catch(err => console.log(err));
    }
}
