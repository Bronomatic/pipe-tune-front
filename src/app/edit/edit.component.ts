import { Component, OnInit, ViewChild } from '@angular/core';
import { TuneService } from '../tune.service';
import { UserService } from '../user/user.service';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild(EditorComponent, null) child;
  data:any = this.tuneService.getTuneToEdit();
  showToSave = false;

  constructor(private tuneService: TuneService, private userService: UserService) { }

  ngOnInit() { }

  onUpdateTune() {
    const id = this.data._id;
    const updateData = this.child.data;
    updateData.creator = this.userService.getUsername();
    updateData.id = id;
    const token = this.userService.getToken();
    this.tuneService.updateTune(updateData, token);
  }

}
