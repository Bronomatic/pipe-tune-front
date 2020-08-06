import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { UserComponent } from './user/user/user.component';
import { CreateComponent } from './tunes/create/create.component';
import { ViewComponent } from './view/view.component';
import { TuneListComponent } from './tunes/tune-list/tune-list.component';
import { AudioInterfaceComponent } from './tunes/audio-interface/audio-interface.component';
import { EditorComponent } from './tunes/editor/editor.component';
import { TitleComponent } from './title/title.component';
import { EditComponent } from './tunes/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NavComponent,
    LoginComponent,
    SignupComponent,
    UserComponent,
    CreateComponent,
    ViewComponent,
    TuneListComponent,
    AudioInterfaceComponent,
    EditorComponent,
    TitleComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
