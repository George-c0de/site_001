import { addLocale, useLocale as localize } from 'ttag'
import * as cookie from './cookie'

const LOCALE_COOKIE = '__locale'

function getLocale() {
	return cookie.get(LOCALE_COOKIE) || 'en'
}

export function saveLocale(locale) {
	cookie.set(LOCALE_COOKIE, locale)
}

// setup
let locale = getLocale()

if (locale !== 'en') {
	if (locale == 'undefined') locale = 'ru'
	const translationsObj = require(`../i18n/${locale}.po.json`)
	addLocale(locale, translationsObj)
	localize(locale)
}
