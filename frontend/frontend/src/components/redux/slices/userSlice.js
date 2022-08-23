import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
	user: {
		id: '',
		money: '0.00',
		referral_link: '0',
		referral_amount: '0.00',
		missed_amount: '0.00',
		wallet: null,
		line_1: null,
		line_2: null,
		line_3: null,
		max_card: 0,
		admin_or: false,
		user: 0,
	},
	posts: {
		money: 0,
		all_transactions: 0,
		coll_user: 0,
	},
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetUser: state => {
			state = initialState;
		},
		setPosts: (state, action) => {
			state.posts = {
				...action.payload,
			}
		},
		setUser: (state, action) => {
			state.user = {
				...action.payload,
			}
		},
	},
})

// Action creators are generated for each case reducer function
export const { increment, setPosts, setUser } = userSlice.actions

export default userSlice.reducer
