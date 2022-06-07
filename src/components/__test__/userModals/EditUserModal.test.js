import React from 'react';
import EditUserModal from './../../userModals/EditUserModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';
import { Simulate } from 'react-dom/test-utils';

afterEach(cleanup);

//proply renders
test("renders: isOpen true, no data grabbed", ()=>{
    const { getByText} = render(<EditUserModal isOpen={true}/>);
    
    expect(getByText("Error Has Occured"));
    expect(getByText("An error occured while loading. Please refresh and try again."));
});