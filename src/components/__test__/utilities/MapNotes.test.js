import React from 'react';
import MapNotes from './../../utilities/MapNotes';
import { isTSAnyKeyword } from '@babel/types';

import {render, fireEvent, waitFor, screen, cleanup} from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test("function call, empty string passed", ()=>{
    const returnedValue = MapNotes('');

    expect(returnedValue);
});