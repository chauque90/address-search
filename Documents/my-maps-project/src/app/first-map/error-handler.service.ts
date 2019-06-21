import { Injectable } from '@angular/core';

export type propType = (Array<string> | {key?: string , properties?: Array<string>}) | any;

export const HANDLER_TYPE = {
  'INFO'      : 1,
  'ERROR'     : 2,
  'WARNING'   : 3,
  'EXCEPTION' : 4
};

@Injectable()
export class ErrorHandlerService {

  constructor() {}

  /**
   * @description For general error handling where we want to easily point where the error is coming from, e.g AlertModel.
  */
  static defaultHandler(classInstance: any, errorMessage?: any, _throw?: boolean): void {
    
    const instance = classInstance.constructor.name;
    const errMessage = errorMessage ? errorMessage.concat(`\nOccured in ${ instance }`) : `Error occured in ${ instance }`;
    
    if(_throw)
      ErrorHandlerService._handlingType(HANDLER_TYPE.EXCEPTION,  errMessage);
    
    console.log(errMessage);
  }

  static getDefinedMessages(instance?: object) {
    const COMPONENT_NAME = instance.constructor.name || '';

    return {
      'MINIMAL-COMPONENT-SETUP' : 
        `Please note that your ${COMPONENT_NAME} component has been set up with the default configuration options. Please refer to the documentation here: https://gitlab.com/africa-design-office/mechano/tree/dev#documentation if you would like to make use of any of the features this component offers.`
    }

  }

  /**
   * @description This is used to select the type of handling we want, e.g warn the 'user' using console.warn or throw an exception, etc.
  */
  static _handlingType(handlingType: number, handlingMessage: any) {
    
    // Here we ensure that users do not break our handler by passing
    // invalid handling types
    if (
      handlingType !== HANDLER_TYPE.INFO      &&
      handlingType !== HANDLER_TYPE.ERROR     &&
      handlingType !== HANDLER_TYPE.WARNING   &&
      handlingType !== HANDLER_TYPE.EXCEPTION
    ) {
      return this._handlingType(HANDLER_TYPE.EXCEPTION, `Expected handling types:  1 || 2 || 3 || 4. You passed: ${ handlingType }`)
    }

    switch (handlingType) {
      case HANDLER_TYPE.ERROR:
        console.error(handlingMessage);
      break;

      case HANDLER_TYPE.WARNING:
        console.warn(handlingMessage);
      break;

      case HANDLER_TYPE.INFO:
        console.info(handlingMessage);
      break;

      case HANDLER_TYPE.EXCEPTION:
        throw handlingMessage;
      default:
        console.warn(handlingMessage);
    }
  }

  /**
   * @description This will gaurd against stealthy data passed/sneaked through our views/HTML template.
  */
  static classDataValidator<O, K extends keyof O>(obj: O, keys: K[], classInstance?: object) {
    if(keys === null) return;

    let className = classInstance ?  classInstance.constructor.name + ' component': 'component';

    // Because we cannot have a component name that's 2 characters long
    // we are making this assumption so that we can tell if we are dealing with
    // compiled code so that we can use a better default component name in that case.
    if (classInstance) {
      if (classInstance.constructor.name.length < 2) {
        className = 'Component';
      }
    }
  
    if (obj) {
      keys.map( key => {
        if ((!obj[key] && (obj[key] as any) !== false)  || obj[key] === null || obj[key] === undefined) {
          if (!obj.hasOwnProperty(key)) {
            this._handlingType(HANDLER_TYPE.EXCEPTION, `
            Please provide a '${ key }' property.
            This might have been caused by passing data directly from the template. Check data passed to your ${className}`);
          }
        }
      });
    } else {
       this._handlingType(HANDLER_TYPE.EXCEPTION, `
            This error may have been caused by trying to use a ${className}
            without the required [data] input property or other required [input] properties, e.g (${keys.join(', ')}).
            ${obj}
            `);
    }

  }

  /**
   * @description Deals with instances where one passes invalid or unexpected properties as class arguments.
   * This needs to work even when we do not have properties explicitly defined as class member variables(might be challenging)
  */

  static invalidArgumentsHandler(classInstance: Object, classArgs: Object, expectedArgs?: propType, handlingType?: number): void {
    const passedArgs   = Object.getOwnPropertyNames(classArgs);
    const allowedArgs  = Object.getOwnPropertyNames(classInstance);
    const requiredArgs: propType = expectedArgs || [];
    
    if (requiredArgs.length > 0 && passedArgs.length == 0) {
      this._handlingType(handlingType? handlingType : HANDLER_TYPE.ERROR,
      `Object(${ passedArgs.join('\n') }) passed cannot be matched against required(${ requiredArgs.join(', ')}) arguments. Did you pass an empty object?`);
    }

    for (const passedArgsKey of passedArgs) {
      if (allowedArgs.indexOf(passedArgsKey) < 0) {
        this._handlingType(handlingType? handlingType : HANDLER_TYPE.WARNING,
         `Oops, You passed: '${passedArgsKey}' to the ${ classInstance.constructor.name } Class/Object as argument/property, which does not exist in the model.
          Allowed arguments/properties are\n\n${allowedArgs.join('\n')}`);
      }
    }

    if (requiredArgs) {
      for (const requiredArgsKey of requiredArgs) {
        passedArgs.map( _ => {
          if (!requiredArgsKey) {
            this._handlingType(handlingType? handlingType : HANDLER_TYPE.EXCEPTION, `Invalid required key (key passed: '${ requiredArgsKey }' ) provided at index ${ requiredArgs.indexOf(requiredArgsKey) } `);
          }

          if (requiredArgsKey && passedArgs.indexOf(requiredArgsKey) < 0) {
            try {
              if(typeof requiredArgsKey === 'object') {

                if (requiredArgsKey.key && passedArgs.indexOf(requiredArgsKey.key) < 0) {
                  this._handlingType(HANDLER_TYPE.WARNING, `'Key', ${requiredArgsKey.key}, ' not found and it is required.`);
                }

                (requiredArgsKey || {properties: []}).properties.map((item, index, arr) => {
                  if (Object.keys(classInstance[(requiredArgsKey || {}).key]).indexOf(item) < 0) {
                    return this._handlingType(HANDLER_TYPE.EXCEPTION, `Key, '${item}' , not found in, ${(requiredArgsKey || {}).key}, you passed : ${JSON.stringify(classInstance[(requiredArgsKey || {}).key])}. Please pass the key '${item}' in the '${requiredArgsKey.key}' object`);
                  }
                });
              }
            } catch (e) {
              ErrorHandlerService._handlingType(HANDLER_TYPE.WARNING, `Could not lookup required properties. See ${e}. This may have been caused by how you defined your model: ${classInstance.constructor.name}`)
            }

            // Object props should be handled by the previous statements.
            if (typeof requiredArgsKey !== 'object') {
              this._handlingType(handlingType? handlingType : HANDLER_TYPE.ERROR, `\nMissing key: '${ requiredArgsKey }' is required.\n\nRequired properties(${classInstance.constructor.name}):\n\n${ requiredArgs.join('\n') }
              \n\nnot found in passed object: \n\n${ passedArgs.join('\n') === 'length' ? '[]' : passedArgs.join('\n')}`);
            }
          }
        });
      }
    }
  }
}
