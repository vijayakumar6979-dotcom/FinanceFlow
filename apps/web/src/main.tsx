import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

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
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </QueryClientProvider>
            </ErrorBoundary>
        </React.StrictMode>,
    )
    console.log("App mounted successfully");
} catch (error) {
    console.error("Failed to mount app:", error);
}
