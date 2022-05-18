import React from 'react';
import AddItemModal from './../../itemModals/AddItemModal';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';
import { Simulate } from 'react-dom/test-utils';

afterEach(cleanup);

//proply renders
test("renders: isOpen true", ()=>{
    const { getByText} = render(<AddItemModal isOpen={true}/>);
    
    expect(getByText("Item Number"));
    expect(getByText("Name"));
    expect(getByText("Description"));
    expect(getByText("Serial Number"));
    expect(getByText("Notes"));
    expect(getByText("Home Location"));
    expect(getByText("Specific Location"));

    expect(getByText("Submit").closest('input')).toBeDisabled();
    expect(getByText("Close").closest('button')).not.toBeDisabled();
});

test("Submitable: Add Item to Database", ()=>{
    const { getByTestId } = render(<AddItemModal isOpen={true}/>);
    Simulate.submit(getByTestId('form'));
});