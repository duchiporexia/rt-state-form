import { rst, State, StateS, unstable_disableDelay } from 'rt-state';
import _ from 'lodash';
import {
    DataType,
    FieldType,
    FormValues,
    OnSubmitFuncType,
    TouchedType,
    TouchedValuesType,
    XFormConfig,
} from './common';
import { ErrorsType, ValidateType, Validator } from '../validator';
import { xFormInitLanguage } from '../i18n';

export function createXForm<Values extends FormValues = FormValues>(config: XFormConfig<Values>) {
    return new XForm(config);
}

export class XForm<Values extends FormValues = FormValues> {
    private readonly _initialValues: Values;
    private readonly _initialErrorValues: Values;
    private readonly _initialTouchedValues: TouchedValuesType<Values>;
    private _dirty: StateS<boolean>;
    private _validate?: ValidateType<Values>;
    private readonly _onSubmit?: OnSubmitFuncType<Values>;
    private readonly _values: State<Values>;
    private readonly _touched: State<TouchedType<Values>>;
    private readonly _errors: State<ErrorsType<Values>>;
    /////////////////////////////////////////
    fieldProps?: State<DataType<Values>>;

    get values() {
        return this._values;
    }

    get touched() {
        return this._touched;
    }

    get errors() {
        return this._errors;
    }

    get dirty() {
        return this._dirty.value;
    }

    constructor(config: XFormConfig<Values>) {
        // dirty, touched, errors, values
        const { initialValues } = config;
        this._initialValues = Object.freeze(_.cloneDeep(initialValues));
        const _initialErrorValues = {} as Values;
        const _initialTouchedValues = {} as TouchedValuesType<Values>;
        Object.keys(initialValues).forEach((key: FieldType<Values>) => {
            _initialErrorValues[key] = undefined;
            _initialTouchedValues[key] = false;
        });
        this._initialErrorValues = Object.freeze(_initialErrorValues);
        this._initialTouchedValues = Object.freeze(_initialTouchedValues);

        this._values = rst.state<Values>(initialValues, true, true);
        this._errors = rst.state<ErrorsType<Values>>(_initialErrorValues, true, true);
        this._touched = rst.state<TouchedType<Values>>(_initialTouchedValues, true, true);
        this.fieldProps = rst.state<DataType<Values>>(config.fieldProps ?? {}, true, true);
        this._dirty = rst.stateS<boolean>(false);
        this._validate = config.validate;
        this._onSubmit = config.onSubmit;
        this.initI18n();
    }

    private initI18n() {
        xFormInitLanguage({}).then();
    }

    setValidate = (validate: ValidateType<Values>) => {
        this._validate = validate;
    };

    validateForm = async () => {
        for (const field of Object.keys(this._initialErrorValues)) {
            await this.validateField(field as FieldType);
        }
    };

    validateField = async (field: keyof Values) => {
        const validateFunc = this._validate?.[field] as any;
        if (!validateFunc) {
            return;
        }
        const values = rst.extract(this._values);
        if (validateFunc instanceof Validator) {
            this._errors[field] = validateFunc.validate(values[field], field, values);
            return;
        }
        const ret = await validateFunc(values[field], field, values);
        if (ret === false) {
            this._errors[field] = 'Error';
            return;
        }
        if (ret && typeof ret === 'string') {
            this._errors[field] = ret;
            return;
        }

        this._errors[field] = undefined;
    };

    setFieldValue = async (field: FieldType<Values>, value: any, shouldValidate?: boolean) => {
        this._values[field] = value;
        this._dirty.value = true;
        if (shouldValidate ?? true) {
            await this.validateField(field);
        }
    };

    setFieldTouched = async (field: FieldType<Values>, touched?: boolean, shouldValidate?: boolean) => {
        this._touched[field] = touched ?? false;
        if (shouldValidate ?? true) {
            await this.validateField(field);
        }
    };

    setTouched = async (touched: boolean, shouldValidate?: boolean | undefined) => {
        for (const field of Object.keys(this._initialTouchedValues)) {
            await this.setFieldTouched(field, touched, false);
        }
        if (shouldValidate ?? true) {
            await this.validateForm();
        }
    };

    isValid = () => {
        const allErrors = rst.extract(this._errors);
        for (const errorName of Object.keys(allErrors)) {
            if (this._errors[errorName] !== undefined) {
                return false;
            }
        }
        return true;
    };

    getFieldError = (field: FieldType<Values>) => {
        return this._errors[field];
    };

    getFieldValue = (field: FieldType<Values>) => {
        return this._values[field];
    };

    isFieldTouched = (field: FieldType<Values>) => {
        return this._touched[field];
    };

    handleSubmit = async (e?: any) => {
        e?.preventDefault(); // eslint-disable-line
        await this.setTouched(true, true);
        const valid = this.isValid();
        if (valid && this._onSubmit) {
            await this._onSubmit(_.cloneDeep(rst.extract(this._values)));
        }
        return valid;
    };

    handleReset = async (e?: any) => {
        e?.preventDefault(); // eslint-disable-line
        await this.resetForm();
    };

    resetForm = async (values?: Values) => {
        if (values) {
            rst.setState(this._values, values, true);
        } else {
            rst.setState(this._values, this._initialValues, true);
        }
        rst.setState(this._errors, this._initialErrorValues, true);
        this._dirty.value = false;
        rst.setState(this._touched, this._initialTouchedValues, true);
    };
}

export async function onDefaultChange(value: any, fieldName: string, form: XForm, onChange?: OnChangeFuncType) {
    const { setFieldValue } = form;
    // fix bug for languages other than English.
    unstable_disableDelay(() => {
        form.values[fieldName] = value;
    });
    ///end.
    setFieldValue(fieldName, value).then(() => {
        onChange?.(value, fieldName, form); // eslint-disable-line
    });
}

export type OnChangeFuncType<Values extends FormValues = FormValues> = (
    value: any,
    field: string,
    form: XForm<Values>,
) => void | Promise<void>;
