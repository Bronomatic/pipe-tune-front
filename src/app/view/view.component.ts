import { Component, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  saveTest() {
    var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "hello world.txt");
  }

}
