// __tests__/ContentList.test.js
import React from 'react';
import ItemEditControls from './../../controls/ItemEditControls'
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup, getQueriesForElement} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//proply renders
test("renders without proper props passed", ()=>{
    // provide an empty implementation for window.alert
    window.alert = () => {};

    render(<ItemEditControls/>);
});

test("testing enable/disable of Edit/Delete with no selection", ()=>{
    let passedProps = [];
    const { getByText} = render(<ItemEditControls selectedIds={passedProps} />);

    expect(getByText("Add Item").closest('button')).not.toBeDisabled();
    expect(getByText("Edit Item").closest('button')).toBeDisabled();
    expect(getByText("Delete Item").closest('button')).toBeDisabled();
});
test("testing enable/disable of Edit/Delete with one selection", ()=>{
    let passedProps = ["01"];
    const { getByText} = render(<ItemEditControls selectedIds={passedProps} />);

    expect(getByText("Add Item").closest('button')).not.toBeDisabled();
    expect(getByText("Edit Item").closest('button')).not.toBeDisabled();
    expect(getByText("Delete Item").closest('button')).not.toBeDisabled();
});
test("testing enable/disable of Edit/Delete with two selection", ()=>{
    let passedProps = ["00","01"];
    const { getByText} = render(<ItemEditControls selectedIds={passedProps}/>);

    expect(getByText("Add Item").closest('button')).not.toBeDisabled();
    expect(getByText("Edit Item").closest('button')).toBeDisabled();
    expect(getByText("Delete Item").closest('button')).not.toBeDisabled();
});