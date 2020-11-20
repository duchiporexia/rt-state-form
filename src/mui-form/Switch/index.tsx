import React from 'react';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { rst } from 'rt-state';
import { FieldProps, FormValues, OnChangeProp, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { Typography } from '@material-ui/core';
import { transLabel } from '../../commons/i18n/TR';

export type XSwitchProps = {
    label?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
} & OnChangeProp<FormValues>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
} as Partial<XSwitchProps>;

export const XSwitch = rst.create<FieldProps & Partial<XSwitchProps>>((ctx) => {
    const {
        form: { values },
        name,
    } = ctx.props;
    const initialState = values[name];
    const state = rst.state({ isChecked: initialState });

    return (props) => {
        const { form, name: fieldName, ...otherProps } = props;
        const { touched, errors, values, fieldProps } = form;
        const { label = nameToLabel(fieldName), onChange, fullWidth, disabled, margin, size, ...other } = {
            ...DEFAULT_PROPS,
            ...otherProps,
            ...fieldProps[fieldName],
        } as XSwitchProps;
        const { isChecked } = state;

        const fieldValue = values[fieldName];
        const error = errors[fieldName];
        const touchedVal = touched[fieldName];
        const hasError = touchedVal && error !== undefined;

        const controlProps: SwitchProps = {
            checked: isChecked,
            name: fieldName,
            value: fieldValue,
            disabled,
            size,
            color: hasError ? 'default' : 'primary',
            onChange: (event) => {
                const { checked } = event.target;
                state.isChecked = checked;
                onDefaultChange(checked, fieldName, form, onChange);
            },
        };

        return (
            <FormControl fullWidth={fullWidth} margin={margin} error={hasError} {...other}>
                <FormControlLabel
                    control={<Switch {...controlProps} />}
                    label={
                        <Typography component={'div'} color={hasError ? 'error' : undefined}>
                            {transLabel(label)}
                        </Typography>
                    }
                />
                {hasError && <FormHelperText>{transError(error)}</FormHelperText>}
            </FormControl>
        );
    };
});
