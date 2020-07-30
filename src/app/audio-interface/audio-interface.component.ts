import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audio-interface',
  templateUrl: './audio-interface.component.html',
  styleUrls: ['./audio-interface.component.css']
})
export class AudioInterfaceComponent implements OnInit {
  @Output() audioControlEvent: EventEmitter<Object> = new EventEmitter();

  audioControl = {
    play: false,
    loop: false,
    restart: false
  }

  constructor() { }

  ngOnInit() { }

  onButtonClick(event) {
    const target = event.target;

    if(target.nodeName !== 'IMG') { return; }

    const control = target.parentElement;
    control.blur();

    switch(control.id) {
      case 'play':
        this.audioControl.play = true;
        break;
      case 'stop':
        break;
      case 'pause':
        this.audioControl.play = false;
        break;
      case 'restart':
        this.audioControl.restart = !this.audioControl.restart;
        break;
      case 'loop':
        this.audioControl.loop = !this.audioControl.loop;
        break;
      default:
        break;
    }
    this.audioControlEvent.emit(this.audioControl);

  }

}
