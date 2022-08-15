import './rules.css'
import Header from '../Header/Header'
import Slide1 from '../../assets/slides/Slide1.png'
import Slide2 from '../../assets/slides/Slide2.png'
import Slide3 from '../../assets/slides/Slide3.png'
import Slide4 from '../../assets/slides/Slide4.png'
import Slide5 from '../../assets/slides/Slide5.png'
import Slide1Ge from '../../assets/slides/Slide1-de.png'
import Slide2Ge from '../../assets/slides/Slide2-de.png'
import Slide3Ge from '../../assets/slides/Slide3-de.png'
import Slide4Ge from '../../assets/slides/Slide4-de.png'
import Slide5Ge from '../../assets/slides/Slide5-de.png'
import Slide1Po from '../../assets/slides/Slide1-po.png'
import Slide2Po from '../../assets/slides/Slide2-po.png'
import Slide3Po from '../../assets/slides/Slide3-po.png'
import Slide4Po from '../../assets/slides/Slide4-po.png'
import Slide5Po from '../../assets/slides/Slide5-po.png'
import Slide1It from '../../assets/slides/Slide1-it.png'
import Slide2It from '../../assets/slides/Slide2-it.png'
import Slide3It from '../../assets/slides/Slide3-it.png'
import Slide4It from '../../assets/slides/Slide4-it.png'
import Slide5It from '../../assets/slides/Slide5-it.png'
import Slide1Sp from '../../assets/slides/Slide1-sp.png'
import Slide2Sp from '../../assets/slides/Slide2-sp.png'
import Slide3Sp from '../../assets/slides/Slide3-sp.png'
import Slide4Sp from '../../assets/slides/Slide4-sp.png'
import Slide5Sp from '../../assets/slides/Slide5-sp.png'
import Slide1Fr from '../../assets/slides/Slide1-fr.png'
import Slide2Fr from '../../assets/slides/Slide2-fr.png'
import Slide3Fr from '../../assets/slides/Slide3-fr.png'
import Slide4Fr from '../../assets/slides/Slide4-fr.png'
import Slide5Fr from '../../assets/slides/Slide5-fr.png'
import Slide1Ru from '../../assets/slides/Slide1-ru.png'
import Slide2Ru from '../../assets/slides/Slide2-ru.png'
import Slide3Ru from '../../assets/slides/Slide3-ru.png'
import Slide4Ru from '../../assets/slides/Slide4-ru.png'
import Slide5Ru from '../../assets/slides/Slide5-ru.png'
import Progress from '../../assets/rules-progress.svg'
import Cross from '../../assets/cross-svgrepo-com.svg'
import * as cookie from '../../cookie'
import React, { useState } from 'react'
import { t } from 'ttag'
import { motion } from 'framer-motion'

