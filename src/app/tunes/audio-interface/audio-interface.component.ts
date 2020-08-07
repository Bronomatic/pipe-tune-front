import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import abcjs from 'abcjs';
import { Observable, Subscription } from 'rxjs';
import { TuneService } from '../tune.service';

@Component({
  selector: 'app-audio-interface',
  templateUrl: './audio-interface.component.html',
  styleUrls: ['./audio-interface.component.css']
})
export class AudioInterfaceComponent implements OnInit, OnDestroy {
  @Input() tuneBody:String;
  audioData: Subscription;

  synthControl = new abcjs.synth.SynthController();
  createSynth = new abcjs.synth.CreateSynth();

  audioSuccess = false;
  isPlaying = false;
  isLooping = false;
  dataSet = false;

  constructor(private tuneService: TuneService) { }

  ngOnInit() {
    this.audioData = this.tuneService
      .getAudioData()
      .subscribe(data => {
        this.tuneBody = data;
        this.dataSet = true;
        this.loadAudio(this.synthControl, this.audioSuccess);
      })
    if(!this.dataSet){
      this.tuneService.setAudioData(this.tuneBody);
      this.loadAudio(this.synthControl, this.audioSuccess);
    }
  }

  loadAudio(synthControl, audioSuccess) {
    var cursorControl = {};
    var abcOptions = { add_classes: true };
    var audioParams = { chordsOff: true };

    if (abcjs.synth.supportsAudio()) {
      synthControl.load("#audio", cursorControl, {});

      var visualObj = abcjs.renderAbc("paper", this.tuneBody, abcOptions);

      this.createSynth.init({ visualObj: visualObj[0] })
        .then(() => {
          return synthControl.setTune(visualObj[0], false, audioParams)
        })
        .then(() => {
          this.audioSuccess = this.createSynth.flattened.totalDuration >0 ? true : false;
          this.createSynth.flattened.instrument = 0;
        }).catch((error) => {
          console.warn("Audio problem:", error);
        });
    } else {
      document.querySelector("#audio").innerHTML = "Audio is not supported in this browser.";
    }
  }

  ngOnDestroy() {
    this.createSynth.stop();
    this.synthControl.destroy();
    this.audioData.unsubscribe();
  }
}
