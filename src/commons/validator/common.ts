import { State } from 'rt-state';
import { isInvalidDate } from '../date';

export type ErrorType = string | { msg: string; options: any };
export type ErrorsType<Values> = {
    [K in keyof Values]?: ErrorType;
};
export interface RequiredOption {
    required: boolean;
    msg: string;
    options?: any;
}

export class Validator {
    private _funcs: Array<(value: any, field: string, values: any) => ErrorType> = [];
    protected requiredOption: RequiredOption = { required: false, msg: 'Required' };
    constructor(protected isArray: boolean = false) {}

    validateRequired = (value: any, field: any): ErrorType => {
        if (!this.requiredOption.required) {
            return undefined;
        }
        const { msg, options } = this.requiredOption;
        let hasError = false;
        if (value == null || value === '') {
            hasError = true;
        }
        if (!hasError) {
            if (isInvalidDate(value)) {
                hasError = true;
            } else if (this.isArray) {
                if (!Array.isArray(value) || (value as any[]).length === 0) {
                    hasError = true;
                }
            }
        }

        if (hasError) {
            return {
                msg: msg ?? 'Required',
                options: { field, ...options },
            };
        }
        return undefined;
    };

    validate = (value: any, field: any, values: any): ErrorType => {
        const error = this.validateRequired(value, field);
        if (error !== undefined) {
            return error;
        }

        if (this.isArray) {
            if (!Array.isArray(value)) {
                return {
                    msg: '{{field}} is not an array',
                    options: { field },
                };
            }
            for (const idx in value) {
                const error = this._validateSingle(value[idx], field, values);
                if (error !== undefined) {
                    return error;
                }
            }
            return undefined;
        }
        return this._validateSingle(value, field, values);
    };
    _validateSingle = (value: any, field: string, values: any) => {
        const funcs = this._funcs;
        for (const func of funcs) {
            const error = func(value, field, values);
            if (error !== undefined) {
                return error;
            }
        }
        return undefined;
    };
    addFunc = (cb: (value: any, field: string, values: any) => ErrorType) => {
        this._funcs.push(cb);
        return this;
    };
}

type ValidateFuncType<Values> = (
    value: any,
    field: keyof Values,
    values: State<Values>,
) => boolean | string | Promise<boolean | string>;

export type ValidateType<Values> = {
    [K in keyof Values]?: ValidateFuncType<Values> | Validator;
};
