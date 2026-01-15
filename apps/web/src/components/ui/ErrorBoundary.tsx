import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 max-w-2xl mx-auto mt-20 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-2xl">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h1>
                    <div className="bg-white dark:bg-black p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono border border-gray-200 dark:border-gray-800">
                        <p className="font-bold text-red-500 mb-2">{this.state.error?.toString()}</p>
                        <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
