import React            from 'react';

import ContentBuilder   from './components/ContentBuilder';
import ErrorBoundary    from './ErrorBoundary';


export default class App extends React.Component {    
    render(){
        return(
            <>
                <ErrorBoundary fallback={<p>Something went wrong</p>}>
                    <ContentBuilder/>
                </ErrorBoundary>
            </>
        );
    };
};
