import React from 'react';
import { DateTimePicker } from '@material-ui/pickers';
import { rst } from 'rt-state';
import { DateTimePickerProps } from '@material-ui/pickers/DateTimePicker/DateTimePicker';
import { FieldProps, FormValues, GenericProps, onDefaultChange, pickerWrapper } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XDateTimePickerProps = GenericProps<DateTimePickerProps, FormValues>;
const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    inputVariant: 'outlined',
    ampm: false,
    autoOk: true,
} as Partial<XDateTimePickerProps>;

export const XDateTimePicker = rst.createS<FieldProps & Partial<XDateTimePickerProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XDateTimePickerProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;
    return pickerWrapper(
        <DateTimePicker
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
