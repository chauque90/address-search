import { BaseModel } from './app.base-component.model';

export class FormGooglePlaceInput {
  public name: string;
  public placeholder?: string;
  public value?: string;
  
  constructor( args: FormGooglePlaceInput ) {

    BaseModel.BaseModelInstance()
    .baseModelPropertyMapper(this, args)
    .baseErrorHandler(this, args, ['name'], BaseModel.HandlerType().EXCEPTION);
  }
}
