import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'; // ✅ IMPORTANT: ensure Tailwind CSS is imported

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-l3o4ptdu55y0moj7.us.auth0.com"
      clientId="kd3YNuSSeMHCnJjdAMT8YUDMEpmzX4NZ"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
