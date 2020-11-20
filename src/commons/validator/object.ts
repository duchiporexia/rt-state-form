import { ErrorType, Validator } from './common';
import { isInvalidDate } from '../date';

export function object(isArray?: boolean) {
    return new ObjectValidator(isArray);
}

export class ObjectValidator extends Validator {
    constructor(isArray?: boolean) {
        super(isArray);
    }

    required = (msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            let hasError = false;
            if (value == null) {
                hasError = true;
            }
            if (!hasError && isInvalidDate(value)) {
                hasError = true;
            }
            if (hasError) {
                return {
                    msg: msg ?? 'Required',
                    options: { field, ...options },
                };
            }
            return undefined;
        });
    };

    check = (cb: (value: any, field: string, values: any) => ErrorType) => {
        return this.addFunc((value: any, field: string, values: any) => {
            return cb(value, field, values);
        });
    };
}
