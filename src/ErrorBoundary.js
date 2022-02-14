import React from "react";
import './styles/error.css';

/*
* Class that catches errors from any child in its component tree. 
* Does not catch errors from async code or from event handlers without using state to throw an error and re-render.
*/
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            hasError: false,
            error: '',
            isOpen: false
        };

        this.errorInfo = [];
    }

    // Update state so the next render will show the fallback UI.
    static getDerivedStateFromError(error) {
        return { hasError: true, error: error.message};
    }
  
    render() {
        if (this.state.hasError) {
            return(
                <div className="errorPage">
                    An error has occurred. Please refresh or try again later.
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}