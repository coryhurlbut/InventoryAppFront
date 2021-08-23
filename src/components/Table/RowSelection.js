import React, { useMemo } from 'react'
import { useTable, useRowSelect } from 'react-table'
import MOCK_DATA from './MOCK_DATA.json'
import { COLUMNS, GROUPED_COLUMNS } from './columns'
import './table.css'
import { Checkbox } from './Checkbox'
import TableScrollBar from 'react-table-scrollbar'


export const RowSelection = (props) => {

    const columns = useMemo(() => COLUMNS, [])
    const data = props.data



    const { getTableProps,
            getTableBodyProps,
            headerGroups,
            footerGroups,
            rows,
            prepareRow,
            selectedFlatRows
         } =
      useTable({
            columns,
            data,
        },
        useRowSelect,
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
                    
                    ...columns,
                    {
                        Header: 'Edit',
                        Cell: ({ row }) => (<button {...row.getToggleRowSelectedProps()}>
                                                Edit
                                            </button>)
                    }
                    
                ]
            })

        }
        
        )

        
    //const firstPageRows = rows.slice(0,10)

    
    
    
    return (
        <>
        <table {...getTableProps()}>
            <thead>
                {
                    headerGroups.map((headerGroup) => (
                        <tr{...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.Header}</th>))}
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
            {/* <tfoot>
                {
                    footerGroups.map(footerGroup => (
                        <tr {...footerGroup.getFooterGroupProps()}>
                            {
                                footerGroup.headers.map(column => (
                                    <td{...column.getFooterProps}>
                                    {
                                        column.render('Footer')
                                    }
                                    </td>
                                ))
                            }

                        </tr>
                    ))
                }
            </tfoot> */}
        </table>
        <pre>
            <code>
                
                {JSON.stringify(
                    {
                        selectedFlatRows: selectedFlatRows.map((row) => row.original),
                    },
                    null,
                    2
                )}
                
            </code>
        </pre>
        </>
    )
                    
}

