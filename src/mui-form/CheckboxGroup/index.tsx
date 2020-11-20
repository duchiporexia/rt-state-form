import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { rst } from 'rt-state';
import { FieldProps, FormValues, OnChangeProp, onDefaultChange } from '../../commons/form';
import Checkbox from '@material-ui/core/Checkbox';
import { CheckboxProps } from '@material-ui/core/Checkbox/Checkbox';
import { FormGroup, Typography } from '@material-ui/core';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export interface CheckboxGroupOptionsType {
    label?: string;
    value: string;
}

export type XCheckboxGroupProps = {
    label?: string;
    options: Array<CheckboxGroupOptionsType>;
    disabled?: boolean;
    fullWidth?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
} & OnChangeProp<FormValues>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
} as Partial<XCheckboxGroupProps>;

export const XCheckboxGroup = rst.create<FieldProps & Partial<XCheckboxGroupProps>>((ctx) => {
    const {
        form: { values },
        name,
    } = ctx.props;
    const state: { [key: string]: boolean } = values[name] ?? {};

    return (props) => {
        const { form, name: fieldName, ...otherProps } = props;
        const { touched, errors, values, fieldProps } = form;
        const { label = nameToLabel(fieldName), onChange, fullWidth, options, disabled, margin, size, ...other } = {
            ...DEFAULT_PROPS,
            ...otherProps,
            ...fieldProps[fieldName],
        } as XCheckboxGroupProps;

        const fieldValue = values[fieldName];
        const error = errors[fieldName];
        const touchedVal = touched[fieldName];
        const hasError = touchedVal && error !== undefined;

        return (
            <FormControl component="fieldset" fullWidth={fullWidth} margin={margin} error={hasError} {...other}>
                {label && <Typography>{label}</Typography>}

                <FormGroup row>
                    {options.map((item, idx) => {
                        const itemValue = item.value;
                        const controlProps: CheckboxProps = {
                            name: itemValue,
                            checked: state[itemValue],
                            value: fieldValue,
                            disabled,
                            size,
                            color: hasError ? 'default' : 'primary',
                            onChange: (event) => {
                                const { checked } = event.target;
                                state[itemValue] = checked;
                                onDefaultChange(state, fieldName, form, onChange);
                            },
                        };
                        return (
                            <FormControlLabel
                                key={idx}
                                control={<Checkbox {...controlProps} />}
                                label={
                                    <Typography component={'div'} color={hasError ? 'error' : undefined}>
                                        {transLabel(item.label) ?? item.value}
                                    </Typography>
                                }
                            />
                        );
                    })}
                </FormGroup>
                {hasError && <FormHelperText error={hasError}>{transError(error)}</FormHelperText>}
            </FormControl>
        );
    };
});
