import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TuneModel } from '../tune.model';
import { FormBuilder, FormGroup } from '@angular/forms';

import abcjs from 'abcjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() data: TuneModel;
  @Input() hide: Boolean;
  @Input() edit: Boolean;

  tuneForm: FormGroup;
  abcEditor: abcjs.Editor;

  addNoteValue = ['A', '1'];

  showSongForm = true;
  showNoteBuild = true;
  showSymbols = true;

  tuneBody = '';
  fullTune = '';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.tuneForm = this.formBuilder.group({
      title: this.data.title,
      composer: this.data.composer,
      origin: this.data.origin,
      meter: this.data.meter,
      type: this.data.type,
      share: this.data.share,
      tempo: this.data.tempo,
      body: this.data.body,
    })
    const filteredBody = this.data.body.split('HP\n')[1];
    this.tuneBody = filteredBody ? filteredBody : '| ';
    this.onChanges();

    // * create editor
    this.abcEditor = new abcjs.Editor(
      'abcHidden',
      { paper_id: 'paper' }
    )
    this.signalChange();
  }

  onChanges() {
    // * updates form values
    this.tuneForm.valueChanges.subscribe(value => {
      const newData:TuneModel = {
        creator: value.creator,
        title: value.title,
        composer: value.composer,
        origin: value.origin,
        meter: value.meter,
        type: value.type,
        share: value.share,
        tempo: value.tempo,
        body: value.body,
      }
      this.data = newData;
      this.signalChange();
    })
  }

  onAddNoteValue(event:any) {
    const currentElement = event.target.id ? event.target : event.target.parentNode;
    currentElement.blur();
    if(!currentElement || currentElement.id === 'pitch' || currentElement.id === 'time'){return}
    // * remove 'glow' class from all sibling buttons
    const siblings = currentElement.parentNode.childNodes;
    for(let each of Object.keys(siblings)){
      siblings[each].classList.remove('glow');
    }
    // * add 'glow' class on current element
    currentElement.classList.add('glow');
    // * add correct value to addNote button
    const category = currentElement.parentNode.id;
    if(category === 'time'){
      this.addNoteValue[1] = currentElement.id.split('-')[1];
    }else if(category === 'pitch'){
      this.addNoteValue[0] = currentElement.id;
    }
    this.signalChange();
  }

  onAddNoteToBody() {
    this.tuneBody += (this.addNoteValue[0] + this.addNoteValue[1]);
    this.signalChange();
  }

  onAddSymbols(event: any) {
    const id = event.target.id;
    if(!id){return}
    let data: String;
    if(id.split('').length < 3){
      data = ` ${id} `;
    }else if(id === 'new-line'){
      data = '\n';
    }else if(id === 'space'){
      data = ' ';
    }
    if(data){
      this.tuneBody += data;
      this.signalChange();
    }
  }

  signalChange() {
    const abcHidden = document.getElementById('abcHidden');
    this.data.body = abcHidden.innerHTML = `X:1\nT:${this.data.title}\nC:${this.data.composer}\nS:${this.data.origin}\nM:${this.data.meter}\nL:1/8\nQ:1/4=${this.data.tempo}\nK:HP\n${this.tuneBody}`;
    abcHidden.dispatchEvent(new Event('change'));
  }

}
