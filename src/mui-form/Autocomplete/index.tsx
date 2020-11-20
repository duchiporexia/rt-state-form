import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, SelectOptionsType, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XAutocompleteProps = {
    label?: string;
    options: Array<SelectOptionsType>;
    textFieldProps?: {
        required?: boolean;
        fullWidth?: boolean;
        margin?: 'none' | 'dense' | 'normal';
        variant?: 'standard' | 'filled' | 'outlined';
        size?: 'small' | 'medium';
    };
} & GenericProps<Omit<AutocompleteProps<any, any, any, any>, 'renderInput'>, FormValues>;

export const XAutocomplete = rst.createS<FieldProps & Partial<XAutocompleteProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const {
        label = nameToLabel(fieldName),
        options,
        onChange,
        getOptionLabel = (option) => option.label,
        textFieldProps,
        ...autoCompleteProps
    } = { ...otherProps, ...fieldProps[fieldName] } as XAutocompleteProps;
    // Merge default textFieldProps with textFieldProps passed in the component
    const mergedTextFieldProps: TextFieldProps = {
        ...{
            required: false,
            fullWidth: true,
            margin: 'normal',
            size: 'small',
            variant: 'outlined',
        },
        ...textFieldProps,
    };

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    const isMultiple = autoCompleteProps.multiple;
    const isMultipleWithValue = isMultiple && fieldValue;
    const canBeRendered = !isMultiple || isMultipleWithValue;

    if (isMultiple && fieldValue === null) {
        console.error(`Initial value of autocomplete with name: "${fieldName}" cannot be null. Use [] instead.`);
    }

    return (
        <>
            {canBeRendered && (
                <Autocomplete
                    size={mergedTextFieldProps.size}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    onChange={(_, value) => onDefaultChange(value, fieldName, form, onChange)}
                    value={fieldValue}
                    getOptionSelected={(option, val) => option.value === val.value}
                    renderInput={(params) => (
                        <TextField
                            label={transLabel(label)}
                            {...params}
                            error={hasError}
                            helperText={hasError ? transError(error) : ''}
                            {...mergedTextFieldProps}
                        />
                    )}
                    {...autoCompleteProps}
                />
            )}
        </>
    );
});
