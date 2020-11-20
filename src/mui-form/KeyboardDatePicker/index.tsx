import React from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, onDefaultChange, pickerWrapper } from '../../commons/form';
import { KeyboardDatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XKeyboardDatePickerProps = GenericProps<KeyboardDatePickerProps, FormValues>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    inputVariant: 'outlined',
    autoOk: true,
} as Partial<XKeyboardDatePickerProps>;

export const XKeyboardDatePicker = rst.createS<FieldProps & Partial<XKeyboardDatePickerProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XKeyboardDatePickerProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return pickerWrapper(
        <KeyboardDatePicker
            label={transLabel(label)}
            error={hasError}
            helperText={hasError ? transError(error) : ''}
            onChange={(value) => onDefaultChange(value, fieldName, form, onChange)}
            name={fieldName}
            value={fieldValue}
            {...other}
        />,
    );
});
