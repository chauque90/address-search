import { ErrorHandlerService, HANDLER_TYPE } from './error-handler.service';

class BaseModel {

  private static instance: BaseModel = null;
  
  // Restrict class creation to single instance.
  private constructor() {}
  
  baseErrorHandler(childClassInstance, childClassArgs = {}, requiredParams: Array<string>, handlerType: number): BaseModel {
    ErrorHandlerService.invalidArgumentsHandler(childClassInstance, childClassArgs, requiredParams, handlerType);

    return BaseModel.BaseModelInstance();
  }

  baseModelPropertyMapper(childClassInstance, args): BaseModel {
    if (typeof childClassInstance !== 'object') {
      return ErrorHandlerService._handlingType(HANDLER_TYPE.EXCEPTION, 'Please provide a valid argument[expects object] for first parameter.');
    }

    const _args = args || {};

    if (_args === {} || !_args) {
      return ErrorHandlerService._handlingType(HANDLER_TYPE.WARNING, 'Did you forget to pass an object of properties to assign to your class instance?')
    }

    for (let key in args) {
      childClassInstance[key] = _args[key];
    }

    return BaseModel.BaseModelInstance();
  }

  /* Maintain single instance of BaseModel per model.
      why: because there's a possibility of using the class multiple times within a model.
  */
  static BaseModelInstance () {
    return BaseModel.instance || (BaseModel.instance = new BaseModel());
  }
  
  static HandlerType() {
    return HANDLER_TYPE;
  }

  throwError(handlingType: number, message: string) {
    return ErrorHandlerService._handlingType(handlingType, message);
  }

}

export { BaseModel }
