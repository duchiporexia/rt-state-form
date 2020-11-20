import { OnChangeFuncType, XForm } from './form';
import { ValidateType } from '../validator';

export type GenericProps<T, Values> = Omit<T, 'onChange' | 'name' | 'value'> & OnChangeProp<Values>;

export type OnChangeProp<Values> = {
    onChange?: OnChangeFuncType<Values>;
};

export interface FieldProps {
    form: XForm<any>;
    name: string;
}

export type TouchedType<Values> = {
    [K in keyof Values]?: boolean;
};

export type DataType<Values> = {
    [K in keyof Values]?: any;
};

export type FieldType<Values extends FormValues = FormValues> = keyof Values;

export type TouchedValuesType<Values> = {
    [key in keyof Values]: boolean;
};
export interface FormValues {
    [field: string]: any;
}

export type OnSubmitFuncType<Values> = (values: Values) => void | Promise<any>;

export interface XFormConfig<Values> {
    initialValues: Values;
    validate?: ValidateType<Values>;
    onSubmit?: OnSubmitFuncType<Values>;
    fieldProps?: {
        [key in keyof Values]?: any;
    };
}
