import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';

import abcjs from 'abcjs';

@Component({
  selector: 'app-audio-interface',
  templateUrl: './audio-interface.component.html',
  styleUrls: ['./audio-interface.component.css']
})
export class AudioInterfaceComponent implements OnInit, OnDestroy {
  @Output() audioControlEvent: EventEmitter<Object> = new EventEmitter();
  @Input() tuneBody:{ body:String };

  synthControl = new abcjs.synth.SynthController();
  createSynth = new abcjs.synth.CreateSynth();

  isPlaying = false;
  isLooping = false;

  constructor() { }

  prog() {
    console.log(this.synthControl.percent * 100);
    console.log(this.createSynth.isRunning);
  }

  ngOnInit() {

    this.loadAudio(this.synthControl);
  }

  loadAudio(synthControl) {
    var cursorControl = {};
    var abcOptions = { add_classes: true };
    var audioParams = { chordsOff: true };

    if (abcjs.synth.supportsAudio()) {
      synthControl.load("#audio",
            cursorControl,
            {
                // displayLoop: true,
                // displayRestart: true,
                // displayPlay: true,
                // displayProgress: true,
                // displayWarp: true
            }
        );

      var visualObj = abcjs.renderAbc("paper", this.tuneBody.body, abcOptions);

      this.createSynth.init({ visualObj: visualObj[0] }).then(function () {
        synthControl.setTune(visualObj[0], false, audioParams).then(function () {
          console.log("Audio successfully loaded.")
        }).catch(function (error) {
          console.warn("Audio problem:", error);
        });
      }).catch(function (error) {
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
