//Import dependencies
import dotenv                           from 'dotenv';
import React                            from 'react';
import ReactDOM                         from 'react-dom';
//Import components/functions
import App                              from './App';
import registerServiceWorker            from './registerServiceWorker';

//Loads .env variables
dotenv.config();

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);
registerServiceWorker();