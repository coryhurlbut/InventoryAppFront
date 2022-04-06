import React from "react";
import './styles/ErrorBoundary.css';
import icon from './styles/Images/ErrorBoundaryPage.jpg';

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
    static _getDerivedStateFromError(error) {
        return { hasError: true, error: error.message};
    }
  
    render() {
        if (this.state.hasError) {
            return(
                <div className="errorPage">
                    <img src={ icon } alt='Error Icon'/>
                    <h1>An error has occurred</h1>
                    <h3>Please refresh or try again later</h3>
                </div>

            );
        } else {
            return this.props.children;
        };
    }
}