import React, { ReactNode } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { rst } from 'rt-state';
import Checkbox from '@material-ui/core/Checkbox';
import { CheckboxProps } from '@material-ui/core/Checkbox/Checkbox';
import { FieldProps, FormValues, OnChangeProp, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { Typography } from '@material-ui/core';
import { transLabel } from '../../commons/i18n/TR';

export type XCheckboxProps<Values extends FormValues = FormValues> = {
    label?: ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
} & OnChangeProp<Values>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
} as Partial<XCheckboxProps>;

export const XCheckbox = rst.create<FieldProps & Partial<XCheckboxProps>>((ctx) => {
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
        } as XCheckboxProps;
        const { isChecked } = state;

        const fieldValue = values[fieldName];
        const error = errors[fieldName];
        const touchedVal = touched[fieldName];
        const hasError = touchedVal && error !== undefined;

        const controlProps: CheckboxProps = {
            name: fieldName,
            checked: isChecked,
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
                    control={<Checkbox {...controlProps} />}
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
