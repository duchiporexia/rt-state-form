import React from 'react';
import { rst } from 'rt-state';
import { i18n } from './common';
import { ErrorType } from '../validator';

export const TR = rst.createS<{ name: string; options?: any }>((props) => {
    return i18n.value.t(props.name, props.options);
});

export function transLabel(label: any) {
    if (typeof label === 'string') {
        return <TR name={label} />;
    }
    return label;
}

export const transError = (error: ErrorType) => {
    if (error == null) {
        return null;
    }
    let msg, options;
    if (typeof error === 'string') {
        msg = error;
    } else {
        msg = error.msg;
        options = error.options;
    }
    return <TR name={msg} options={options} />;
};
