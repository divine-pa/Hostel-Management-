// ==================================================
// MAIN.JSX — The Entry Point of the Entire Application
// ==================================================
// This is the VERY FIRST file that runs when the app starts.
// It does three things:
//
//   1. Creates the React "root" — attaches React to the HTML page
//      (looks for <div id="root"> in index.html)
//
//   2. Wraps everything in <BrowserRouter> — this enables
//      client-side routing (navigating between pages without
//      a full page reload)
//
//   3. Wraps everything in <StrictMode> — this is a development
//      helper that warns you about potential problems in your code
//      (it doesn't affect production builds)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
//import './styles.css'
import App from './App.jsx'

// Mount the React app to the DOM
// This finds the <div id="root"> in index.html and renders our app inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
