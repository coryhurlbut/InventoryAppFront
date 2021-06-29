import React, { useMemo } from 'react'
import { useTable, usePagination, useRowSelect } from 'react-table'
import MOCK_DATA from './MOCK_DATA.json'
import { COLUMNS, GROUPED_COLUMNS } from './columns'
import './table.css'
import { Checkbox } from './Checkbox'
import { TableScrollBar } from 'react-table-scrollbar';


export const HybridTable = (props) => {

    const columns = useMemo(() => COLUMNS, [])
    const data = props.data

    const { getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            nextPage,
            previousPage,
            canNextPage,
            canPreviousPage,
            pageOptions,
            gotoPage,
            rows,
            pageCount,
            setPageSize,
            state,
            prepareRow,
            selectedFlatRows
         } = useTable({
        columns,
        data,
        //initialState: { pageIndex : 2}   <----- how to initiate the starting page*it starts at index + 1
    }, 
    usePagination, useRowSelect, 
    (hooks) => {
        hooks.visibleColumns.push((columns) => {
            return [
                {
                    id: 'selection',
                    // Header: ({ getToggleAllRowsSelectedProps }) => (
                    //     <Checkbox {...getToggleAllRowsSelectedProps()} />
                    // ),
                    Cell: ({ row }) => (
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    )
                },
                ...columns
            ]
        })
    })

    // const { pageIndex, pageSize } = state
    // const firstPageRows = rows.slice(0,10)

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map((headerGroup) => (
                            <tr{...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>))}
                            </tr>
                        ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                    rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map( cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })
                                    }
                        </tr>
                    )})}
                </tbody>
                
            </table>
            {/* <span>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </span>
            <span>
                | Go to page: {' '}
                <input type='number' defaultValue={pageIndex + 1}
                onChange={e => {
                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(pageNumber)
                }}
                style={{ width: '50px' }} />
                </span> */}

            {/* value={pageSize} onChange={e => setPageSize(Number(e.target.value))}        <---This is feature to dictate how many items per page
                {
                    [10, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))*/}
            {/* <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>

            <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
            
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button> */}
        {/* <pre>
            <code>
                {JSON.stringify(
                    {
                        selectedFlatRows: selectedFlatRows.map((row) => row.original),
                    },
                    null,
                    2
                )}
            </code>
        </pre> */}
        </>
    )
}
