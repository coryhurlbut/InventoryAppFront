import React from 'react';
import UserEditControls from './../../controls/UserEditControls'
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup, getQueriesForElement} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//proply renders
test("renders without proper props passed", ()=>{
    // provide an empty implementation for window.alert
    window.alert = () => {};

    render(<UserEditControls/>);
});

test("Admin Role: disable of Edit/Delete with no selection", ()=>{
    let passedProps_selectedIds = [];
    let passedProps_AccountRole = "admin";
    const { getByText} = render(<UserEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add User").closest('button')).not.toBeDisabled();
    expect(getByText("Edit User").closest('button')).toBeDisabled();
    expect(getByText("Delete User").closest('button')).toBeDisabled();
});
test("Admin Role: enable of Edit/Delete with one selection", ()=>{
    let passedProps_selectedIds = ["01"];
    let passedProps_AccountRole = "admin";
    const { getByText} = render(<UserEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add User").closest('button')).not.toBeDisabled();
    expect(getByText("Edit User").closest('button')).not.toBeDisabled();
    expect(getByText("Delete User").closest('button')).not.toBeDisabled();
});
test("Admin Role: enable/disable of Edit/Delete with two selection", ()=>{
    let passedProps_selectedIds = ["00","01"];
    let passedProps_AccountRole = "admin";
    const { getByText} = render(<UserEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add User").closest('button')).not.toBeDisabled();
    expect(getByText("Edit User").closest('button')).toBeDisabled();
    expect(getByText("Delete User").closest('button')).not.toBeDisabled();
});
test("Custodian Role: enable of Add User with no selection", ()=>{
    let passedProps_selectedIds = [];
    let passedProps_AccountRole = "custodian";
    const { getByText} = render(<UserEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add User").closest('button')).not.toBeDisabled();
});
test("Custodian Role: enable of Add User with one selection", ()=>{
    let passedProps_selectedIds = ["01"];
    let passedProps_AccountRole = "custodian";
    const { getByText} = render(<UserEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add User").closest('button')).not.toBeDisabled();
});
test("Custodian Role: enable of Add User with two selection", ()=>{
    let passedProps_selectedIds = ["00","01"];
    let passedProps_AccountRole = "custodian";
    const { getByText} = render(<UserEditControls selectedIds={passedProps_selectedIds} accountRole={passedProps_AccountRole}/>);

    expect(getByText("Add User").closest('button')).not.toBeDisabled();
});