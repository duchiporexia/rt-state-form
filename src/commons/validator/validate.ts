import validate from 'validate.js';
import { i18n } from '../i18n/common';

validate.format = (msg, params) => {
    return i18n.value.t(msg, params);
};

export { validate };
