import * as React from 'react';
import { rst } from 'rt-state';
import { FormSearchCard } from './SearchCardDemo';

export const ReactiveDemo = rst.create((ctx) => {
    return () => {
        return (
            <div>
                <FormSearchCard />
                <br />
            </div>
        );
    };
});
