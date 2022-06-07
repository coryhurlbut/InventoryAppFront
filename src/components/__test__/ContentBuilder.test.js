// __tests__/ContentBuilder.test.js
import React from 'react';
import ContentBuilder from './../ContentBuilder';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup, getQueriesForElement} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//proply renders
test("renders without crashing on first load", ()=>{
    //render(<ContentBuilder/>);
    const { getByText} = render(<ContentBuilder/>);

    getByText("Inventory App");                                      //expect(getByText("Inventory App")).not.toBeNull();

});
//login button
test("renders button correctly", () => {
    const { getByTestId } = render(<ContentBuilder/>);
    expect(getByTestId('btnLogin'));
});


test("user can click on login", () => {
    const { getByText} = render(<ContentBuilder/>);

    fireEvent.click(getByText("Login"));
    
});