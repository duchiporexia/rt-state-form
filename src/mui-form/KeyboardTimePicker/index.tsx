import React from 'react';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, onDefaultChange, pickerWrapper } from '../../commons/form';
import { KeyboardTimePickerProps } from '@material-ui/pickers/TimePicker/TimePicker';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XKeyboardTimePickerProps = GenericProps<KeyboardTimePickerProps, FormValues>;
const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    autoOk: true,
    inputVariant: 'outlined',
} as Partial<XKeyboardTimePickerProps>;

export const XKeyboardTimePicker = rst.createS<FieldProps & Partial<XKeyboardTimePickerProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XKeyboardTimePickerProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return pickerWrapper(
        <KeyboardTimePicker
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
