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
    tempo:90,
    type:'March',
    creator: this.username,
    share:true, body:''};
  abcBody = '| ';

  addNoteValue = ['A', '1'];
  id:String;
  userId = this.userService.getUserId();

  // createSynth = new abcjs.synth.CreateSynth();
  // synthControl = new abcjs.synth.SynthController();
  // previous = {loop:false, restart:false}
  // playing = false;
  // audioSuccess = false;

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


  onPreSave() {
    // * hide interface and show current abc
    this.showToSave = true;
    this.data = this.child.data;
  }

  onSaveTune() {
    const token = this.userService.getToken();
    if(!this.id){
      // * If this is a new tune
      this.tuneService.onCreateTune(this.data, token);
    }else{
      // * If this is an edit of an existing tune
    }
  }

/*
  audioControlHandler(control: {play:boolean, loop:boolean, restart:boolean}) {
    // * Play and pause
    if(control.play && !this.playing){
      this.playing = true;
      this.synthControl.play();
    }else if(!control.play && this.playing){
      this.playing = false;
      this.synthControl.pause();
    }
    // * toggle loop
    if(control.loop !== this.previous.loop){
      this.synthControl.toggleLoop();
    }
    this.previous.loop = control.loop;
    // * restart tune
    if(control.restart !== this.previous.restart){
      this.synthControl.restart();
    }
    this.previous.restart = control.restart;

  }
*/
}