import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. IMPORT
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. BUNGKUS DI SINI */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter> {/* <-- 3. JANGAN LUPA PENUTUPNYA */}
  </React.StrictMode>,
)