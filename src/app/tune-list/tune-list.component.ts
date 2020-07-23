import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-tune-list',
  templateUrl: './tune-list.component.html',
  styleUrls: ['./tune-list.component.css']
})
export class TuneListComponent implements OnInit, OnDestroy {
  private listSub: Subscription;
  username: String;
  isAuth = false;
  singleView = false;
  tune: Object;

  eachTune = [];

  constructor(private searchService: SearchService, private userService: UserService) { }

  ngOnInit() {
    this.isAuth = this.userService.getIsAuth();
    this.username = this.userService.getUsername();
    this.listSub = this.searchService.getListListener()
      .subscribe(result => {
        this.eachTune = [];
        const data = result.result;
        const dataKeys = Object.keys(data);
        for(let each in dataKeys){
          this.eachTune.push(data[each]);
        }
      })
  }

    onView(id: String) {
      console.log(id);
      this.singleView = true;
      this.searchService.getTuneById(id)
        .subscribe(response => {
          this.tune = {
            body: response.result.body,
            title: response.result.title
          };
        });
    }

    ngOnDestroy() {
      this.listSub.unsubscribe();
    }

}
