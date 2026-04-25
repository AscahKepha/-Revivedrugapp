import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { persistor, store } from './app/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast'; // Switched to react-hot-toast

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
        {/* Customized Toaster for Drug-Revive Branding */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // Global default styles
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#0f766e', // teal-700
              borderRadius: '12px',
              border: '1px solid #ccfbf1', // teal-100
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 20px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },

            // Specific Success Style
            success: {
              iconTheme: {
                primary: '#0d9488', // teal-600
                secondary: '#ffffff',
              },
              style: {
                borderLeft: '4px solid #10b981', // emerald-500
              },
            },

            // Specific Error Style
            error: {
              iconTheme: {
                primary: '#e11d48', // rose-600
                secondary: '#ffffff',
              },
              style: {
                color: '#be123c', // rose-700
                borderLeft: '4px solid #ef4444', // red-500
                background: '#fff1f2', // rose-50
              },
            },
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);