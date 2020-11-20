import React from 'react';
import { TimePicker } from '@material-ui/pickers';
import { rst } from 'rt-state';
import { TimePickerProps } from '@material-ui/pickers/TimePicker/TimePicker';
import { FieldProps, FormValues, GenericProps, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XTimePickerProps = GenericProps<TimePickerProps, FormValues>;
const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    inputVariant: 'outlined',
    autoOk: true,
} as Partial<XTimePickerProps>;

export const XTimePicker = rst.createS<FieldProps & Partial<XTimePickerProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XTimePickerProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;
    return (
        <TimePicker
            label={transLabel(label)}
            error={hasError}
            helperText={hasError ? transError(error) : ''}
            onChange={(value) => onDefaultChange(value, fieldName, form, onChange)}
            name={fieldName}
            value={fieldValue}
            {...other}
        />
    );
});
