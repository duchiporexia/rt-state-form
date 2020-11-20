import React from 'react';
import { DatePicker } from '@material-ui/pickers';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, onDefaultChange, pickerWrapper } from '../../commons/form';
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XDatePickerProps = GenericProps<DatePickerProps, FormValues>;
const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    inputVariant: 'outlined',
    autoOk: true,
} as Partial<XDatePickerProps>;

export const XDatePicker = rst.createS<FieldProps & Partial<XDatePickerProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XDatePickerProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return pickerWrapper(
        <DatePicker
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
