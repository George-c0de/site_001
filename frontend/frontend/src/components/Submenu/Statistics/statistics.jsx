import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../redux/slices/selectors'
import { setPosts } from '../../redux/slices/userSlice'

const Statistics = () => {
	const dispatch = useDispatch()
	const { posts } = useSelector(getUser)
	console.log(posts)
	useEffect(() => {
		fetchPosts()
	}, [])

	// const [posts, setPosts] = useState({
	// 	money: 0,
	// 	all_transactions: 0,
	// 	coll_user: 0,
	// })

	async function fetchPosts() {
		try {
			const response = await axios.get('/api/get_all')
			dispatch(setPosts(response.data))
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div className='referals__container'>
			<ul className='statistic-info'>
				<li>
					{t`TOTAL USERS`}: <span>{posts.coll_user}</span>
				</li>
				<li>
					{t`TOTAL  TRANSACTIONS`}: <span>{posts.all_transactions}</span>
				</li>
				<li>
					{t`TOTAL PAYOUT`}: <span>{posts.money}</span>
				</li>
			</ul>
		</div>
	)
}

export default Statistics
