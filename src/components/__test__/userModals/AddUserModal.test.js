import React from 'react';
import AddUserModal from './../../userModals/AddUserModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';
import { Simulate } from 'react-dom/test-utils';

afterEach(cleanup);

//proply renders
test("renders: isOpen true", ()=>{
    const { getByText} = render(<AddUserModal isOpen={true}/>);
    
    expect(getByText("First Name"));
    expect(getByText("Last Name"));
    expect(getByText("Username"));
    expect(getByText("User Role"));
    expect(getByText("Password"));
    expect(getByText("Confirm Password"));
    expect(getByText("Phone Number"));

    expect(getByText("Submit").closest('input')).toBeDisabled();
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});

test("renders: isSignUp true", ()=>{
    const { getByText} = render(<AddUserModal isOpen={true} isSignUp={true} />);
    
    expect(getByText("First Name"));
    expect(getByText("Last Name"));
    expect(getByText("Username"));
    expect(getByText("Phone Number"));

    expect(getByText("Submit").closest('input')).toBeDisabled();
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});