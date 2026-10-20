import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { startAnalytics } from './analytics'

{/* 
  Developed by Omar Estevez
  Contact: estevezneira_20055@hotmail.com
*/}

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
const root = document.getElementById('root')!
document.documentElement.lang = location.pathname.startsWith('/es') || location.pathname.startsWith('/admin') ? 'es' : 'en'
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
startAnalytics()
