import React from 'react';
import AdminLogModal from './../../logModals/AdminLogModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render: isOpen true", ()=>{
    const {getByText} = render(<AdminLogModal isOpen={true}/>);

    expect(getByText("Admin Log"));
});