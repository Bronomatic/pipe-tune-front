import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import abcjs from 'abcjs';

import { TuneModel } from '../tunes/tune.model';

@Component({
  selector: 'app-drop-edit',
  templateUrl: './drop-edit.component.html',
  styleUrls: ['./drop-edit.component.css']
})
export class DropEditComponent implements OnInit {
  @Input() data:TuneModel;
  abcEditor: abcjs.Editor;
  test = /[\{]/;

  completeBody = [];
  outputString = '';

  constructor() { }

  ngOnInit() {
    this.filterData();
    this.onUpdateStaff();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.onUpdateStaff();
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if(event.previousContainer === event.container){
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }else{
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.onUpdateStaff();
  }

  filterData() {
    const separate = this.data.body.split('\n');
    const pattern = /[A-Z]:/;
    const allRows = [];
    for(let each in separate){
      let current = separate[each];
      if(!pattern.test(current)){
        allRows.push(current);
      }
    }
    // * each line on body as item in array
    for(let each in allRows){
      const diced = allRows[each].split('');
      for(let each in diced){
        const ltr = /[a-zA-Z\{\|\:\s]/;
        const cur = diced[each];
        if(ltr.test(cur)){
          diced[each] = `$${diced[each]}`;
        }
      }
      let doubleDiced = diced.join('').split('');
      // * grace notes
      let remove = false;
      for(let each in doubleDiced){
        let current = doubleDiced[each];
        if(/[\{]/.test(current)){
          remove = true;
        }else if(/[\}]/.test(current)){
          remove = false;
        }

        if(remove && /[\$]/.test(current)){
          doubleDiced[each] = null;
        }

        if(current === '|' && doubleDiced[+each+1] === '$' && doubleDiced[+each+2] === ':'){
          doubleDiced[+each+1] = null;
        }else if(current === ':' && doubleDiced[+each+1] === '$' && doubleDiced[+each+2] === '|'){
          doubleDiced[+each+1] = null;
        }
      }
        this.completeBody.push(doubleDiced.join('').split('$'));
    }
  }

  onUpdateStaff() {
    // * build current abc string
    this.outputString = '';
    for(let row in this.completeBody){
      this.outputString += this.completeBody[row].join('') + '\n';
    }
    // * build staff image
    const abcHidden = document.getElementById('abcHidden');
    abcHidden.innerHTML = this.outputString;
    this.abcEditor = new abcjs.Editor(
      'abcHidden',
      { paper_id: 'paper' }
    )
  }

}

// }
