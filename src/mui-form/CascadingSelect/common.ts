import * as React from 'react';
import { SelectOptionsType } from '../../commons/form';

export interface CascadingSelectOptionsType extends SelectOptionsType {
    children?: CascadingSelectOptionsType[];
}

export const ParentPopupState = React.createContext(null);
