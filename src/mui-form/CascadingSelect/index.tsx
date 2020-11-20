import React from 'react';
import { rst } from 'rt-state';
import { CascadingSelect, CascadingSelectProps } from './CascadingSelect';
import { FieldProps, FormValues, GenericProps, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import { transLabel } from '../../commons/i18n/TR';

export type XCascadingSelectProps<Values extends FormValues = FormValues> = GenericProps<CascadingSelectProps, Values>;

const DEFAULT_PROPS = {
    fullWidth: true,
    margin: 'normal',
} as Partial<XCascadingSelectProps>;

export const XCascadingSelect = rst.createS<FieldProps & Partial<XCascadingSelectProps>>((props) => {
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), options, variant, onChange, ...other } = {
        ...DEFAULT_PROPS,
        ...otherProps,
        ...fieldProps[fieldName],
    } as XCascadingSelectProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    return (
        <CascadingSelect
            label={transLabel(label)}
            variant={variant}
            options={options}
            error={hasError}
            helperText={hasError ? transError(error) : ''}
            onSelected={(value) => onDefaultChange(value, fieldName, form, onChange)}
            name={fieldName}
            value={fieldValue}
            {...other}
        />
    );
});
