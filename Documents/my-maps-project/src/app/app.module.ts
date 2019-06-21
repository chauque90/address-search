import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FirstMapComponent } from './first-map/first-map.component';
import { GooglePlacesDirective } from './first-map/directive/google-places.directive';
import { SimpleTileComponent } from './simple-tile/simple-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstMapComponent,
    GooglePlacesDirective,
    SimpleTileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
