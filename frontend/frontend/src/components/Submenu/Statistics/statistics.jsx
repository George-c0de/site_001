import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import axios from 'axios'

const Statistics = () => {
	useEffect(() => {
		fetchPosts()
	}, [])

	const [posts, setPosts] = useState({
		money: 0,
		all_transactions: 0,
		coll_user: 0,
	})

	async function fetchPosts() {
		try {
			const response = await axios.get('/api/get_all')
			setPosts(response.data)
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
