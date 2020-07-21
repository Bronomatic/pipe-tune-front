import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SearchService } from '../search.service';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  username: string;
  userAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private searchService: SearchService, private userService: UserService) { }

  ngOnInit() {
    this.username = this.userService.getUsername();
    this.userAuthenticated = this.userService.getIsAuth();
    this.authListenerSubs = this.userService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userAuthenticated = isAuthenticated;
      })
    this.searchForm = new FormGroup({
      'searchField': new FormControl(null, Validators.required),
      'searchType': new FormControl('name', Validators.required)
    });
  }

  onSubmitSearch() {
    const searchData = {
      searchValue: this.searchForm.value.searchField,
      searchType: this.searchForm.value.searchType
    }
    if(this.searchForm.valid) {
      return this.searchService
        .onSearchSent(searchData)
        .subscribe((result:Object) => {
          // console.log(result);
        });
    }
  }

  onLogout() {
    this.userService.logout();
    this.username = null;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
