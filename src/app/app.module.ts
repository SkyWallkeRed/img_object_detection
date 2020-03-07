import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImgObjectDetectComponent } from './components/img-object-detect.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideoObjectDetectComponent } from './components/video-object-detect.component';

@NgModule({
  declarations: [
    AppComponent,
    ImgObjectDetectComponent,
    VideoObjectDetectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
