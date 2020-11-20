import { tl } from '../i18n';
import { State } from 'rt-state';

export type ErrorType = string | { msg: string; options: any };
export type ErrorsType<Values> = {
    [K in keyof Values]?: ErrorType;
};

export class Validator {
    private _funcs: Array<(value: any, field: string, values: any) => ErrorType> = [];
    constructor(protected isArray: boolean = false) {}

    validate = (value: any, field: any, values: any) => {
        if (this.isArray) {
            if (Array.isArray(value)) {
                return tl('is not an array', { field });
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
