// __tests__/ContentList.test.js
import React from 'react';
import ContentList from './../ContentList';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup, getQueriesForElement} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//proply renders
test("renders without crashing on first load", ()=>{
    //render(<ContentBuilder/>);
    const { getByText} = render(<ContentList/>);

    getByText("Available Items");                                      //expect(getByText("Inventory App")).not.toBeNull();
    getByText("Unavailable Items");
});