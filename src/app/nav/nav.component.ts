import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SearchService } from '../search.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  searchForm: FormGroup;
  loggedIn = true;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
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
          console.log(result);
        });
    }
  }

}
