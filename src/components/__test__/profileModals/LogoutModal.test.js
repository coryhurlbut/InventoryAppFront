import React from 'react';
import LogoutModal from './../../profileModals/LogoutModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render: isOpen true", ()=>{
    const {getByText} = render(<LogoutModal isOpen={true}/>);
    
    expect(getByText("Are you sure you want to Log Out?"));
    
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});