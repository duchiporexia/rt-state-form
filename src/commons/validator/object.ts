import { ErrorType, Validator } from './common';

export function object(isArray?: boolean) {
    return new ObjectValidator(isArray);
}

export class ObjectValidator extends Validator {
    constructor(isArray?: boolean) {
        super(isArray);
    }

    required = (msg?: string, options?: any) => {
        this.requiredOption.required = true;
        this.requiredOption.msg = msg ?? this.requiredOption.msg;
        this.requiredOption.options = options ?? this.requiredOption.options;
        return this;
    };

    check = (cb: (value: any, field: string, values: any) => ErrorType) => {
        return this.addFunc(cb);
    };
}
