import UtilsAdapter from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';

export const pickerWrapper = (children: React.ReactNode) => {
    return <MuiPickersUtilsProvider utils={UtilsAdapter}>{children}</MuiPickersUtilsProvider>;
};

export * from './common';
export * from './option';
export * from './form';
