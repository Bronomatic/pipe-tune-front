import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SearchService } from 'src/app/search.service';
import { UserService } from '../user.service';
import { TuneService } from 'src/app/tune.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private userTuneSub: Subscription;
  username = this.userService.getUsername();
  private userId = this.userService.getUserId();
  private token = this.userService.getToken();
  userTunes = [];
  userFavorites = [];
  favorites:Array<string>;
  tune: Object;

  showTunes = true;
  showFaves = true;
  showDeleteModal = false;
  viewTune = false;

  tuneToDelete: { title:String, id:String } = null;

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private tuneService: TuneService
  ) { }

  ngOnInit() {
    this.getUserFavorites();
    this.userTuneSub = this.searchService
      .getUsersTunesListener()
      .subscribe((result) => {
        const keys = Object.keys(result.result);
        for(let each of keys){
          this.userTunes.push(result.result[each]);
        }
      })
    this.getUserCreations();
  }

  getUserCreations() {
    this.searchService.getAllUsersTunes(this.username);
  }

  getUserFavorites() {
    this.userService.getUserFavorites(this.userId, this.token)
    .subscribe((response:{message:String, favorites:Array<string>}) => {
      this.favorites = response.favorites;
      this.searchService.getTuneListByIdArray(this.favorites)
        .subscribe(response => {
          this.userFavorites = response.result;
        });
    });
  }

  onView(id: String) {
    this.viewTune = true;
    this.searchService.getTuneById(id)
      .subscribe(response => {
        this.tune = {
          title: response.result.title,
          body: response.result.body
        }
      })
  }

  ngOnDestroy() {
    this.userTuneSub.unsubscribe();
  }

  onDeleteTune() {
    const id = this.tuneToDelete.id;
    const token = this.userService.getToken();
    if(id){
      this.showDeleteModal = false;
      this.tuneService.deleteTune(this.tuneToDelete.id, token)
        .subscribe(result => {
          this.userTunes = [];
          this.getUserCreations();
        });
    }
  }

  onViewDelete(title:String, id:String) {
    this.showDeleteModal = true;
    this.tuneToDelete = {title: title, id: id};
  }

  onRemoveFavorite(id:string) {
    const index = this.favorites.indexOf(id);
    this.favorites.splice(index, 1);
    this.userService.updateFavorites(this.userId, this.favorites, this.token);
    this.getUserFavorites();
  }
}
