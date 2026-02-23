import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 m-4">
                    <h2 className="text-lg font-bold">Something went wrong rendering this component.</h2>
                    <p className="font-mono text-xs mt-2">{this.state.error && this.state.error.toString()}</p>
                    <details className="mt-2 text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
