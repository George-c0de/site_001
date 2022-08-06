import React, { useState } from 'react'
import { UserId } from '../UserId/UserId'
// import { UserId } from '../../Rules/'
import Referals from '../Submenu/Referals/referals'
import Statistics from '../Submenu/Statistics/statistics'

//Images
import HeaderLogo from '../../assets/headerLogo.png'
import HeaderHuman from '../../assets/HeaderHuman.png'
import Telegram from '../../assets/telegram.svg'
import LogOut from '../../assets/logout.svg'
import axios from 'axios'
import Slide1 from '../../assets/slides/Slide1.png'
import Slide2 from '../../assets/slides/Slide2.png'
import Slide3 from '../../assets/slides/Slide3.png'
import Slide4 from '../../assets/slides/Slide4.png'
import Slide5 from '../../assets/slides/Slide5.png'
import Progress from '../../assets/rules-progress.svg'
import Cross from '../../assets/cross-svgrepo-com.svg'
import './rules.css'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'

function Rules2() {
	const galleryImg = [
		<img src={Slide1} alt='' className='gallery-img' id='1' />,
		<img src={Slide2} alt='' className='gallery-img' id='2' />,
		<img src={Slide3} alt='' className='gallery-img' id='3' />,
		<img src={Slide4} alt='' className='gallery-img' id='4' />,
		<img src={Slide5} alt='' className='gallery-img' id='5' />,
	]
	let [activeGallery, setActiveGallery] = useState(false)

	let [activeGalleryImg, setActiveGalleryImg] = useState(
		<img src={Slide1} alt='' className='gallery-img' id='1' />
	)

	const acivateGallery = index => {
		setActiveGallery(true)
		setActiveGalleryImg(index)
	}
	const scrollImg = side => {
		if (side === 'left') {
			if (activeGalleryImg.props.id === '1') {
				setActiveGalleryImg(galleryImg[galleryImg.length - 1])
			} else {
				const img = galleryImg.filter(
					elem => +elem.props.id === +activeGalleryImg.props.id - 1
				)
				setActiveGalleryImg(img[0])
			}
		} else {
			if (+activeGalleryImg.props.id >= galleryImg.length)
				setActiveGalleryImg(galleryImg[0])
			else {
				const img = galleryImg.filter(
					elem => +elem.props.id === +activeGalleryImg.props.id + 1
				)
				setActiveGalleryImg(img[0])
			}
		}
	}

	return (
		<>
			<div className='homepage-wrapper'>
				{!activeGallery && <Header />}
				<div className='rules__container'>
					<div className='rules__blocks-wrapper'>
						{!activeGallery && (
							<>
								<div className='rules__blocks'>
									<div
										className='rules__block'
										onClick={() =>
											acivateGallery(
												<img
													src={Slide1}
													alt=''
													className='gallery-img'
													id='1'
												/>
											)
										}
									>
										<img src={Slide1} alt='' className='rules-img' />
									</div>
									<div
										className='rules__block'
										onClick={() =>
											acivateGallery(
												<img
													src={Slide2}
													alt=''
													className='gallery-img'
													id='2'
												/>
											)
										}
									>
										<img src={Slide2} alt='' className='rules-img' />
									</div>
									<div
										className='rules__block'
										onClick={() =>
											acivateGallery(
												<img
													src={Slide3}
													alt=''
													className='gallery-img'
													id='3'
												/>
											)
										}
									>
										<img src={Slide3} alt='' className='rules-img' />
									</div>
								</div>
								<div className='rules__blocks'>
									<div
										className='rules__block'
										onClick={() =>
											acivateGallery(
												<img
													src={Slide4}
													alt=''
													className='gallery-img'
													id='4'
												/>
											)
										}
									>
										<img src={Slide4} alt='' className='rules-img' />
									</div>
									<div
										className='rules__block'
										onClick={() =>
											acivateGallery(
												<img
													src={Slide5}
													alt=''
													className='gallery-img'
													id='5'
												/>
											)
										}
									>
										<img src={Slide5} alt='' className='rules-img' />
									</div>
								</div>
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
				</div>
			</div>
		</>
	)
}
export default Rules2
