import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';

console.log("Starting App mount...");

try {
    const rootElement = document.getElementById('root');
    console.log("Root element:", rootElement);

    if (!rootElement) {
        throw new Error("Failed to find the root element");
    }

    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ErrorBoundary>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ErrorBoundary>
        </React.StrictMode>,
    )
    console.log("App mounted successfully");
} catch (error) {
    console.error("Failed to mount app:", error);
}
