import React from 'react';
import ChipInput, {
    FilledTextFieldProps,
    OutlinedTextFieldProps,
    StandardTextFieldProps,
} from 'material-ui-chip-input';
import { rst } from 'rt-state';
import { FieldProps, FormValues, GenericProps, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XChipInputProps = GenericProps<
    StandardTextFieldProps | FilledTextFieldProps | OutlinedTextFieldProps,
    FormValues
>;

const DEFAULT_PROPS = {
    label: '',
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    // http://gcctech.org/csc/javascript/javascript_keycodes.htm
    // Enter, Space, Comma
    newChipKeyCodes: [13, 32, 188],
} as Partial<XChipInputProps>;

export const XChipInput = rst.create<FieldProps & Partial<XChipInputProps>>((ctx) => {
    const handleAddChip = (chip) => {
        const { form, name, onChange } = ctx.props;
        const { values } = form;
        const value = values[name];

        const newValue = [...value, chip];
        onDefaultChange(newValue, name, form, onChange);
    };

    const handleDeleteChip = (chip, index) => {
        const { form, name, onChange } = ctx.props;
        const { values } = form;
        const value = values[name];

        const newValue = value.filter((val, idx) => idx !== index);
        onDefaultChange(newValue, name, form, onChange);
    };

    return (props) => {
        const { form, name: fieldName, ...otherProps } = props;
        const { touched, errors, values, fieldProps } = form;
        const { label = nameToLabel(fieldName), onChange, required, fullWidth, margin, size, ...other }: any = {
            ...DEFAULT_PROPS,
            ...otherProps,
            ...fieldProps[fieldName],
        } as XChipInputProps;

        const id = `chip_${fieldName}`;

        const fieldValue = values[fieldName];
        const error = errors[fieldName];
        const touchedVal = touched[fieldName];
        const hasError = touchedVal && error !== undefined;

        return (
            <ChipInput
                label={transLabel(label)}
                required={required}
                value={fieldValue}
                InputProps={{
                    name: fieldName,
                    id: `input_${id}`,
                }}
                onAdd={handleAddChip}
                onDelete={handleDeleteChip}
                helperText={hasError ? transError(error) : ''}
                error={hasError}
                margin={margin}
                fullWidth={fullWidth}
                size={size}
                {...other}
            />
        );
    };
});
