import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pipe-tune-front';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.autoAuthUser();
  }

  // onSubmit() {}
}
