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

test("Admin Role: enable/disable of Edit/Delete with no selection", ()=>{
    let passedProps_selectedIds = [];
    let passedProps_AccountRole = "admin";
    const { getByText} = render(<ItemEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add Item").closest('button')).not.toBeDisabled();
    expect(getByText("Edit Item").closest('button')).toBeDisabled();
    expect(getByText("Delete Item").closest('button')).toBeDisabled();
});
test("Admin Role: enable/disable of Edit/Delete with one selection", ()=>{
    let passedProps_selectedIds = ["01"];
    let passedProps_AccountRole = "admin";
    const { getByText} = render(<ItemEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add Item").closest('button')).not.toBeDisabled();
    expect(getByText("Edit Item").closest('button')).not.toBeDisabled();
    expect(getByText("Delete Item").closest('button')).not.toBeDisabled();
});
test("Admin Role: enable/disable of Edit/Delete with two selection", ()=>{
    let passedProps_selectedIds = ["00","01"];
    let passedProps_AccountRole = "admin";
    const { getByText} = render(<ItemEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add Item").closest('button')).not.toBeDisabled();
    expect(getByText("Edit Item").closest('button')).toBeDisabled();
    expect(getByText("Delete Item").closest('button')).not.toBeDisabled();
});
test("Non-Admin Role: enable/disable of Edit/Delete with no selection", ()=>{
    let passedProps_selectedIds = [];
    let passedProps_AccountRole = "custodian";
    const { getByText} = render(<ItemEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Edit Item").closest('button')).toBeDisabled();
});
test("Non-Admin Role: enable/disable of Edit/Delete with one selection", ()=>{
    let passedProps_selectedIds = ["01"];
    let passedProps_AccountRole = "custodian";
    const { getByText} = render(<ItemEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Edit Item").closest('button')).not.toBeDisabled();
});
test("Non-Admin Role: enable/disable of Edit/Delete with two selection", ()=>{
    let passedProps_selectedIds = ["00","01"];
    let passedProps_AccountRole = "custodian";
    const { getByText} = render(<ItemEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Edit Item").closest('button')).toBeDisabled();
});