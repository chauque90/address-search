import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-tile',
  templateUrl: './simple-tile.component.html',
  styleUrls: ['./simple-tile.component.css']
})
export class SimpleTileComponent implements OnInit {
  dynamicIcon: string = '#';
  toggleText: string = 'edit';
  toggleBoolean: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggleDoor() {
    this.toggleBoolean = !this.toggleBoolean;

    if (this.toggleBoolean == true) {
      this.dynamicIcon = '%';
      this.toggleText = 'close';
    } else {
      this.dynamicIcon = '#';
      this.toggleText = 'edit';
    }
  }
}
