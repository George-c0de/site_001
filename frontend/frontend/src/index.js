import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { LangProvider } from './context/LangContext'
import { store } from './components/redux/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	// <React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<LangProvider>
					<App />
				</LangProvider>
			</Provider>
		</BrowserRouter>
	// </React.StrictMode>
)
