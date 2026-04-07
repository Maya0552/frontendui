import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'


// const OriginalErrorEvent = ErrorEvent;
// ErrorEvent = function(...args) {
//   console.trace("ErrorEvent called without new", args);
//   return new OriginalErrorEvent(...args);
// };
// ErrorEvent.prototype = OriginalErrorEvent.prototype;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
