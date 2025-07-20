import { createRoot } from 'react-dom/client'
import './main.scss'
import App from './App.jsx'
import './utilities/envCheck.js'

createRoot(document.getElementById('root')).render(
    <App />
)
