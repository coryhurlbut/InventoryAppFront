import React from 'react';
import SignItemInModal from './../../itemModals/SignItemInModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';
import { Simulate } from 'react-dom/test-utils';

afterEach(cleanup);

//proply renders
test("renders: isOpen true, no props", ()=>{
    // provide an empty implementation for window.alert
    window.alert = () => {};

    render(<SignItemInModal/>);
});
test("renders: isOpen true, selected props", ()=>{
    let passedProps = ["001"];
    const { getByText} = render(<SignItemInModal isOpen={true} _selectedObjects={passedProps}/>);
    
    expect(getByText("Submit").closest('button')).not.toBeDisabled();
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});