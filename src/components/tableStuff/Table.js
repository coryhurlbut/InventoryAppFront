import React from 'react';

import { useTable, usePagination, useRowSelect } from 'react-table';

import '../../styles/Table.css'

//symbols for pagination
const PAGE_OF_DISPLAY = 'Page ';
const PAGE_OF_DISPLAY_NUM = ' of ';
const PAGE_OF_DISPLAY_FIRST_PAGE = '|<';
const PAGE_OF_DISPLAY_PREV_PAGE = '<';
const PAGE_OF_DISPLAY_NEXT_PAGE = '>';
const PAGE_OF_DISPLAY_LAST_PAGE = '>|';

const GO_TO_PAGE_DISPLAY = 'Go to page:';
const SHOW_NUMBER_OF_ROWS = 'Show: ';

//takes in the content, column schema, and role information to config table
function Table({ columns, data, ...props }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        toggleAllRowsSelected,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
            columns,
            data,
            //allows pagination to properly begin at page 1
            initialState: { pageIndex: 0 },
        },
        //useTable methods
        usePagination,
        useRowSelect
    );

    return(
        <div className='tableContainer'>
            <table {...getTableProps()}>
                <thead>
                    {/* a map loop to create header for each column index */}
                    {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        )
                                    )}
                                </tr>
                            )
                        )
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {/* another map loop to create the role */}
                    {page.map((row, i) => {
                        prepareRow(row)
                        if(
                            (props.userRole     === 'admin'     && 
                            props.contentType   !== undefined)  || 
                            (props.userRole     === 'custodian' && 
                            props.contentType   !== 'Users'     && 
                            props.contentType   !== undefined)
                        ) {
                            return(
                                <tr 
                                    {...row.getRowProps()} 
                                    {...row.getToggleRowSelectedProps()}
                                    indeterminate="false"
                                    onClick={() => {
                                        row.toggleRowSelected();
                                        props.setParentState(row.original);
                                    }} 
                                    className="dataRow" 
                                    title=""
                                    style={row.isSelected ?  //unable to style in other file due to needing the conditional changes
                                        {'backgroundColor': (row.index % 2 === 1 ? '#76c5ceb6' : '#a8f5feb6')} : 
                                        null
                                    }
                                >
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        } else {
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        }
                    })
                } 
                </tbody>
            </table>
            <div className="pagination">
                <span id='leftPagination'>
                    {GO_TO_PAGE_DISPLAY}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                    />
                </span>
                <span id='centerPagination'>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {PAGE_OF_DISPLAY_FIRST_PAGE}
                    </button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {PAGE_OF_DISPLAY_PREV_PAGE}
                    </button>
                    <span>
                        {PAGE_OF_DISPLAY}
                        <strong>
                            {pageIndex + 1} {PAGE_OF_DISPLAY_NUM} {pageOptions.length}
                        </strong>
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {PAGE_OF_DISPLAY_NEXT_PAGE}
                    </button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {PAGE_OF_DISPLAY_LAST_PAGE}
                    </button>
                </span>
                <select
                    id='rightPagination'
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {SHOW_NUMBER_OF_ROWS} {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Table