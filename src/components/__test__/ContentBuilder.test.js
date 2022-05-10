// __tests__/ContentBuilder.test.js
import React from 'react';
import ReactDom from 'react-dom';
import ContentBuilder from './../ContentBuilder';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//proply renders
test("renders without crashing on first load", ()=>{
    render(<ContentBuilder/>);
});
//login button
test("renders button correctly", ()=>{
    const { getByTestId } = render(<ContentBuilder/>);
    expect(getByTestId('btnLogin'));
});