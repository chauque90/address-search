import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  googleForm:  FormGroup;
  validationMessages = {};
  formStatus = {
    formErrors: {},
    submitClicked: false
  };
  errorCount: number;

  constructor(private formBuilder: FormBuilder){}
  
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formBuilder = new FormBuilder();
    this.googleForm = this.formBuilder.group({
      inputField: [{ value: '', }]
    });

    this.formStatus['formErrors'] = {
      'inputField': '',
    }

    this.validationMessages = {
      'inputField': {
        'required': 'Please enter an address'
      }
    }
    this.googleForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  markAllAsDirty() {
    // Mark all fields as dirty to trigger validation
    for (const key in this.googleForm.controls) {
      this.googleForm.controls[key].markAsDirty();
    }
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.googleForm) { return; }
    const form = this.googleForm;
    this.errorCount = 0;
    console.log(this.googleForm.controls['inputField'].value)
    // tslint:disable-next-line:forin
    for (const field in this.formStatus['formErrors']) {
      // clear previous error message (if any)
      this.formStatus['formErrors'][field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin

        for (const key in control.errors) {
          this.formStatus['formErrors'][field] += messages[key] + ' ';
          this.errorCount++;
        }

      }
    }
  }
}
