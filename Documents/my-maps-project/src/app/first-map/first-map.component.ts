import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormGooglePlaceInput } from './google-place.model';
import { ErrorHandlerService } from './error-handler.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-first-map',
  templateUrl: './first-map.component.html',
  styleUrls: ['./first-map.component.scss']
})
export class FirstMapComponent implements OnInit {
  @Input() data: FormGooglePlaceInput;
  @Input() parentFormGroup: FormGroup;
  @Input() formStatus: any = {};

  inputModifer: boolean;
  ariaDescribedBy: string = '';
  ariaLabel: string = '';

  public title = 'Places';
  public addrKeys: string[];
  public addr: object;

  //Method to be invoked everytime we receive a new instance 
  //of the address object from the onSelect event emitter.
  setAddress(addrObj) {
    //We are wrapping this in a NgZone to reflect the changes
    //to the object in the DOM.
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
      this.inputModifer = false;
      this.parentFormGroup.controls[this.data.name].setValue(this.addr)
    });
  }

  constructor(private zone: NgZone) {}

  ngOnInit() {
    if (this.data)
    ErrorHandlerService.classDataValidator(this.data, ['name']);

  this.ariaDescribedBy = 'err_' + this.data.name + ' ';

      // Set default value
      if (this.data.value) {
        this.parentFormGroup.controls[this.data.name].setValue(this.data.value);
      }
  }

  change (event) {
    console.log(this.addr)
  }

  onBlur(event) {
    this.inputModifer = false;
  }

}
