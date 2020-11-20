import { rst } from 'rt-state';
import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { XSlider, XSliderProps } from './Slider';
import { FieldProps, FormValues, GenericProps, onDefaultChange } from '../../commons/form';
import { nameToLabel, transError } from '../../commons';
import Typography from '@material-ui/core/Typography';
import { transLabel } from '../../commons/i18n/TR';

export type XSliderFieldProps = {
    label?: ReactNode;
} & GenericProps<Omit<XSliderProps, 'intValues'>, FormValues>;

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: '100%',
        },
        dummy: {},
    };
});
function defaultValueRender(value: number) {
    return `${value}`;
}
export const XSliderField = rst.createS<FieldProps & Partial<XSliderFieldProps>>((props) => {
    const classes = useStyles(props);
    const { form, name: fieldName, ...otherProps } = props;
    const { touched, errors, values, fieldProps } = form;
    const { label = nameToLabel(fieldName), onChange, ...other } = {
        ...otherProps,
        ...fieldProps[fieldName],
    } as XSliderFieldProps;

    const fieldValue = values[fieldName];
    const error = errors[fieldName];
    const touchedVal = touched[fieldName];
    const hasError = touchedVal && error !== undefined;

    const valueRender = other.valueRender ?? defaultValueRender;

    return (
        <div className={classes.root}>
            <Grid container justify={'space-between'} alignItems={'center'}>
                <Typography>{transLabel(label) ?? fieldName}</Typography>
                <Typography>{`${valueRender(fieldValue?.[0])}-${other.valueRender(fieldValue?.[1])}`}</Typography>
            </Grid>

            <XSlider
                intValues={fieldValue}
                min={other.min}
                max={other.max}
                valueRender={other.valueRender}
                onChange={(values) => {
                    onDefaultChange(values, fieldName, form, onChange);
                }}
            />
            {hasError && <Typography color="error">{transError(error)}</Typography>}
        </div>
    );
});
