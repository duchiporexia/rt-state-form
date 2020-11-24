import i18next, { i18n as i18nInst } from 'i18next';
import { rst } from 'rt-state';

export const i18nDefaultState = rst.state<{ inst: i18nInst }>({
    inst: null,
});

function i18nStateInit() {
    i18nDefaultState.inst = i18next.createInstance({
        resources: {},
        lng: 'en',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });
    i18nDefaultState.inst.init().then();
}
i18nStateInit();
