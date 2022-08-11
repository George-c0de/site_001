import { saveLocale } from '../../i18nInit'
import React, { useState, useContext } from 'react'
import * as cookie from '../../cookie'
import britain from '../../assets/languages/en.png'
import russia from '../../assets/languages/russia.png'
import france from '../../assets/languages/france.png'
import germany from '../../assets/languages/germany.png'
import italy from '../../assets/languages/italy.png'
import portugal from '../../assets/languages/portugal.png'
import spain from '../../assets/languages/spain.png'
import brazil from '../../assets/languages/brazil.png'
import argentina from '../../assets/languages/argentina.png'
import support from '../../Ảnh Pokemon Dự Trù/супорт.svg'

import './Lang.css'
import { LangContext } from '../../context/LangContext'


const languages = {
	en: britain,
	ru: russia,
	fr: france,
	de: germany,
	it: italy,
	pt: portugal,
	es: spain,
	br: brazil,
	ar: argentina,
}


const LOCALE_COOKIE = '__locale'

function getLocale() {
	return cookie.get(LOCALE_COOKIE) || 'en'
}
const locale = getLocale()
export const Lang = ({
	setOpenBurger,
	setOpenUserInfo,
	setOpenReferals,
	setOpenStatistics,
}) => {
	const { lang, updateLang } = useContext(LangContext)
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		console.log(open)
		setOpen(!open)
		if (open) {
			setOpenBurger(false)
			setOpenUserInfo(false)
			setOpenReferals(false)
			setOpenStatistics(false)
		}
	}

	const handleOpenList = e => {
		const lang = e.target.dataset.lang
		setOpen(!open)
		updateLang(lang)
		saveLocale(lang)
		window.location.reload()
	}

	const ref = React.useRef(null)

	const handleClickOutside = event => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOpen(false)
		}
	}

	React.useEffect(() => {
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [])

	return (
		<div className={'site-main'} ref={ref}>
			<img
				src={languages[locale]}
				className={open ? 'lang-icon-preview hidden' : 'lang-icon-preview'}
				alt=''
				onClick={handleOpen}
			/>
			<ul
				className={open ? 'lang-list' : 'lang-list hidden'}
				onClick={handleOpenList}
			>
				{Object.entries(languages).map(language => {
					return (
						<li>
							<img
								src={language[1]}
								className={'lang-icon'}
								data-lang={language[0]}
								alt=''
							/>
						</li>
					)
				})}
			</ul>
			{/* eslint-disable-next-line no-script-url,no-undef */}
			<div data-id='VTXS5kFl1j1' className='livechat_button'>
				<a
					href={
						'https://www.livechat.com/?utm_source=chat_button&utm_medium=referral&utm_campaign=lc_14364999'
					}
					id={'chat-btn'}
				>
					<img src={support} className={'support-icon-mainpage'} alt='' />
				</a>
			</div>
		</div>
	)
}
