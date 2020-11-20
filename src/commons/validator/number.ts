import { ObjectValidator } from './object';

export function number(isArray?: boolean) {
    return new NumberValidator(isArray);
}

export class NumberValidator extends ObjectValidator {
    constructor(isArray?: boolean) {
        super(isArray);
    }

    required = (msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            if (typeof value !== 'number') {
                return {
                    msg: msg ?? 'Required',
                    options: { field, ...options },
                };
            }
        });
    };
    min = (min: number, msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            if (value < min) {
                return {
                    msg: msg ?? 'Minimum is {{min}}',
                    options: { field, min, ...options },
                };
            }
        });
    };
    max = (max: number, msg?: string, options?: any) => {
        return this.addFunc((value: any, field: string) => {
            if (value > max) {
                return {
                    msg: msg ?? 'Maximum is {{max}}',
                    options: { field, max, ...options },
                };
            }
        });
    };
}
