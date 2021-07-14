//Import dependencies
import dotenv                           from 'dotenv';
import React                            from 'react';
import ReactDOM                         from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider }                     from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
//Import components/functions
import App                              from './App';
import LoginModal                       from './components/LoginModal';
import registerServiceWorker            from './registerServiceWorker';

//Loads .env variables
dotenv.config();
localStorage.clear();
//Global State
const store = createStore(() => [], {}, applyMiddleware());

ReactDOM.render(
    <Provider store={store}>
        <Router>
                <Route exact path="/" component={App} />
        </Router>
    </Provider>, 
    document.querySelector('#root')
);
registerServiceWorker();