import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './styles/sections.css'
import './styles/hero.css'
import './styles/gallery.css'
import './styles/estimator.css'
import './styles/process.css'
import './styles/modal.css'
import builderConfig from './config/builderConfig.js'
import App from './App.jsx'

document.title = builderConfig.companyName

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
