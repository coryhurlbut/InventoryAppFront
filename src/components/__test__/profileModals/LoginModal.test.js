import React from 'react';
import LoginModal from './../../profileModals/LoginModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render: isOpen true", ()=>{
    const {getByText} = render(<LoginModal isOpen={true}/>);
    
    expect(getByText("Username:"));
    expect(getByText("Password:"));
    
    expect(getByText("Sign Up").closest('button')).not.toBeDisabled();
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});