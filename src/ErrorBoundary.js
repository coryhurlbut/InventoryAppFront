import React from "react";

/*
* Class that catches errors from any child in its component tree. 
* Does not catch errors from async code or from event handlers without using state to throw an error and re-render.
*/
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            hasError: false,
            error: null
        };
    };
  
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error};
    };
  
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error.message, errorInfo);
    };
  
    render() {
        //TODO: Make a better error page
        return this.state.hasError ? <h1>An error has crossed the boundary!</h1> : this.props.children;
    };
}