import { Component, OnInit } from '@angular/core';
import { CreateService } from './create.service';

import abcjs from 'abcjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { async } from 'rxjs/internal/scheduler/async';
import { promise } from 'protractor';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: [
    './create.component.css'
  ]
})
export class CreateComponent implements OnInit {
  data = {title:'New Tune',composer:'Traditional',origin:'Scotland',meter:'4/4',tempo:90};
  abcBody = '| ';
  audioSuccess = false;

  addNoteValue = ['A', '1'];

  createSynth = new abcjs.synth.CreateSynth();
  synthControl = new abcjs.synth.SynthController();
  abcEditor:abcjs.Editor;

  playing = false;
  clicked = false;

  showNoteBuild = true;
  showSymbolBuild = true;
  showSongForm = true;

  tuneForm: FormGroup;

  constructor(private createService: CreateService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // * form group for head
    this.tuneForm = this.formBuilder.group({
      title: this.data.title,
      composer: this.data.composer,
      origin: this.data.origin,
      meter: this.data.meter,
      tempo: this.data.tempo
    })
    this.onChanges();
    // * Start the editor
    this.abcEditor = new abcjs.Editor(
      "abcHidden",
      { paper_id: "paper" }
    )
    this.signalChange();
  }

  onChanges(): void {
    this.tuneForm.valueChanges.subscribe(value => {
      let newData = {
        title: value.title,
        composer: value.composer,
        origin: value.origin,
        tempo: value.tempo,
        meter: value.meter
      }
      this.data = newData;
      this.signalChange();
    })
  }

  loadAudio(synthControl:Object) {
    this.audioSuccess = true;
    // * load sound
    var audioParams = {
      chordsOff: true
    };

    if (abcjs.synth.supportsAudio()) {
      var visualObj = abcjs.renderAbc(
        "paper",
        this.abcBody,
        { add_classes: true }
      );
      this.createSynth.init({ visualObj: visualObj[0] })
        .then((synthControl:Object) => {
          this.synthControl.setTune(visualObj[0], false, audioParams)
            .then(() => {
              console.log("Audio successfully loaded.");
            }).catch((error) => {
              console.warn("Audio problem:", error);
            });
        }).catch((error) => {
          console.warn("Audio problem:", error);
        });
    } else {
      document.getElementById('audio').innerHTML = 'Sorry! Audio is not supported on this browser';
    }

  }

  onAddNoteValue(event) {
    // * find parent to get button type
    const btnValue = event.target.id;
    if(!btnValue || btnValue === 'pitch' || btnValue === 'time'){return}
    console.log(btnValue);
    let parent:String;
    (() => {
      let currentParent = event.target.parentNode;
      while(!currentParent.id){
        currentParent = currentParent.parentNode;
      }
      parent = currentParent.id;
    })()
    // * change note value
    if(parent === 'time'){
      this.addNoteValue[1] = btnValue.split('-')[1];
    }else if(parent === 'pitch'){
      this.addNoteValue[0] = btnValue;
    }
    // * remove active from buttons
    let noteButtons = document.getElementsByClassName('note');
    Object.values(noteButtons).forEach(each => {
      each.classList.remove('active');
    })
    // * add correct active to buttons
    // document.getElementById(this.addNoteValue[0]).classList.add('active');

    // document.getElementById(`t-${this.addNoteValue[1]}`)
    //   .parentNode
    //   .classList
    //   .add('active');

    // console.log(this.addNoteValue[0] + this.addNoteValue[1]);
  }

  onAddNoteToBody() {
    this.abcBody += this.addNoteValue[0] + this.addNoteValue[1];
    this.signalChange();
  }

  signalChange() {
    const hiddenText = document.getElementById('abcHidden');
    hiddenText.innerHTML = `X:1\nT: ${this.data.title}\nC: ${this.data.composer}\nS: ${this.data.origin}\nM ${this.data.meter}\nL: 1/8\nG: ${this.data.tempo}\n{{ ${this.abcBody}`;
    const abcTextArea = document.getElementById('abcHidden');
    abcTextArea.dispatchEvent(new Event('change'));
  }

  addStaffSymbols(event) {
    console.log(event.target.id);
    const data = event.target.id;
    if(!data || data === 'symbols'){
      return
    }else if(data === 'nl'){
      this.abcBody += String.fromCharCode(10);
    }else if(data === 'sp'){
      this.abcBody += String.fromCharCode(32);
    }else{
      this.abcBody += data;
    }
  }

  onPlay() { this.synthControl.play(); this.playing = true }

  onStop() { this.synthControl.pause(); this.synthControl.restart(); this.playing = false }

  onPause() { this.synthControl.pause(); this.playing = false }

  onLoop() { this.synthControl.toggleLoop(); this.clicked = !this.clicked }

  onRestart() { this.synthControl.restart() }

}
