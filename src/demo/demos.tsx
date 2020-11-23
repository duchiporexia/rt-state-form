import * as React from 'react';
import { rst } from 'rt-state';
import { XTableDemo } from './TableDemo';

export const ReactiveDemo = rst.create((ctx) => {
    return () => {
        return (
            <div>
                <XTableDemo />
                <br />
            </div>
        );
    };
});
