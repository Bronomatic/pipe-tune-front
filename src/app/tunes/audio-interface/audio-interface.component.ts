import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import abcjs from 'abcjs';

@Component({
  selector: 'app-audio-interface',
  templateUrl: './audio-interface.component.html',
  styleUrls: ['./audio-interface.component.css']
})
export class AudioInterfaceComponent implements OnInit, OnDestroy {
  @Output() audioControlEvent: EventEmitter<Object> = new EventEmitter();
  @Input() tuneBody:String;
  // @Input() test:Observable<String>;

  synthControl = new abcjs.synth.SynthController();
  createSynth = new abcjs.synth.CreateSynth();

  audioSuccess = false;
  isPlaying = false;
  isLooping = false;

  constructor() { }

  ngOnInit() {
    this.loadAudio(this.synthControl, this.audioSuccess);
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
          synthControl.setTune(visualObj[0], false, audioParams)
            .then(() => {
              this.audioSuccess = this.createSynth.flattened.totalDuration >0 ? true : false;
              console.log("Audio successfully loaded.")
            }).catch((error) => {
              console.warn("Audio problem:", error);
            });
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
  }
}
