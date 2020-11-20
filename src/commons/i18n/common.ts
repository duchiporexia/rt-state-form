import i18next, { TFunction, i18n as i18nInst, Resource } from 'i18next';
import { stateS } from 'rt-state';
import { lanResources } from './lanResources';

export const i18n = stateS<{ t: TFunction; formI18n: i18nInst }>({
    t: function () {},
    formI18n: null,
});

export function xFormSetLanguage(lng: string) {
    const { value } = i18n;
    value.formI18n.changeLanguage(lng).then((t) => {
        value.t = t;
        i18n.forceUpdate();
    });
}

export function xFormGetLanguage() {
    const { value } = i18n;
    return value.formI18n?.language ?? 'en';
}

export async function xFormInitLanguage(config: { resources?: Resource; lng?: string }) {
    const { value } = i18n;
    if (!value.formI18n) {
        value.formI18n = i18next.createInstance({
            resources: lanResources,
            lng: config.lng ?? 'en',
            keySeparator: false,
            interpolation: {
                escapeValue: false,
            },
        });
        value.t = await value.formI18n.init();
        const { resources } = config;
        if (resources) {
            for (const lan of Object.keys(resources)) {
                const resourceLan = resources[lan];
                for (const ns of Object.keys(resourceLan)) {
                    const resource = resourceLan[ns];
                    value.formI18n.addResourceBundle(lan, ns, resource);
                }
            }
        }
        i18n.forceUpdate();
    }
}

export const tl = (name: string, options?: object) => {
    return i18n.value.t(name, options);
};
