import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { UserService } from '../user/user.service';
import { TuneService } from '../tune.service';

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
  tune: { body:String, title:String, id:String };
  favorites:Array<String>;
  private userId: String;
  private token: String;

  eachTune = [];

  constructor(
    private searchService: SearchService,
    private userService: UserService,
    private tuneService: TuneService
  ) { }

  ngOnInit() {
    this.userId = this.userService.getUserId();
    this.token = this.userService.getToken();
    this.userService.getUserFavorites(this.userId, this.token)
      .subscribe((result:{message:String,favorites:Array<String>}) => {
        this.favorites = result.favorites;
      });

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
    this.singleView = true;
    this.searchService.getTuneById(id)
      .subscribe(response => {
        this.tune = {
          body: response.result.body,
          title: response.result.title,
          id: response.result._id
        };
      });
  }

  onFavorite(id:String) {
    const extant = this.favorites.indexOf(id);
    if(extant < 0){
      this.favorites.push(id);
    }else{
      this.favorites.splice(extant, 1);
    }
    const token = this.userService.getToken()
    this.userService.updateFavorites(this.userId, this.favorites, token);
  }

  onEdit(id:String) {
    this.tuneService.editTune(id);
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
  }

}
