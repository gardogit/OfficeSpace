import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './DesignSystemDemo.tsx' Sistema de diseño
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)