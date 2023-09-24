import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PWAPrompt from "react-ios-pwa-prompt";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <PWAPrompt
      promptOnVisit={1}
      timesToShow={3}
      copyClosePrompt="Close"
      permanentlyHideOnDismiss={false}
    />
  </React.StrictMode>
);
// ServiceWorkerRegistration.register();



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
