import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { rst } from 'rt-state';
import { FieldProps, FormValues, OnChangeProp, onDefaultChange } from '../../commons/form';
import { nameToLabel, TR, transError } from '../../commons';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import { Typography } from '@material-ui/core';
import { transLabel } from '../../commons/i18n/TR';

export interface RadioGroupOptionsType {
    label: string;
    value: string;
}

export type XRadioGroupProps = {
    label?: string;
    options: Array<RadioGroupOptionsType>;
    fullWidth?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
    classes?: XRadioClasses;
} & OnChangeProp<FormValues>;

export interface XRadioClasses {
    formControl?: string;
    formLabel?: string;
    radioGroup?: string;
    formControlLabel?: string;
    radio?: string;
    formHelperText?: string;
}

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    classes: undefined,
} as Partial<XRadioGroupProps>;

export const XRadioGroup = rst.createS<FieldProps & Partial<XRadioGroupProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, options, fullWidth, margin, size, classes, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XRadioGroupProps;
    const { formControl, formLabel, radioGroup, formControlLabel, radio, formHelperText } = classes ?? {};
    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return (
        <FormControl
            component="fieldset"
            fullWidth={fullWidth}
            margin={margin}
            error={hasError}
            className={formControl}
            {...other}>
            {label && (
                <Typography className={formLabel}>
                    <TR name={label}></TR>
                </Typography>
            )}
            <RadioGroup
                name={fieldName}
                value={fieldValue}
                row={true}
                onChange={(event) => onDefaultChange(event.target.value, fieldName, form, onChange)}
                className={radioGroup}>
                {options.map((item) => (
                    <FormControlLabel
                        key={`${item.label}_${item.value}`}
                        value={item.value}
                        control={
                            <Radio
                                icon={<CircleUnchecked />}
                                checkedIcon={<CircleCheckedFilled />}
                                color="primary"
                                size={size}
                                className={radio}
                            />
                        }
                        label={transLabel(item.label)}
                        className={formControlLabel}
                    />
                ))}
            </RadioGroup>
            {hasError && (
                <FormHelperText error={hasError} className={formHelperText}>
                    {transError(error)}
                </FormHelperText>
            )}
        </FormControl>
    );
});
