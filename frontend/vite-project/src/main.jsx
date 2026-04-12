import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from './context/AuthContexts.jsx'
import {Toaster} from 'react-hot-toast'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <Toaster position="top-right" toastOptions={{duration:2500}}/>
      <App />
    </Authprovider>
  </StrictMode>,
)
