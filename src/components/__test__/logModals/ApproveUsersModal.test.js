import React from 'react';
import ApproveUsersModal from './../../logModals/ApproveUsersModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render: isOpen true", ()=>{
    const {getByText} = render(<ApproveUsersModal isOpen={true}/>);

    expect(getByText("Pending Users"));
    expect(getByText("No available Pending Users"));
    
    expect(getByText("Approve").closest('button')).toBeDisabled();
    expect(getByText("Deny").closest('button')).toBeDisabled();
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});