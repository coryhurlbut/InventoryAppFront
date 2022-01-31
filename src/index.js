//Import dependencies
import dotenv                           from 'dotenv';
import React                            from 'react';
import ReactDOM                         from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
//Import components/functions
import App                              from './App';
import registerServiceWorker            from './registerServiceWorker';

//Loads .env variables
dotenv.config();
// localStorage.clear();

ReactDOM.render(
    <Router>
        <Route exact path="/" component={App} />
    </Router>,
    document.querySelector('#root')
);
registerServiceWorker();