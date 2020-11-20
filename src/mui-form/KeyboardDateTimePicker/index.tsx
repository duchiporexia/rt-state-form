import React from 'react';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, onDefaultChange, pickerWrapper } from '../../commons/form';
import { KeyboardDateTimePickerProps } from '@material-ui/pickers/DateTimePicker/DateTimePicker';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XKeyboardDateTimePickerProps = GenericProps<KeyboardDateTimePickerProps, FormValues>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    autoOk: true,
    inputVariant: 'outlined',
} as Partial<XKeyboardDateTimePickerProps>;

export const XKeyboardDateTimePicker = rst.createS<FieldProps & Partial<XKeyboardDateTimePickerProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XKeyboardDateTimePickerProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return pickerWrapper(
        <>
            <KeyboardDateTimePicker
                label={transLabel(label)}
                error={hasError}
                helperText={hasError ? transError(error) : ''}
                onChange={(value) => onDefaultChange(value, fieldName, form, onChange)}
                name={fieldName}
                value={fieldValue}
                {...other}
            />
        </>,
    );
});
