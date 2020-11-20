import React, { ReactNode } from 'react';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import { rst } from 'rt-state';
import { debounce } from '../../commons/utils';

export interface XSliderProps {
    intValues: number[];
    min: number;
    max: number;
    valueRender?: (value: number) => ReactNode;
    onChange?: (values: number[]) => void;
}

export const XSlider = rst.create<XSliderProps>((ctx) => {
    const state = rst.stateS(ctx.props.intValues);
    const cb = debounce(() => ctx.props.onChange(state.value), 200);
    const handleChange = (event, newValue) => {
        state.value = newValue;
        cb();
    };

    const ValueLabelComponent = ({ children, open, value }) => {
        const { valueRender } = ctx.props;
        return (
            <Tooltip open={open} placement="bottom" title={valueRender?.(value) ?? defaultValuetext(value)}>
                {children}
            </Tooltip>
        );
    };

    return (props) => {
        return (
            <Slider
                value={state.value}
                onChange={handleChange}
                min={props.min}
                max={props.max}
                ValueLabelComponent={ValueLabelComponent}
                valueLabelDisplay="auto"
            />
        );
    };
});

function defaultValuetext(value: any) {
    return `${value}`;
}
