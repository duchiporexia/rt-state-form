import * as React from 'react';
import { rst } from 'rt-state';
import { FormSearchCard } from './SearchCardDemo';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as _ from 'lodash';
import { xFormResources } from '../';

const resources = {
    zh: {
        translation: {
            'Username is required{{x}}': '必填用户名{{x}}',
            'Country is required': '国家是必填的',
            'Not an adult': '未成年',
            Username: '用户名',
            Gender: '性别',
        },
    },
};

i18n.use(initReactI18next)
    .init({
        resources: _.merge(resources, xFormResources),
        lng: 'en',
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false,
        },
    })
    .then();

export const App = rst.create((ctx) => {
    return () => {
        return (
            <div>
                <FormSearchCard />
                <br />
            </div>
        );
    };
});
