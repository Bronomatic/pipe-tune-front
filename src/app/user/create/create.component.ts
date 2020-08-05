import { Component, OnInit, ViewChild } from '@angular/core';

import { UserService } from '../user.service';
import { TuneService } from 'src/app/tune.service';

import { TuneModel } from '../../tune.model';
import { EditorComponent } from 'src/app/editor/editor.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: [
    './create.component.css'
  ]
})
export class CreateComponent implements OnInit {
  @ViewChild(EditorComponent, null) child;
  username = this.userService.getUsername();

  data: TuneModel = {
    title:'New Tune',
    composer:'Traditional',
    origin:'Scotland',
    meter:'4/4',
    tempo: 90,
    type: 'March',
    creator: this.username,
    share: true,
    body:'| '
  };
  abcBody = '| ';

  addNoteValue = ['A', '1'];
  id:String;
  userId = this.userService.getUserId();

  showNoteBuild = true;
  showSymbolBuild = true;
  showSongForm = true;
  showToSave = false;
  share = true;

  constructor(
    private userService: UserService,
    private tuneService: TuneService,
  ) { }

  ngOnInit() { }

  onSaveTune() {
    const saveData = this.child.data;
    const token = this.userService.getToken();
    if(!this.id){
      // * If this is a new tune
      this.tuneService.onCreateTune(saveData, token);
    }else{
      // * If this is an edit of an existing tune
    }
  }
}