function Rules2() {
	const LOCALE_COOKIE = '__locale'
	const [galleryImgList, setActiveGalleryImgList] = React.useState([])
	React.useEffect(() => {
		switch (cookie.get(LOCALE_COOKIE) || 'en') {
			case 'de': {
				setActiveGalleryImgList([
					<img src={Slide1Ge} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Ge} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Ge} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Ge} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Ge} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'pt': {
				setActiveGalleryImgList([
					<img src={Slide1Po} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Po} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Po} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Po} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Po} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'it': {
				setActiveGalleryImgList([
					<img src={Slide1It} alt='' className='gallery-img' id='1' />,
					<img src={Slide2It} alt='' className='gallery-img' id='2' />,
					<img src={Slide3It} alt='' className='gallery-img' id='3' />,
					<img src={Slide4It} alt='' className='gallery-img' id='4' />,
					<img src={Slide5It} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'es': {
				setActiveGalleryImgList([
					<img src={Slide1Sp} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Sp} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Sp} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Sp} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Sp} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'fr': {
				setActiveGalleryImgList([
					<img src={Slide1Fr} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Fr} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Fr} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Fr} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Fr} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'ar': {
				setActiveGalleryImgList([
					<img src={Slide1Sp} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Sp} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Sp} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Sp} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Sp} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'br': {
				setActiveGalleryImgList([
					<img src={Slide1Po} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Po} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Po} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Po} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Po} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			case 'ru': {
				setActiveGalleryImgList([
					<img src={Slide1Ru} alt='' className='gallery-img' id='1' />,
					<img src={Slide2Ru} alt='' className='gallery-img' id='2' />,
					<img src={Slide3Ru} alt='' className='gallery-img' id='3' />,
					<img src={Slide4Ru} alt='' className='gallery-img' id='4' />,
					<img src={Slide5Ru} alt='' className='gallery-img' id='5' />,
				])
				break
			}
			default: {
				setActiveGalleryImgList([
					<img src={Slide1} alt='' className='gallery-img' id='1' />,
					<img src={Slide2} alt='' className='gallery-img' id='2' />,
					<img src={Slide3} alt='' className='gallery-img' id='3' />,
					<img src={Slide4} alt='' className='gallery-img' id='4' />,
					<img src={Slide5} alt='' className='gallery-img' id='5' />,
				])
			}
		}
		document.addEventListener('click', handleClick)
		document.addEventListener('touchend', handleClick)
	}, [])

	let [activeGallery, setActiveGallery] = useState(false)

	let [activeGalleryImg, setActiveGalleryImg] = useState(
		<img src={Slide1} alt='' className='gallery-img' id='1' />
	)

	const handleClick = event => {
		event.stopPropagation()
		if (event.path[0].classList.contains('galery')) {
			setActiveGallery(false)
		}
	}

	const acivateGallery = (src, id) => {
		setActiveGallery(true)
		setActiveGalleryImg(
			<img src={src} alt='' className='gallery-img' id={id} />
		)
	}

	const scrollImg = side => {
		if (side === 'left') {
			if (activeGalleryImg.props.id === '1') {
				setActiveGalleryImg(galleryImgList[galleryImgList.length - 1])
			} else {
				const img = galleryImgList.filter(
					elem => +elem.props.id === +activeGalleryImg.props.id - 1
				)
				setActiveGalleryImg(img[0])
			}
		} else {
			if (+activeGalleryImg.props.id >= galleryImgList.length)
				setActiveGalleryImg(galleryImgList[0])
			else {
				const img = galleryImgList.filter(
					elem => +elem.props.id === +activeGalleryImg.props.id + 1
				)
				setActiveGalleryImg(img[0])
			}
		}
	}

	function getLocale() {
		return cookie.get(LOCALE_COOKIE) || 'en'
	}

	return (
		<>
			<div className='homepage-wrapper'>
				{!activeGallery && <Header />}
				<motion.div
					className='rules__container'
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'linear', delay: 0.3 }}
				>
					<div className='rules__blocks-wrapper'>
						{!activeGallery && (
							<>
								<div className='rules__blocks'>
									{galleryImgList.map((elem, index) => (
										<div
											key={index}
											className='rules__block'
											onClick={() =>
												acivateGallery(elem.props.src, elem.props.id)
											}
										>
											<img src={elem.props.src} className='rules-img' alt='' />
										</div>
									))}
								</div>
								<a
									className='gallery-faq'
									target='__blank'
									href={`https://tokemon.info/${getLocale()}`}
								>
									{t`Still have questions?`} <br /> {t`Complete instructions`}
								</a>
							</>
						)}
						{activeGallery && (
							<div className='galery'>
								<img
									src={Cross}
									alt=''
									className='gallery-cross'
									onClick={() => setActiveGallery(false)}
								/>
								<img
									src={Progress}
									alt=''
									className='gallery-progress gallery-progress-left'
									onClick={() => scrollImg('left')}
								/>
								{activeGalleryImg}
								<img
									src={Progress}
									alt=''
									className='gallery-progress'
									onClick={() => scrollImg()}
								/>
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</>
	)
}
export default Rules2