import { validate } from './validate';
import { ObjectValidator } from './object';

export function string(isArray?: boolean) {
    return new StringValidator(isArray);
}

export class StringValidator extends ObjectValidator {
    constructor(isArray?: boolean) {
        super(isArray);
    }

    min = (min: number, msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            if (value.length < min) {
                return {
                    msg: msg ?? 'Too short, minimum is {{min}} characters',
                    options: { field, min, ...options },
                };
            }
        });
    };
    max = (max: number, msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            if (value.length > max) {
                return {
                    msg: msg ?? 'Too long, maximum is {{max}} characters',
                    options: { field, max, ...options },
                };
            }
        });
    };
    email = (msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            const errors = validate.single(value, {
                email: true,
            });
            if (errors != null && errors[0]) {
                return {
                    msg: msg ?? 'Invalid email',
                    options: { field, ...options },
                };
            }
        });
    };
}
