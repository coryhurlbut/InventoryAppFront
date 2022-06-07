import React from 'react';
import ItemLogModal from './../../logModals/ItemLogModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("Render: isOpen true", ()=>{
    const {getByText} = render(<ItemLogModal isOpen={true}/>);

    expect(getByText("Item Log"));
});