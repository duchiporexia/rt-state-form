import React from 'react';
import { rst } from 'rt-state';
import { i18nDefaultState } from './common';
import { ErrorType } from '../validator';
import { useTranslation } from 'react-i18next';

export const TR = rst.createS<{ name: string; options?: any }>((props) => {
    const { t, ready } = useTranslation();
    if (ready) {
        return t(props.name, props.options);
    }
    return i18nDefaultState.inst.t(props.name, props.options);
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
