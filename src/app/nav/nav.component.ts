import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SearchService } from '../tunes/search.service';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(
    private searchService: SearchService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = this.userService.getUsername();
    this.userAuthenticated = this.userService.getIsAuth();
    this.authListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.username = this.userService.getUsername();
        this.userAuthenticated = isAuthenticated;
      })

    this.searchForm = new FormGroup({
      'searchCategory': new FormControl('title', Validators.required),
      'searchType': new FormControl('march'),
      'searchMeter': new FormControl('4/4'),
      'searchText': new FormControl(null),
      'searchUser': new FormControl(null)
    });
  }

  onSubmitSearch() {
    let searchCategory = this.searchForm.value.searchCategory;
    let searchValue: String;

    if(searchCategory === 'meter'){
      searchValue = this.searchForm.value.searchMeter;
    }else if(searchCategory === 'type'){
      searchValue = this.searchForm.value.searchType;
    }else{
      searchValue = this.searchForm.value.searchText;
    }

    if(this.searchForm.valid) {
      this.searchService.onSearch(searchCategory, searchValue);
      this.router.navigate(['/list']);
    }
  }

  onLogout() {
    this.userService.logout();
    this.username = null;
    this.userAuthenticated = false;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
