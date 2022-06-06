import React from 'react';
import Table from './../../tableStuff/Table';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render", ()=>{
    // provide an empty implementation for window.alert
    //window.alert = () => {};

    //render(<Table/>);
});