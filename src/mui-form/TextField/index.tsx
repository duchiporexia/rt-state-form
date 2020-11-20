import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XTextFieldProps<Values extends FormValues = FormValues> = GenericProps<TextFieldProps, Values>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    variant: 'outlined',
    size: 'small',
} as Partial<XTextFieldProps>;

export const XTextField = rst.createS<FieldProps & Partial<XTextFieldProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XTextFieldProps;
    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return (
        <TextField
            label={transLabel(label)}
            error={hasError}
            helperText={hasError ? transError(error) : ''}
            name={fieldName}
            onChange={(e) => {
                onDefaultChange(e.target.value, fieldName, props.form, onChange);
            }}
            value={fieldValue}
            {...(other as any)}
        />
    );
});
