import React from 'react';
import SignItemInOutControls from './../../controls/SignItemInOutControls';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup, getQueriesForElement} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//proply renders
test("renders without proper props passed", ()=>{
    // provide an empty implementation for window.alert
    window.alert = () => {};

    render(<SignItemInOutControls/>);
});

test("Sign Item In: disabled", ()=>{
    let passedProps = [];
    let passedProps_InOrOut = "Sign Item In";
    const { getByText} = render(<SignItemInOutControls selectedIds={passedProps} inOrOut={passedProps_InOrOut}/>);
    
    expect(getByText("Sign Item In").closest('button')).toBeDisabled();
});
test("Sign Item In: enabled", ()=>{
    let passedProps = ["01"];
    let passedProps_InOrOut = "Sign Item In";
    const { getByText} = render(<SignItemInOutControls selectedIds={passedProps} inOrOut={passedProps_InOrOut}/>);
    
    expect(getByText("Sign Item In").closest('button')).not.toBeDisabled();
});

test("Sign Item Out: disabled", ()=>{
    let passedProps = [];
    let passedProps_InOrOut = "Sign Item Out";
    const { getByText} = render(<SignItemInOutControls selectedIds={passedProps} inOrOut={passedProps_InOrOut}/>);
    
    expect(getByText("Sign Item Out").closest('button')).toBeDisabled();
});
test("Sign Item Out: enabled", ()=>{
    let passedProps = ["01"];
    let passedProps_InOrOut = "Sign Item Out";
    const { getByText} = render(<SignItemInOutControls selectedIds={passedProps} inOrOut={passedProps_InOrOut}/>);
    
    expect(getByText("Sign Item Out").closest('button')).not.toBeDisabled();
});