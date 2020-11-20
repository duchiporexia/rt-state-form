import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { rst } from 'rt-state';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { FieldProps, FormValues, GenericProps, onDefaultChange, SelectOptionsType } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XSelectProps = {
    options: Array<SelectOptionsType>;
} & GenericProps<TextFieldProps, FormValues>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    variant: 'outlined',
    size: 'small',
} as Partial<XSelectProps>;

export const XSelect = rst.createS<FieldProps & Partial<XSelectProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, options, variant, ...other }: any = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XSelectProps;

    const id = `sel_${fieldName}`;
    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return (
        <TextField
            select
            label={transLabel(label)}
            name={fieldName}
            error={hasError}
            helperText={hasError ? transError(error) : ''}
            onChange={(e) => onDefaultChange(e.target.value, fieldName, form, onChange)}
            value={fieldValue}
            variant={variant}
            {...other}>
            {options.map((item) => (
                <MenuItem key={`${id}_${item.value}`} value={item.value}>
                    {item.label}
                </MenuItem>
            ))}
        </TextField>
    );
});
