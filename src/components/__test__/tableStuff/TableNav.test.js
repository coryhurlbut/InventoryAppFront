import React from 'react';
import TableNav from './../../tableStuff/TableNav';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render: no props", ()=>{
    const { getByText} = render(<TableNav/>);
    
    expect(getByText("Available Items"));
    expect(getByText("Unavailable Items"));
});
test("Render: account signed in", ()=>{
    const { getByText} = render(<TableNav isUserContentVisible={true}/>);
    
    expect(getByText("Available Items"));
    expect(getByText("Unavailable Items"));
    expect(getByText("Users"));
});
test("Render: userContentVisible - false", ()=>{
    const { getByText} = render(<TableNav isUserContentVisible={false}/>);
    
    expect(getByText("Available Items"));
    expect(getByText("Unavailable Items"));
});