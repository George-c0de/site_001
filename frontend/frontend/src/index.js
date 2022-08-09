import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { LangProvider } from './context/LangContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<LangProvider>
				<App />
			</LangProvider>
		</BrowserRouter>
	</React.StrictMode>
)
