import { addLocale, useLocale as localize } from 'ttag'
import * as cookie from './cookie'

const LOCALE_COOKIE = '__locale'

function setCookie(name, value, options) {
	options = options || {}

	var expires = options.expires

	if (typeof expires == 'number' && expires) {
		var d = new Date()
		d.setTime(d.getTime() + expires * 1000)
		expires = options.expires = d
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString()
	}

	value = encodeURIComponent(value)

	var updatedCookie = name + '=' + value

	for (var propName in options) {
		updatedCookie += '; ' + propName
		var propValue = options[propName]
		if (propValue !== true) {
			updatedCookie += '=' + propValue
		}
	}

	document.cookie = updatedCookie
}

function getLocale() {
	return cookie.get(LOCALE_COOKIE) || 'en'
}

export function saveLocale(locale) {
	cookie.set(LOCALE_COOKIE, locale)
}

// setup
let locale = getLocale()

if (locale !== 'en') {
	if (locale == 'undefined') {
		setCookie('__locale', 'en', 30)
	}
	const translationsObj = require(`../i18n/${locale}.po.json`)
	// const translationsObj = require(`../i18n/en.po.json`)
	addLocale(locale, translationsObj)
	localize(locale)
}
