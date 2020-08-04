import { Component, OnInit, Input, Output } from '@angular/core';
import abcjs from 'abcjs';
import * as svg from 'save-svg-as-png';

import { saveAs } from 'file-saver';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Input() tune: { body:String, title:String, id:String };
  @Output() tuneBody: { body:String }
  renderAbc = new abcjs.renderAbc();
  userId: String;

  constructor(private userService: UserService) { }

  ngOnInit() {
    abcjs.renderAbc('paper', this.tune.body);
    this.userId = this.userService.getUserId();
    this.tuneBody = {body: this.tune.body};
  }

  saveAsAbc() {
    const abcBody = this.tune.body.toString();
    const title = this.tune.title;
    var blob = new Blob([abcBody], {type: "abc/plain;charset=utf-8"});
    saveAs(blob, title+'.abc');
  }

  saveAsSvg() {
    const svgBody = document.getElementById('paper').innerHTML;
    const title = this.tune.title;
    var blob = new Blob([svgBody], {type: 'svg/plain;charset=utf-8'});
    saveAs(blob, title+'.svg');
  }

  saveAsPng() {
    const svgBody = document.getElementById('paper').firstElementChild;
    const title = this.tune.title;
    svg.saveSvgAsPng(svgBody, title+'.png', (uri) => {});
  }

  onPrint() {
    const svgBody = document.getElementById('paper').firstElementChild;
    const size = `height=${svgBody.clientHeight},width=${svgBody.clientWidth}`;
    let a = window.open('', '', size);
    a.document.write(`<html><body>${svgBody}</body></html>`);
    a.document.close();
    a.print();
  }

}
