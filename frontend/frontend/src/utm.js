import {addLocale, useLocale as localize} from 'ttag';
import * as cookie from './cookie';

const LOCALE_COOKIE = 'utm';

function getLocale() {
    return cookie.get(LOCALE_COOKIE);
}

export function saveLocale(locale) {
    cookie.set(LOCALE_COOKIE, locale);
}

// setup
const locale = getLocale();
